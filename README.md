# mini-morse-code-translator

Encodes and decodes text to and from International Morse Code using dot-dash sequences and character separators.

## Usage

```js
import { encode, decode } from './src/index.js';

encode('SOS'); // '... --- ...'
decode('... --- ...'); // 'SOS'
encode('HELLO WORLD'); // '.... . .-.. .-.. ---   .-- --- .-. .-.. -..'
decode('.... . .-.. .-.. ---   .-- --- .-. .-.. -..'); // 'HELLO WORLD'
```

## Why this library exists

Most Morse code libraries either pull in a large dependency or silently drop characters they do not recognise. This library has zero dependencies and makes unknown characters visible by replacing them with `?` and logging a warning to the console. The trade-off is that it never throws on bad input, so callers who want strict validation must check for `?` themselves.

## API

### `encode(text: string): string`

Converts plain text to Morse code. Characters are separated by a single space, words by three spaces. Input is case-insensitive. Unknown characters become `?` and trigger a `console.warn`.

### `decode(morse: string): string`

Converts Morse code back to plain text. Words are separated by three spaces, characters by a single space. Unknown dot-dash sequences become `?` and trigger a `console.warn`.

### `MORSE_TABLE`

A frozen object mapping characters to their Morse code sequences.

### `REVERSE_TABLE`

A frozen object mapping Morse code sequences back to characters.

## Edge cases

The library treats any run of three or more spaces as a word separator during decoding. This means a single trailing space is ignored, but three spaces produce an empty word boundary. If you need strict spacing, normalise your input before calling `decode`.
