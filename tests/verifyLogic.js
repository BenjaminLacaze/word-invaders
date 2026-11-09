/**
 * Script de prueba automatizada para verificar el funcionamiento de:
 * - GlossaryManager
 * - WordGenerator (casos de letras repetidas, cortas, largas, con espacios)
 * - LevelManager (reinicio determinista con exactamente la misma secuencia)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GlossaryManager } from '../src/managers/GlossaryManager.js';
import { WordGenerator } from '../src/systems/WordGenerator.js';
import { LevelManager } from '../src/managers/LevelManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const glossaryPath = path.join(__dirname, '../public/data/glossary.json');
const rawGlossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf-8'));

console.log('=== PRUEBAS DE LÓGICA DE WORD INVADERS ===\n');

const glossaryManager = new GlossaryManager(rawGlossary);
console.log(`[OK] Glosario cargado con ${glossaryManager.getTotalWords()} palabras.`);

// Casos de prueba obligatorios solicitados en la especificación
const testWords = ['DOG', 'CAT', 'APPLE', 'BOOK', 'TREE', 'COMPUTER', 'HELLO WORLD'];

for (const word of testWords) {
  const seq = WordGenerator.generateSequence(word);
  const integrity = WordGenerator.verifySequenceIntegrity(seq, word);
  const extras = seq.filter((n) => n.isExtra);
  const corrects = seq.filter((n) => !n.isExtra && !n.isSpace);

  // Verificar que ninguna letra sobrante esté entre las letras de la traducción
  const targetChars = new Set(word.replace(/\s+/g, '').split(''));
  const hasAmbiguousExtra = extras.some((n) => targetChars.has(n.char));

  if (!integrity) {
    throw new Error(`Fallo de integridad en la palabra "${word}"`);
  }
  if (extras.length === 0) {
    throw new Error(`No se generaron letras sobrantes para "${word}"`);
  }
  if (hasAmbiguousExtra) {
    throw new Error(`Se generó una letra sobrante ambigua para "${word}"`);
  }

  const formatted = seq
    .map((n) => (n.isSpace ? '[_]' : n.isExtra ? `(${n.char})` : `[${n.char}]`))
    .join(' ');
  console.log(
    `[OK] "${word}" -> Correctas: ${corrects.length}, Sobrantes: ${extras.length} | ${formatted}`
  );
}

// Prueba de reinicio idéntico en LevelManager
const levelManager = new LevelManager(glossaryManager);
const attempt1 = levelManager.getCurrentLevelData();
levelManager.registerError();
const attempt2 = levelManager.getCurrentLevelData();

const seq1Str = JSON.stringify(attempt1.sequence);
const seq2Str = JSON.stringify(attempt2.sequence);

if (seq1Str !== seq2Str) {
  throw new Error('El reinicio del nivel generó una secuencia diferente.');
}
console.log(
  `\n[OK] Reinicio determinista verificado: Errores = ${levelManager.getErrors()}, secuencia tras error idéntica al 100%.`
);
console.log('\n=== TODAS LAS PRUEBAS PASARON EXITOSAMENTE ===');
