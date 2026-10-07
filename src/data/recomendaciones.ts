/**
 * Mis recomendaciones (libros).
 *
 * Cómo añadir un libro:
 * 1. Copia uno de los bloques { ... } de abajo y pégalo al final de la lista.
 * 2. Cambia title, author y note.
 * 3. Pon la portada en public/images/recomendaciones/ (un jpg de unos 280 px
 *    de ancho basta) y escribe esa ruta en image.
 * 4. Pega en url el enlace de afiliado. Lo copias en Mercado Libre →
 *    Central de Afiliados. Tiene que empezar con https://.
 *
 * Cómo quitar un libro: borra su bloque { ... }, o deja url en PENDIENTE
 * para ocultarlo sin borrarlo.
 *
 * Mientras url sea PENDIENTE, ese libro no se muestra. Si ningún libro tiene
 * un enlace real, el bloque entero se oculta (así se puede fusionar este
 * cambio sin enseñar enlaces rotos en el sitio).
 */

/** Texto de relleno. Cámbialo por la URL completa cuando la tengas. */
export const PENDIENTE = "PENDIENTE";

/**
 * Enlace a tu lista pública de Mercado Libre (también sale de la
 * Central de Afiliados). Mientras sea PENDIENTE, no se muestra
 * "Ver toda mi lista".
 */
export const listaUrl = PENDIENTE;

export type Recomendacion = {
	title: string;
	author: string;
	note: string;
	image: string;
	url: string;
};

export const recomendaciones: Recomendacion[] = [
	{
		title: "Céntrate (Deep Work)",
		author: "Cal Newport",
		note: "Para recuperar la concentración.",
		image: "/images/recomendaciones/centrate.jpg",
		url: PENDIENTE, // pega aquí el enlace de afiliado de este libro
	},
	{
		title: "Empieza con el porqué",
		author: "Simon Sinek",
		note: "Para liderar con propósito.",
		image: "/images/recomendaciones/empieza-con-el-porque.jpg",
		url: PENDIENTE,
	},
	{
		title: "Hábitos atómicos",
		author: "James Clear",
		note: "Pequeños cambios, grandes resultados.",
		image: "/images/recomendaciones/habitos-atomicos.jpg",
		url: PENDIENTE,
	},
	{
		title: "El programador pragmático",
		author: "David Thomas y Andrew Hunt",
		note: "Un clásico para crecer como dev.",
		image: "/images/recomendaciones/el-programador-pragmatico.jpg",
		url: PENDIENTE,
	},
];

/** True si el texto es una URL http(s) de verdad, no el placeholder. */
export function esEnlaceReal(url: string): boolean {
	const u = url.trim();
	if (!u || u === PENDIENTE || u.includes("PENDIENTE")) return false;
	return u.startsWith("https://") || u.startsWith("http://");
}
