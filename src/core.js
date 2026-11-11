/**
 * Core Morse code translation logic.
 *
 * Design decisions:
 * - The International Morse Code table is stored as a plain object mapping
 *   uppercase letters, digits, and a few punctuation marks to their dot-dash
 *   sequences. This keeps lookup O(1) and makes the table easy to inspect.
 * - Encoding separates characters with a single space and words with three
 *   spaces (the standard convention). Decoding reverses this: split on three
 *   spaces to get words, then split each word on single spaces to get codes.
 * - Unknown characters during encoding are represented by the literal string
 *   '?' and a warning is emitted via console.warn. Unknown codes during
 *   decoding are represented by '?'. This is a deliberate trade-off: the
 *   library never throws on bad input so it can be used in streaming contexts,
 *   but it makes the failure visible.
 */

/**
 * International Morse Code mapping.
 * Only uppercase letters, digits, and common punctuation are included.
 * @type {Record<string, string>}
 */
export const MORSE_TABLE = Object.freeze({
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
});

/**
 * Reverse lookup table: dot-dash sequence -> character.
 * Built once at module load to avoid repeated inversion.
 * @type {Record<string, string>}
 */
export const REVERSE_TABLE = Object.freeze(
  Object.fromEntries(Object.entries(MORSE_TABLE).map(([char, code]) => [code, char]))
);

/**
 * Encodes a string of text into International Morse Code.
 *
 * Characters are separated by a single space, words by three spaces.
 * Unknown characters are replaced with '?' and a warning is logged.
 *
 * @param {string} text - The plain text to encode.
 * @returns {string} The Morse code representation.
 */
export function encode(text) {
  if (typeof text !== 'string') {
    throw new TypeError('encode expects a string');
  }
  // Normalize to uppercase because Morse is case-insensitive.
  const upper = text.toUpperCase();
  const words = upper.split(/\s+/).filter((word) => word.length > 0);
  const encodedWords = words.map((word) => {
    return Array.from(word)
      .map((char) => {
        const code = MORSE_TABLE[char];
        if (code === undefined) {
          console.warn(`mini-morse-code-translator: no Morse code for character '${char}'`);
          return '?';
        }
        return code;
      })
      .join(' ');
  });
  return encodedWords.join('   ');
}

/**
 * Decodes International Morse Code back into plain text.
 *
 * Words are separated by three spaces, characters by a single space.
 * Unknown dot-dash sequences become '?'.
 *
 * @param {string} morse - The Morse code to decode.
 * @returns {string} The decoded plain text.
 */
export function decode(morse) {
  if (typeof morse !== 'string') {
    throw new TypeError('decode expects a string');
  }
  const trimmed = morse.trim();
  if (trimmed === '') {
    return '';
  }
  const words = trimmed.split(/\s{3,}/);
  const decodedWords = words.map((word) => {
    return word
      .split(/\s+/)
      .filter((code) => code.length > 0)
      .map((code) => {
        const char = REVERSE_TABLE[code];
        if (char === undefined) {
          console.warn(`mini-morse-code-translator: unknown Morse sequence '${code}'`);
          return '?';
        }
        return char;
      })
      .join('');
  });
  return decodedWords.join(' ');
}
