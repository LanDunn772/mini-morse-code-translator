/**
 * Public entry point for the mini-morse-code-translator library.
 * Re-exports the core API so consumers can import from a single module.
 */
export { encode, decode, MORSE_TABLE, REVERSE_TABLE } from './core.js';
