import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptPath = join(__dirname, '..', '..', 'script.js');

// Read the script content
const scriptContent = readFileSync(scriptPath, 'utf-8');

// Create comprehensive mock document object
const mockElement = {
    addEventListener: () => {},
    removeEventListener: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    style: {},
    querySelector: () => mockElement,
    querySelectorAll: () => [],
    appendChild: () => {},
    removeChild: () => {},
    innerHTML: '',
    textContent: '',
    src: '',
    alt: '',
};

global.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => mockElement,
    querySelectorAll: () => [],
    createElement: () => mockElement,
    getElementById: () => mockElement,
    body: mockElement,
};

global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
};

// Evaluate the script in a way that exposes the functions we need
const exposedFunctions = {};

// Wrap the script to expose functions
const wrappedScript = `
${scriptContent}

// Export the functions we need for testing
if (typeof findBattleOutcome !== 'undefined') exposedFunctions.findBattleOutcome = findBattleOutcome;
if (typeof createBattleKey !== 'undefined') exposedFunctions.createBattleKey = createBattleKey;
if (typeof battleOutcomeSets !== 'undefined') exposedFunctions.battleOutcomeSets = battleOutcomeSets;
`;

eval(wrappedScript);

export const { findBattleOutcome, createBattleKey, battleOutcomeSets } = exposedFunctions;