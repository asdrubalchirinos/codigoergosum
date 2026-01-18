import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

// --- Configuration ---
const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:8b';
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

// --- Helper Functions ---

/**
 * Get the date range for the current week (Monday to Sunday)
 */
function getCurrentWeekRange() {
  const today = new Date();
  const day = today.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Calculate Monday of the current week
  const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today);
  monday.setDate(diffToMon);
  monday.setHours(0, 0, 0, 0);
  
  // Calculate Sunday of the current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
}

/**
 * Get ISO Week Number
 */
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}

/**
 * Check if a date string/object is within the range
 * correctly handling the UTC parsing of gray-matter
 */
function isDateInRange(dateInput, range) {
  const rawDate = new Date(dateInput);
  
  // gray-matter parses 'YYYY-MM-DD' as UTC midnight.
  // We want to interpret that as "The date YYYY-MM-DD", not a specific instant.
  // We create a new Local date using the UTC components of the parsed date.
  // This prevents "2026-01-19" (UTC) becoming "2026-01-18" (Local) in Western timezones.
  const d = new Date(
      rawDate.getUTCFullYear(),
      rawDate.getUTCMonth(),
      rawDate.getUTCDate()
  );

  // Normalize to integer YYYYMMDD for comparison
  const toInt = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return parseInt(`${year}${month}${day}`);
  };
  
  const val = toInt(d);
  const min = toInt(range.start);
  const max = toInt(range.end);

  return val >= min && val <= max;
}

/**
 * Recursively find blog posts
 */
function getAllBlogFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllBlogFiles(fullPath));
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      results.push(fullPath);
    }
  });
  
  return results;
}

/**
 * Call Ollama to generate structured summary
 */
async function generateStructuredData(articlesContent) {
  const prompt = `
Actúa como un editor de contenido técnico.
Analiza los siguientes artículos y genera un resumen estructurado para un "Weekly Recap".

GENERA UN JSON PURO CON ESTA ESTRUCTURA:
{
  "metaDescription": "Una frase corta (max 160 caracteres) que integre y conecte los temas de todos los artículos en una idea central cohesiva (evita enfocarte en un solo artículo).",
  "intro": "Párrafo introductorio conectando los temas de la semana.",
  "articles": [
    {
      "summary": "Resumen narrativo del artículo (2-3 oraciones).",
      "keyPoints": ["Frase completa con una idea principal.", "Otra frase completa con un aprendizaje clave."]
    }
  ],
  "conclusion": "Una conclusión integradora que identifique el hilo conductor común entre todos los artículos de la semana (evita resumir solo el último) y ofrezca una reflexión final sobre cómo estos conceptos se potencian entre sí."
}

IMPORTANTE:
- Mantén el orden de los artículos tal cual se presentan.
- El array "articles" debe tener la misma cantidad de elementos que los artículos provistos.
- Responde SOLO con el JSON válido.

Artículos:
${articlesContent}
`;

  console.log(`🤖 Solicitando análisis a Ollama model: ${MODEL}...`);

  try {
    const response = await fetch(OLLAMA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        format: "json", // Force JSON
        options: {
            num_ctx: 4096,
            num_predict: 2000
        }
      })
    });

    if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);

    const data = await response.json();
    let responseText = data.response;
    
    try {
        const parsed = JSON.parse(responseText);
        console.log("🐛 RAW RESPONSE DEBUG:", parsed); // Debug log
        return parsed;
    } catch (e) {
        console.error("JSON Parse Error on output:", responseText);
        // Fallback: try to find JSON block
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw e;
    }

  } catch (error) {
    console.log('Error calling Ollama:', error.message);
    return null;
  }
}

// --- Main Script ---

