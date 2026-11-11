import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode, MORSE_TABLE, REVERSE_TABLE } from '../src/index.js';

// Suppress console.warn during tests to keep output clean.
// The library intentionally warns on unknown characters/sequences;
// we still want to assert on the returned value.
const originalWarn = console.warn;
test.before(() => {
  console.warn = () => {};
});
test.after(() => {
  console.warn = originalWarn;
});

test('encode simple word', () => {
  assert.equal(encode('SOS'), '... --- ...');
});

test('encode multiple words', () => {
  assert.equal(encode('HELLO WORLD'), '.... . .-.. .-.. ---   .-- --- .-. .-.. -..');
});

test('encode is case insensitive', () => {
  assert.equal(encode('hello'), encode('HELLO'));
});

test('encode digits and punctuation', () => {
  assert.equal(encode('123'), '.---- ..--- ...--');
  assert.equal(encode('?'), '..--..');
});

test('encode unknown character becomes question mark', () => {
  // The character '#' is not in the Morse table.
  assert.equal(encode('A#B'), '.- ? -...');
});

test('encode empty string', () => {
  assert.equal(encode(''), '');
});

test('encode whitespace-only string', () => {
  assert.equal(encode('   '), '');
});

test('decode simple word', () => {
  assert.equal(decode('... --- ...'), 'SOS');
});

test('decode multiple words', () => {
  assert.equal(decode('.... . .-.. .-.. ---   .-- --- .-. .-.. -..'), 'HELLO WORLD');
});

test('decode unknown sequence becomes question mark', () => {
  assert.equal(decode('.- ...-.'), 'A?');
});

test('decode empty string', () => {
  assert.equal(decode(''), '');
});

test('decode whitespace-only string', () => {
  assert.equal(decode('   '), '');
});

test('round-trip encode then decode', () => {
  const original = 'THE QUICK BROWN FOX';
  assert.equal(decode(encode(original)), original);
});

test('round-trip with punctuation', () => {
  const original = 'HELLO, WORLD!';
  assert.equal(decode(encode(original)), original);
});

test('MORSE_TABLE and REVERSE_TABLE are inversely related', () => {
  for (const [char, code] of Object.entries(MORSE_TABLE)) {
    assert.equal(REVERSE_TABLE[code], char);
  }
});

test('encode throws on non-string input', () => {
  assert.throws(() => encode(123), TypeError);
});

test('decode throws on non-string input', () => {
  assert.throws(() => decode(null), TypeError);
});
