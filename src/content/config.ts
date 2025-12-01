import { defineCollection, z } from 'astro:content';

// Función para parsear fechas preservando exactamente año/mes/día sin conversiones de zona horaria
function parseDateExact(dateValue: unknown): Date {
	if (dateValue instanceof Date) return dateValue;
	
	const dateStr = String(dateValue);
	
	// Si el formato es YYYY-MM-DD, parsearlo como fecha local explícitamente
	const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
	if (match) {
		const [, year, month, day] = match;
		// Crear fecha local (no UTC) - esto preserva exactamente el día especificado
		// month - 1 porque Date usa meses base 0 (0 = enero, 11 = diciembre)
		return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
	}
	
	// Para otros formatos, intentar parse normal
	return new Date(dateStr);
}

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		// Transform string to Date object preservando la fecha exacta
		pubDate: z.preprocess(
			(val) => parseDateExact(val),
			z.date()
		),
		updatedDate: z.preprocess(
			(val) => val ? parseDateExact(val) : undefined,
			z.date().optional()
		),
		heroImage: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