async function main() {
  console.log('📅 Calculando rango de fechas de la semana en curso...');
  const range = getCurrentWeekRange();
  console.log(`   Desde: ${range.start.toDateString()}`);
  console.log(`   Hasta: ${range.end.toDateString()}`);
  
  const currentWeekNumber = getWeekNumber(new Date());
  console.log(`   Semana: ${currentWeekNumber}`);

  console.log('🔍 Buscando artículos...');
  const allFiles = getAllBlogFiles(BLOG_DIR);
  
  const weeklyArticles = [];
  const allTags = new Set(); 

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    
    if (parsed.data.pubDate) {
      if (isDateInRange(parsed.data.pubDate, range)) {
        if (parsed.data.tags && parsed.data.tags.includes('resumen semanal')) {
             continue;
        }

        const filename = path.basename(filePath, path.extname(filePath));
        const slug = parsed.data.slug || filename;

        weeklyArticles.push({
          title: parsed.data.title,
          slug: slug,
          content: parsed.content,
          tags: parsed.data.tags || [],
          pubDate: new Date(parsed.data.pubDate) // Store for sorting
        });

        if (Array.isArray(parsed.data.tags)) {
          parsed.data.tags.forEach(t => allTags.add(t));
        }
      }
    }
  }

  // Sort articles by date ascending
  weeklyArticles.sort((a, b) => a.pubDate - b.pubDate);

  if (weeklyArticles.length === 0) {
    console.log('⚠️ No se encontraron artículos publicados esta semana.');
    return;
  }

  // Preserve order for JSON mapping
  const articlesText = weeklyArticles.map((a, index) => {
    return `--- ARTÍCULO ${index + 1} ---\nTítulo: ${a.title}\nContenido:\n${a.content.substring(0, 5000)}\n`;
  }).join('\n\n');

  // Generate Data
  const summaryData = await generateStructuredData(articlesText);

  if (!summaryData || !summaryData.articles) {
    console.error('❌ Falló la generación de datos estructurados.');
    return;
  }

  // --- Construct MDX Content Programmatically ---
  
  let mdxContent = "";
  // Intro
  if (summaryData.intro) {
      mdxContent += `${summaryData.intro}\n\n`;
  }

  // Articles
  weeklyArticles.forEach((article, index) => {
      // Try to match with generated data (assuming order is preserved)
      const generated = summaryData.articles[index];
      
      mdxContent += `**${article.title}**\n`;
      mdxContent += `<PostReference slug="${article.slug}" />\n\n`;
      
      if (generated) {
          mdxContent += `${generated.summary}\n\n`;
          if (generated.keyPoints && generated.keyPoints.length > 0) {
              mdxContent += `**Puntos Clave:**\n`;
              generated.keyPoints.forEach(p => {
                  mdxContent += `* ${p}\n`;
              });
              mdxContent += `\n`;
          }
      }
      mdxContent += `---\n\n`;
  });

  // Conclusion
  if (summaryData.conclusion) {
      mdxContent += `**Conclusión**\n\n${summaryData.conclusion}\n`;
  }


  // --- Save File ---
  
  const finalTags = ['resumen semanal', ...Array.from(allTags)];
  const title = `Resumen Semanal ${currentWeekNumber}`;
  const slug = slugify(title, { lower: true, strict: true });
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const targetDir = path.join(BLOG_DIR, String(year), month);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filename = `${slug}.mdx`;
  const filePath = path.join(targetDir, filename);

  const fileDescription = summaryData.metaDescription || "Resumen semanal de los artículos publicados en Código Ergo Sum.";

  const fileContent = `---
title: "${title}"
subtitle: "${fileDescription.replace(/"/g, '\\"')}"
pubDate: "${year}-${month}-${day}"
author: "Asdrúbal Chirinos (AI Assistant)"
tags: ${JSON.stringify(finalTags)}
heroImage: /placeholder.png
slug: ${slug}
---

import PostReference from '@components/PostReference.astro';

${mdxContent}
`;

  if (fs.existsSync(filePath)) {
    console.log(`⚠️ El archivo ya existe: ${filePath}. Sobrescribiendo...`);
  }

  fs.writeFileSync(filePath, fileContent);
  console.log(`✅ Resumen semanal generado con éxito!`);
  console.log(`📄 Archivo: ${filePath}`);
}

main().catch(console.error);
