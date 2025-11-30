// Wrapper to import testable functions from script.js for Vitest
// Extracts the pure logic section from script.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read script.js content
const scriptPath = join(__dirname, '..', '..', 'script.js');
const scriptContent = readFileSync(scriptPath, 'utf-8');

// Extract just the pure logic section (before the browser check)
const pureLogicMatch = scriptContent.match(/\/\/ ============== PURE LOGIC[\s\S]*?(?=\/\/ ============== BROWSER-ONLY CODE)/);
const pureLogicCode = pureLogicMatch ? pureLogicMatch[0] : '';

// Evaluate and extract
const evalCode = `
${pureLogicCode}
({ battleOutcomeSets, matchesPattern, findBattleOutcome, createBattleKey })
`;

const exports = eval(evalCode);

export const battleOutcomeSets = exports.battleOutcomeSets;
export const matchesPattern = exports.matchesPattern;
export const findBattleOutcome = exports.findBattleOutcome;
export const createBattleKey = exports.createBattleKey;
