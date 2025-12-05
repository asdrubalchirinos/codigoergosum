/**
 * Elimina diacríticos de una cadena usando normalización Unicode.
 * Usa \p{Diacritic} si está disponible; si no, elimina el rango combinante básico.
 * @param {string} str
 * @returns {string}
 */
export function removeDiacritics(str) {
  if (typeof str !== 'string') return '';
  const nfd = str.normalize('NFD');
  let result;
  try {
    result = nfd.replace(/\p{Diacritic}/gu, '');
  } catch {
    // Fallback para entornos sin soporte Unicode property escapes
    result = nfd.replace(/[\u0300-\u036f]/g, '');
  }
  return result.normalize('NFC');
}
