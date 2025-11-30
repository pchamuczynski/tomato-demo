import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { 
    findBattleOutcome, 
    createBattleKey, 
    battleOutcomeSets 
} from './scriptLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const yamlFile = join(__dirname, '..', 'epic_battle.yaml');

/**
 * Run tomato command and parse output into test cases
 */
function runTomato(functionName, options = []) {
    const cmd = ['tomato', '-H', '--ignore-constraints', '-f', `"${functionName}"`, yamlFile, ...options].join(' ');
    const output = execSync(cmd, { encoding: 'utf-8' });
    return output
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.split(',').map(s => s.trim()));
}

// Generate test cases from tomato
const standardBattleCases = runTomato('standard battle', ['-n3']);
describe('findBattleOutcome - Standard game', () => {
    const outcomes = battleOutcomeSets['Standard game'];
    
    it.each(standardBattleCases)(
        'battle(%s, %s, %s, %s, %s) should result in "%s"',
        (hero, heroWeapon, villain, villainWeapon, location, expectedOutcome) => {
            const battleKey = createBattleKey(
                hero.toLowerCase(),
                heroWeapon.toLowerCase(),
                villain.toLowerCase(),
                villainWeapon.toLowerCase(),
                location.toLowerCase()
            );
            const expected = expectedOutcome.toLowerCase().trim() === 'hero wins' 
                ? 'protagonist_wins' 
                : 'antagonist_wins';
            expect(findBattleOutcome(battleKey, outcomes)).toBe(expected);
        }
    );
});

const heroVillainCases = runTomato('hero-villain battle', ['-n2', '--tuples-from', 'hero::name,villain::name']);
describe('findBattleOutcome - hero-villain matchups', () => {
    const outcomes = battleOutcomeSets['hero-villain'];
    
    it.each(heroVillainCases)(
        'battle(%s, %s, %s, %s, %s) should result in "%s"',
        (hero, heroWeapon, villain, villainWeapon, location, expectedOutcome) => {
            const battleKey = createBattleKey(
                hero.toLowerCase(),
                heroWeapon.toLowerCase(),
                villain.toLowerCase(),
                villainWeapon.toLowerCase(),
                location.toLowerCase()
            );
            const expected = expectedOutcome.toLowerCase().trim() === 'hero wins' 
                ? 'protagonist_wins' 
                : 'antagonist_wins';
            expect(findBattleOutcome(battleKey, outcomes)).toBe(expected);
        }
    );
});
