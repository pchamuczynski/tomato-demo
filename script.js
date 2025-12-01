// Fantasy Battle Generator JavaScript

// ============== PURE LOGIC (testable) ==============

// Weapon constraints configuration
// Each constraint specifies when a weapon is NOT available
// Hero constraints can use: weapon, hero, villain, villainWeapon, location
// Villain constraints can use: weapon, villain, hero, heroWeapon, location
// If a field is omitted, it means "any"
const weaponConstraints = {
    hero: [
        // Lucy cannot use axe against ogre
        // { weapon: 'axe', hero: 'lucy', villain: 'ogre' },
        // Examples:
        // { weapon: 'sword', hero: 'susan', location: 'swamp' },
        // { weapon: 'bow', villain: 'dragon', villainWeapon: 'claws and teeth' },
        // { weapon: 'dagger', hero: 'peter', villain: 'witch', location: 'forest' },
    ],
    villain: [
        // Examples:
        // { weapon: 'mace', villain: 'ogre', hero: 'peter' },
        // { weapon: 'sword', villain: 'witch', heroWeapon: 'bow', location: 'castle' },
    ]
};

// Allowed weapons per character (if not listed, all standard weapons are available)
const allowedWeapons = {
    hero: {
        // All heroes can use all standard weapons by default
        // peter: ['sword', 'bow', 'crossbow', 'axe', 'dagger'],
        // susan: ['sword', 'bow', 'crossbow', 'axe', 'dagger'],
        // edmund: ['sword', 'bow', 'crossbow', 'axe', 'dagger'],
        // lucy: ['sword', 'bow', 'crossbow', 'axe', 'dagger'],
    },
    villain: {
        witch: ['sword', 'bow', 'crossbow', 'axe', 'dagger'],
        cyclops: ['sword', 'bow', 'crossbow', 'axe', 'dagger', 'mace'],
        ogre: ['sword', 'bow', 'crossbow', 'axe', 'dagger', 'mace'],
        dragon: ['claws and teeth']
    }
};

// Standard weapons available to all characters unless restricted
const standardWeapons = ['sword', 'bow', 'crossbow', 'axe', 'dagger'];

/**
 * Get available weapons for a hero based on constraints
 * @param {string} hero - Hero name
 * @param {string} villain - Current villain (optional)
 * @param {string} villainWeapon - Current villain weapon (optional)
 * @param {string} location - Current location (optional)
 * @returns {string[]} - Array of available weapon names
 */
function getHeroWeapons(hero, villain = null, villainWeapon = null, location = null) {
    // Start with allowed weapons or standard weapons
    let weapons = allowedWeapons.hero[hero] || [...standardWeapons];
    
    // Apply constraints
    weapons = weapons.filter(weapon => {
        return !weaponConstraints.hero.some(constraint => {
            const matchesWeapon = constraint.weapon === weapon;
            const matchesHero = !constraint.hero || constraint.hero === hero;
            const matchesVillain = !constraint.villain || constraint.villain === villain;
            const matchesVillainWeapon = !constraint.villainWeapon || constraint.villainWeapon === villainWeapon;
            const matchesLocation = !constraint.location || constraint.location === location;
            return matchesWeapon && matchesHero && matchesVillain && matchesVillainWeapon && matchesLocation;
        });
    });
    
    return weapons;
}

/**
 * Get available weapons for a villain based on constraints
 * @param {string} villain - Villain name
 * @param {string} hero - Current hero (optional)
 * @param {string} heroWeapon - Current hero weapon (optional)
 * @param {string} location - Current location (optional)
 * @returns {string[]} - Array of available weapon names
 */
function getVillainWeapons(villain, hero = null, heroWeapon = null, location = null) {
    // Start with allowed weapons or standard weapons
    let weapons = allowedWeapons.villain[villain] || [...standardWeapons];
    
    // Apply constraints
    weapons = weapons.filter(weapon => {
        return !weaponConstraints.villain.some(constraint => {
            const matchesWeapon = constraint.weapon === weapon;
            const matchesVillain = !constraint.villain || constraint.villain === villain;
            const matchesHero = !constraint.hero || constraint.hero === hero;
            const matchesHeroWeapon = !constraint.heroWeapon || constraint.heroWeapon === heroWeapon;
            const matchesLocation = !constraint.location || constraint.location === location;
            return matchesWeapon && matchesVillain && matchesHero && matchesHeroWeapon && matchesLocation;
        });
    });
    
    return weapons;
}

// Battle outcome configuration sets
const battleOutcomeSets = {
    "Standard game": {
        "edmund-*-dragon-*-swamp": "protagonist_wins",
        "lucy-dagger-witch-*-*": "protagonist_wins",
        "peter-*-cyclops-mace-*": "protagonist_wins",
        "susan-bow-ogre-*-*": "protagonist_wins",
        "*-*-*-*-*": "antagonist_wins"
    },
    "hero-villain": {
        "edmund-*-witch-*-*": "protagonist_wins",
        "lucy-*-dragon-*-*": "protagonist_wins",
        "peter-*-ogre-*-*": "protagonist_wins",
        "susan-*-cyclops-*-*": "protagonist_wins",
        "*-*-*-*-*": "antagonist_wins"
    },
    "villain-weapon-location": {
        "edmund-*-dragon-*-swamp": "protagonist_wins",
        "lucy-*-witch-*-desert": "protagonist_wins",
        "peter-*-cyclops-*-forest": "protagonist_wins",
        "susan-*-ogre-*-castle": "protagonist_wins",
        "*-*-*-*-*": "antagonist_wins"
    },
    "Chaotic": {}
};

function matchesPattern(battleKey, pattern) {
    const battleParts = battleKey.split('-');
    const patternParts = pattern.split('-');
    
    if (battleParts.length !== patternParts.length) {
        return false;
    }
    
    for (let i = 0; i < battleParts.length; i++) {
        if (patternParts[i] !== '*' && patternParts[i] !== battleParts[i]) {
            return false;
        }
    }
    
    return true;
}

function findBattleOutcome(battleKey, battleOutcomes) {
    for (const pattern in battleOutcomes) {
        if (pattern === battleKey || (pattern.includes('*') && matchesPattern(battleKey, pattern))) {
            return battleOutcomes[pattern];
        }
    }
    return null;
}

function createBattleKey(protagonist, protagonistWeapon, antagonist, antagonistWeapon, location) {
    return `${protagonist}-${protagonistWeapon}-${antagonist}-${antagonistWeapon}-${location}`;
}

// ============== BROWSER-ONLY CODE ==============
if (typeof document !== 'undefined') {

// Current active battle outcomes
let currentBattleOutcomes = battleOutcomeSets["Standard game"];

// Default outcomes for unconfigured combinations
const defaultOutcomes = ["protagonist_wins", "antagonist_wins", "both_defeated", "both_standing"];

// Battle descriptions
const sceneDescriptions = {
    desert: "The scorching sun beats down on the endless dunes as our hero prepares for battle.",
    forest: "Ancient trees tower overhead, their shadows dancing as the wind whispers through the leaves.",
    castle: "Stone walls echo with the sounds of approaching conflict in this medieval stronghold.",
    swamp: "Mist rises from the murky waters as danger lurks in this treacherous wetland."
};

const resultDescriptions = {
    protagonist_wins: "Victory! The hero stands triumphant, having overcome their foe through courage and skill!",
    antagonist_wins: "Defeat... The dark forces prove too powerful this time. But heroes never give up!",
    both_defeated: "Both warriors fall in this epic clash, neither able to claim victory in this brutal encounter.",
    both_standing: "An epic stalemate! Both combatants remain standing, respect earned through fierce battle."
};

const resultSummaries = {
    protagonist_wins: "Hero wins!",
    antagonist_wins: "Villain wins!",
    both_defeated: "Both defeated!",
    both_standing: "Stalemate!"
};

// DOM elements
const outcomeSetSelect = document.getElementById('outcomeSet');
const protagonistSelect = document.getElementById('protagonist');
const protagonistWeaponSelect = document.getElementById('protagonistWeapon');
const antagonistSelect = document.getElementById('antagonist');
const antagonistWeaponSelect = document.getElementById('antagonistWeapon');
const locationSelect = document.getElementById('location');
const fightBtn = document.getElementById('fight');

const battleForm = document.querySelector('.battle-form');
const battleScene = document.getElementById('battleScene');
const battleResult = document.getElementById('battleResult');
const sceneDescription = document.getElementById('sceneDescription');
const battleImage = document.getElementById('battleImage');
const resultDescription = document.getElementById('resultDescription');
const scoreDisplay = document.getElementById('scoreDisplay');

// Current battle state and game tracking
let currentBattle = {};
let gameStats = {
    totalBattles: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    stalemates: 0
};

// Game state
let defeatedVillains = new Set();
const allVillains = ['witch', 'cyclops', 'ogre', 'dragon'];
let battleCounter = 0;
let isUpdatingWeapons = false; // Prevent cascading updates

// Event listeners
outcomeSetSelect.addEventListener('change', () => {
    currentBattleOutcomes = battleOutcomeSets[outcomeSetSelect.value];
    resetGame(); // Reset game when outcome set changes
});
protagonistSelect.addEventListener('change', () => {
    if (isUpdatingWeapons) return;
    updateHeroWeapons();
    updateVillainWeapons();
    updateBattleScene();
});
protagonistWeaponSelect.addEventListener('change', () => {
    if (isUpdatingWeapons) return;
    updateVillainWeapons();
    updateBattleScene();
});
antagonistSelect.addEventListener('change', () => {
    if (isUpdatingWeapons) return;
    updateHeroWeapons();
    updateVillainWeapons();
    updateBattleScene();
});
antagonistWeaponSelect.addEventListener('change', () => {
    if (isUpdatingWeapons) return;
    updateHeroWeapons();
    updateBattleScene();
});
locationSelect.addEventListener('change', () => {
    if (isUpdatingWeapons) return;
    updateHeroWeapons();
    updateVillainWeapons();
    updateBattleScene();
});
fightBtn.addEventListener('click', executeBattle);
document.getElementById('resetGame').addEventListener('click', resetGame);

// Initialize the battle scene on page load
document.addEventListener('DOMContentLoaded', () => {
    // Populate outcome set selector
    Object.keys(battleOutcomeSets).forEach(setName => {
        const option = document.createElement('option');
        option.value = setName;
        option.textContent = setName;
        if (setName === 'Standard game') option.selected = true;
        outcomeSetSelect.appendChild(option);
    });
    
    updateHeroWeapons();
    updateVillainWeapons();
    updateBattleScene();
    updateGameDisplay();
    
    // Initialize battle result container as hidden
    const container = document.getElementById('battleResultContainer');
    container.style.visibility = 'hidden';
    container.style.opacity = '0';
});

function updateHeroWeapons() {
    isUpdatingWeapons = true;
    const hero = protagonistSelect.value;
    const villain = antagonistSelect.value;
    const villainWeapon = antagonistWeaponSelect.value;
    const location = locationSelect.value;
    const currentWeapon = protagonistWeaponSelect.value;
    
    const weapons = getHeroWeapons(hero, villain, villainWeapon, location);
    
    // Clear current options
    protagonistWeaponSelect.innerHTML = '';
    
    // Add available weapon options
    weapons.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon;
        option.textContent = weapon.charAt(0).toUpperCase() + weapon.slice(1);
        protagonistWeaponSelect.appendChild(option);
    });
    
    // Try to maintain current selection if it's available
    if (weapons.includes(currentWeapon)) {
        protagonistWeaponSelect.value = currentWeapon;
    } else {
        // Default to first available weapon
        protagonistWeaponSelect.value = weapons[0];
    }
    isUpdatingWeapons = false;
}

function updateVillainWeapons() {
    isUpdatingWeapons = true;
    const villain = antagonistSelect.value;
    const hero = protagonistSelect.value;
    const heroWeapon = protagonistWeaponSelect.value;
    const location = locationSelect.value;
    const currentWeapon = antagonistWeaponSelect.value;
    
    const weapons = getVillainWeapons(villain, hero, heroWeapon, location);
    
    // Clear current options
    antagonistWeaponSelect.innerHTML = '';
    
    // Add available weapon options
    weapons.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon;
        option.textContent = weapon.charAt(0).toUpperCase() + weapon.slice(1);
        antagonistWeaponSelect.appendChild(option);
    });
    
    // Try to maintain current selection if it's available
    if (weapons.includes(currentWeapon)) {
        antagonistWeaponSelect.value = currentWeapon;
    } else {
        // Default to first available weapon
        antagonistWeaponSelect.value = weapons[0];
    }
    isUpdatingWeapons = false;
}

function updateBattleScene() {
    // Get current selected values
    const newBattle = {
        protagonist: protagonistSelect.value,
        protagonistWeapon: protagonistWeaponSelect.value,
        antagonist: antagonistSelect.value,
        antagonistWeapon: antagonistWeaponSelect.value,
        location: locationSelect.value
    };
    
    // Check if configuration changed - if so, clear previous results
    if (currentBattle.outcome && 
        (currentBattle.protagonist !== newBattle.protagonist ||
         currentBattle.protagonistWeapon !== newBattle.protagonistWeapon ||
         currentBattle.antagonist !== newBattle.antagonist ||
         currentBattle.antagonistWeapon !== newBattle.antagonistWeapon ||
         currentBattle.location !== newBattle.location)) {
        clearLastBattleResult();
    }
    
    currentBattle = newBattle;
    
    // Update scene description
    sceneDescription.textContent = sceneDescriptions[currentBattle.location];
    
    // Create battle scene visualization
    createBattleScene();
}

function createBattleScene() {
    battleImage.innerHTML = `
        <div class="battle-visual">
            <div class="battle-canvas" id="battleCanvas">
                <div class="background-layer">
                    <img src="resources/backgrounds/${currentBattle.location}.jpg" 
                         alt="${currentBattle.location}" 
                         class="background-image"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="background-fallback" style="display: none;">
                        📍 ${currentBattle.location.charAt(0).toUpperCase() + currentBattle.location.slice(1)}
                    </div>
                </div>
                <div class="characters-layer">
                    <div class="protagonist-character">
                        <img src="resources/characters/${currentBattle.protagonist}-${currentBattle.protagonistWeapon}.png" 
                             alt="${currentBattle.protagonist} with ${currentBattle.protagonistWeapon}" 
                             class="character-image"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="character-fallback" style="display: none;">
                            <div class="character-name">${currentBattle.protagonist.charAt(0).toUpperCase() + currentBattle.protagonist.slice(1)}</div>
                            <div class="character-icon">🛡️</div>
                            <div class="weapon-display">${getWeaponIcon(currentBattle.protagonistWeapon)}</div>
                        </div>
                    </div>
                    <div class="vs-indicator">⚔️</div>
                    <div class="antagonist-character">
                        <img src="resources/characters/${currentBattle.antagonist}-${currentBattle.antagonistWeapon}.png" 
                             alt="${currentBattle.antagonist} with ${currentBattle.antagonistWeapon}" 
                             class="character-image"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="character-fallback" style="display: none;">
                            <div class="character-name">${currentBattle.antagonist.charAt(0).toUpperCase() + currentBattle.antagonist.slice(1)}</div>
                            <div class="character-icon">${getAntagonistIcon(currentBattle.antagonist)}</div>
                            <div class="weapon-display">${getWeaponIcon(currentBattle.antagonistWeapon)}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="battle-info">
                <p><strong>Battle Ready!</strong></p>
                <p>${currentBattle.protagonist.charAt(0).toUpperCase() + currentBattle.protagonist.slice(1)} (${currentBattle.protagonistWeapon}) vs ${currentBattle.antagonist.charAt(0).toUpperCase() + currentBattle.antagonist.slice(1)} (${currentBattle.antagonistWeapon}) in the ${currentBattle.location}</p>
            </div>
        </div>
    `;
}

function getWeaponIcon(weapon) {
    const weaponIcons = {
        sword: '⚔️',
        bow: '🏹',
        crossbow: '🏹',
        axe: '🪓',
        dagger: '🗡️',
        mace: '🔨',
        'claws and teeth': '🦷'
    };
    return weaponIcons[weapon] || '⚔️';
}

function getAntagonistIcon(antagonist) {
    const antagonistIcons = {
        witch: '🧙‍♀️',
        cyclops: '👁️',
        ogre: '👹',
        dragon: '🐉'
    };
    return antagonistIcons[antagonist] || '👹';
}

function executeBattle() {
    // Generate battle key with all 5 parameters
    const battleKey = createBattleKey(
        currentBattle.protagonist,
        currentBattle.protagonistWeapon,
        currentBattle.antagonist,
        currentBattle.antagonistWeapon,
        currentBattle.location
    );
    
    // Get outcome from configuration (exact match or wildcard) or use random default
    let outcome = findBattleOutcome(battleKey, currentBattleOutcomes);
    if (!outcome) {
        outcome = defaultOutcomes[Math.floor(Math.random() * defaultOutcomes.length)];
    }
    
    // Store outcome for result display
    currentBattle.outcome = outcome;
    
    // Update game statistics and track defeated villains
    gameStats.totalBattles++;
    switch(outcome) {
        case 'protagonist_wins':
            gameStats.wins++;
            battleCounter++;
            defeatedVillains.add(currentBattle.antagonist);
            break;
        case 'antagonist_wins':
            gameStats.losses++;
            break;
        case 'both_defeated':
            gameStats.draws++;
            break;
        case 'both_standing':
            gameStats.stalemates++;
            break;
    }
    
    // Update game display
    updateGameDisplay();
    
    // Show defeated characters inline
    showBattleResult(outcome);
    
    // Show result info above the battle scene
    showLastBattleResult(outcome);
    
    // Check for victory condition
    checkVictoryCondition();
}

function showBattleResult(outcome) {
    // Update character images to show defeated state
    const protagonistImg = document.querySelector('.protagonist-character img');
    const antagonistImg = document.querySelector('.antagonist-character img');
    const protagonistFallback = document.querySelector('.protagonist-character .character-fallback');
    const antagonistFallback = document.querySelector('.antagonist-character .character-fallback');
    

    
    // Update protagonist image based on outcome
    if (outcome === 'antagonist_wins' || outcome === 'both_defeated') {
        if (protagonistImg) {
            protagonistImg.src = `resources/characters/${currentBattle.protagonist}-defeated.png`;
            protagonistImg.alt = `${currentBattle.protagonist} defeated`;
            // Add rotation class for defeated hero (rotate left) with a slight delay to ensure image loads
            setTimeout(() => {
                protagonistImg.classList.add('character-defeated-hero');
            }, 100);
        }
        // Update fallback icon
        const protIcon = protagonistFallback.querySelector('.character-icon');
        if (protIcon) protIcon.textContent = '💀';
    }
    
    // Update antagonist image based on outcome
    if (outcome === 'protagonist_wins' || outcome === 'both_defeated') {
        if (antagonistImg) {
            antagonistImg.src = `resources/characters/${currentBattle.antagonist}-defeated.png`;
            antagonistImg.alt = `${currentBattle.antagonist} defeated`;
            // Add rotation class for defeated villain (rotate right) with a slight delay to ensure image loads
            setTimeout(() => {
                antagonistImg.classList.add('character-defeated-villain');
            }, 100);
        }
        // Update fallback icon
        const antIcon = antagonistFallback.querySelector('.character-icon');
        if (antIcon) antIcon.textContent = '💀';
    }
    
    // Remove VS indicator after battle
    const vsIndicator = document.querySelector('.vs-indicator');
    if (vsIndicator) vsIndicator.style.display = 'none';
}

function createResultScene(outcome) {
    let protagonistImage = '';
    let antagonistImage = '';
    
    // Determine which character images to show based on outcome
    switch (outcome) {
        case 'protagonist_wins':
            protagonistImage = `resources/characters/${currentBattle.protagonist}-${currentBattle.protagonistWeapon}.png`;
            antagonistImage = `resources/characters/${currentBattle.antagonist}-defeated.png`;
            break;
        case 'antagonist_wins':
            protagonistImage = `resources/characters/${currentBattle.protagonist}-defeated.png`;
            antagonistImage = `resources/characters/${currentBattle.antagonist}-${currentBattle.antagonistWeapon}.png`;
            break;
        case 'both_defeated':
            protagonistImage = `resources/characters/${currentBattle.protagonist}-defeated.png`;
            antagonistImage = `resources/characters/${currentBattle.antagonist}-defeated.png`;
            break;
        case 'both_standing':
            protagonistImage = `resources/characters/${currentBattle.protagonist}-${currentBattle.protagonistWeapon}.png`;
            antagonistImage = `resources/characters/${currentBattle.antagonist}-${currentBattle.antagonistWeapon}.png`;
            break;
    }
    
    return `
        <div class="result-canvas">
            <div class="background-layer">
                <img src="resources/backgrounds/${currentBattle.location}.jpg" 
                     alt="${currentBattle.location}" 
                     class="background-image"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="background-fallback" style="display: none;">
                    📍 ${currentBattle.location.charAt(0).toUpperCase() + currentBattle.location.slice(1)}
                </div>
            </div>
            <div class="result-characters">
                <div class="protagonist-result">
                    <img src="${protagonistImage}" 
                         alt="${currentBattle.protagonist}" 
                         class="result-character-image"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="character-fallback" style="display: none;">
                        <div class="character-name">${currentBattle.protagonist.charAt(0).toUpperCase() + currentBattle.protagonist.slice(1)}</div>
                        <div class="character-icon">${outcome.includes('protagonist_wins') || outcome.includes('both_standing') ? '🛡️' : '💀'}</div>
                    </div>
                </div>
                <div class="antagonist-result">
                    <img src="${antagonistImage}" 
                         alt="${currentBattle.antagonist}" 
                         class="result-character-image"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="character-fallback" style="display: none;">
                        <div class="character-name">${currentBattle.antagonist.charAt(0).toUpperCase() + currentBattle.antagonist.slice(1)}</div>
                        <div class="character-icon">${outcome.includes('antagonist_wins') || outcome.includes('both_standing') ? getAntagonistIcon(currentBattle.antagonist) : '💀'}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}



function updateScoreDisplay() {
    const winRate = gameStats.totalBattles > 0 ? ((gameStats.wins / gameStats.totalBattles) * 100).toFixed(1) : 0;
    
    scoreDisplay.innerHTML = `
        <h3>Battle Statistics</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-label">Total Battles:</span>
                <span class="stat-value">${gameStats.totalBattles}</span>
            </div>
            <div class="stat-item win">
                <span class="stat-label">Victories:</span>
                <span class="stat-value">${gameStats.wins}</span>
            </div>
            <div class="stat-item lose">
                <span class="stat-label">Defeats:</span>
                <span class="stat-value">${gameStats.losses}</span>
            </div>
            <div class="stat-item draw">
                <span class="stat-label">Mutual Defeats:</span>
                <span class="stat-value">${gameStats.draws}</span>
            </div>
            <div class="stat-item stalemate">
                <span class="stat-label">Stalemates:</span>
                <span class="stat-value">${gameStats.stalemates}</span>
            </div>
            <div class="stat-item winrate">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value">${winRate}%</span>
            </div>
        </div>
    `;
}

// Game functions
function showLastBattleResult(outcome) {
    // Update the scene description with battle outcome
    sceneDescription.textContent = resultDescriptions[outcome];
    
    // Hide the center overlay container since we're showing outcome in scene description
    const container = document.getElementById('battleResultContainer');
    container.style.visibility = 'hidden';
    container.style.opacity = '0';
    
    // Check for victory and show congratulations in scene description
    if (defeatedVillains.size === allVillains.length) {
        sceneDescription.textContent = "🎉 CONGRATULATIONS! 🎉 You have defeated all the villains and saved the realm! You are a true hero!";
    }
}

function clearLastBattleResult() {
    // Reset scene description to original location description
    if (currentBattle.location) {
        sceneDescription.textContent = sceneDescriptions[currentBattle.location];
    }
    
    // Hide the persistent result container
    const container = document.getElementById('battleResultContainer');
    container.style.visibility = 'hidden';
    container.style.opacity = '0';
    
    // Clear the text content
    container.querySelector('.battle-outcome-summary').textContent = '';
    container.querySelector('.result-text').textContent = '';
    container.querySelector('.battle-stats').innerHTML = '';
    container.querySelector('#victoryText').style.display = 'none';
    
    // Reset any battle result visual effects
    const protagonistImg = document.querySelector('.protagonist-character img');
    const antagonistImg = document.querySelector('.antagonist-character img');
    if (protagonistImg) {
        protagonistImg.classList.remove('character-defeated-hero');
    }
    if (antagonistImg) {
        antagonistImg.classList.remove('character-defeated-villain');
    }
    
    // Show VS indicator again
    const vsIndicator = document.querySelector('.vs-indicator');
    if (vsIndicator) vsIndicator.style.display = 'block';
    
    // Clear outcome from current battle
    delete currentBattle.outcome;
}

function updateGameDisplay() {
    // Update battle counter (won / total)
    document.getElementById('battleCounter').textContent = `${battleCounter} / ${gameStats.totalBattles}`;
    
    // Update defeated villains list
    const defeatedList = document.getElementById('defeatedList');
    defeatedList.innerHTML = '';
    
    if (defeatedVillains.size === 0) {
        defeatedList.innerHTML = '<span class="no-defeats">None yet</span>';
    } else {
        defeatedVillains.forEach(villain => {
            const villainElement = document.createElement('span');
            villainElement.className = 'defeated-villain';
            villainElement.innerHTML = `${getAntagonistIcon(villain)} ${villain.charAt(0).toUpperCase() + villain.slice(1)}`;
            defeatedList.appendChild(villainElement);
        });
    }
}

function checkVictoryCondition() {
    // Victory condition is now handled in showLastBattleResult
    // No screen switching needed
}

function resetGame() {
    // Reset all game state
    defeatedVillains.clear();
    battleCounter = 0;
    gameStats = {
        totalBattles: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        stalemates: 0
    };
    
    // Reset UI (no screen switching needed)
    document.getElementById('victoryMessage').style.display = 'none';
    
    // Clear any battle results
    clearLastBattleResult();
    
    // Reset battle scene
    updateAntagonistWeapons();
    updateBattleScene();
    updateGameDisplay();
}

// Add some CSS for the battle visualization
const style = document.createElement('style');
style.textContent = `
    body {
        margin: 0;
        padding: 0;
        height: 100vh;
        overflow: hidden;
    }
    
    .container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 10px;
        box-sizing: border-box;
    }
    
    h1 {
        margin: 0 0 10px 0;
        font-size: 1.8rem;
        text-align: center;
    }
    
    .game-stats {
        background: rgba(52, 73, 94, 0.9);
        padding: 10px 15px;
        border-radius: 6px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 15px;
        border-left: 4px solid #f39c12;
        flex-shrink: 0;
    }
    
    .outcome-set-selector {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    
    .outcome-set-selector label {
        font-size: 0.9rem;
        font-weight: bold;
        color: #f39c12;
    }
    
    .outcome-set-selector select {
        padding: 5px 8px;
        border-radius: 4px;
        border: 1px solid #34495e;
        background: rgba(52, 73, 94, 0.9);
        color: #ecf0f1;
        font-size: 0.9rem;
        min-width: 120px;
    }
    
    .battle-counter {
        font-size: 1.2rem;
        font-weight: bold;
        color: #f39c12;
    }
    
    .defeated-villains {
        flex-grow: 1;
        text-align: center;
    }
    
    .defeated-villains h3 {
        margin: 0 0 8px 0;
        color: #e74c3c;
        font-size: 0.9rem;
    }
    
    .defeated-list {
        display: flex;
        gap: 8px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .defeated-villain {
        background: rgba(231, 76, 60, 0.2);
        padding: 3px 8px;
        border-radius: 12px;
        border: 1px solid #e74c3c;
        font-size: 0.8rem;
        color: #ecf0f1;
    }
    
    .no-defeats {
        color: #95a5a6;
        font-style: italic;
    }
    
    .victory-message {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 15px;
        border: 3px solid #d35400;
        box-shadow: 0 0 15px rgba(243, 156, 18, 0.5);
        flex-shrink: 0;
    }
    
    .victory-message h2 {
        color: #fff;
        margin-bottom: 15px;
        font-size: 2rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    .victory-message p {
        color: #fff;
        font-size: 1rem;
        margin-bottom: 8px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .victory-text {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: #fff;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        font-weight: bold;
        font-size: 1.1rem;
        text-align: center;
        border: 2px solid #d35400;
        box-shadow: 0 0 10px rgba(243, 156, 18, 0.3);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        line-height: 1.4;
    }
    
    .battle-scene {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        position: relative;
    }
    
    .scene-description {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px 20px;
        border-radius: 8px;
        text-align: center;
        font-size: 1rem;
        color: #ecf0f1;
        max-width: 80%;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .battle-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .battle-visual {
        text-align: center;
        color: #ecf0f1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .battle-canvas, .result-canvas {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
        margin: 0 auto;
        border: 2px solid #34495e;
        flex-shrink: 0;
    }
    
    .background-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    
    .background-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
    }
    
    .background-fallback {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #34495e, #2c3e50);
        font-size: 1.5rem;
        color: #ecf0f1;
        font-weight: bold;
    }
    
    .characters-layer, .result-characters {
        position: absolute;
        bottom: 20%;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 70%;
        padding: 15px;
        min-height: 0;
    }
    
    .protagonist-character, .antagonist-character,
    .protagonist-result, .antagonist-result {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 45%;
    }
    
    .character-image, .result-character-image {
        max-width: 20vw;
        max-height: 30vh;
        height: 30vh;
        object-fit: contain;
        filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.7));
    }
    
    .protagonist-character .character-image,
    .protagonist-result .result-character-image {
        max-width: 15vw;
        max-height: 25vh;
        height: 25vh;
    }
    
    .antagonist-character .character-image,
    .antagonist-result .result-character-image {
        max-width: 18vw;
        max-height: 30vh;
        height: 30vh;
    }
    
    .vs-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        color: #e74c3c;
        font-weight: bold;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px 20px;
        border-radius: 20px;
        z-index: 3;
        border: 2px solid #f39c12;
    }
    
    .character-fallback {
        text-align: center;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 8px;
        border: 2px solid #34495e;
    }
    
    .character-name {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: #f39c12;
    }
    
    .character-icon {
        font-size: 3rem;
        margin: 10px 0;
    }
    
    .weapon-display {
        font-size: 2rem;
        margin: 10px 0;
    }
    
    .battle-form {
        flex-shrink: 0;
        padding: 10px 0;
    }
    
    .form-row {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    
    .form-group label {
        font-size: 0.9rem;
        font-weight: bold;
        color: #f39c12;
    }
    
    .form-group select {
        padding: 5px 8px;
        border-radius: 4px;
        border: 1px solid #34495e;
        background: rgba(52, 73, 94, 0.9);
        color: #ecf0f1;
        font-size: 0.9rem;
    }
    
    #fight {
        padding: 8px 20px;
        font-size: 1rem;
        margin-top: 5px;
    }
    
    .battle-info {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        background: rgba(0, 0, 0, 0.8);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 1rem;
        color: #ecf0f1;
        max-width: 80%;
        text-align: center;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .battle-result-visual {
        margin: 20px 0;
    }
    
    .result-characters {
        min-height: 250px;
    }
    
    .result-info, .last-battle-result {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        background: rgba(0, 0, 0, 0.9);
        padding: 20px 30px;
        border-radius: 10px;
        text-align: center;
        border: 2px solid #f39c12;
        flex-shrink: 0;
        min-height: 60px;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        backdrop-filter: blur(6px);
        max-width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
    }
    
    .battle-outcome-summary {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: #f39c12;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 2px solid #f39c12;
        padding: 8px 16px;
        border-radius: 6px;
        background: rgba(243, 156, 18, 0.1);
        display: inline-block;
    }
    
    .result-text {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 15px;
        color: #e74c3c;
    }
    
    .battle-stats {
        font-size: 1rem;
        margin-bottom: 20px;
        color: #bdc3c7;
        line-height: 1.4;
    }
    
    .character-image.character-defeated-hero {
        transform: rotate(-90deg) !important;
        transition: transform 0.8s ease-in-out;
        transform-origin: center center;
    }
    
    .character-image.character-defeated-villain {
        transform: rotate(90deg) !important;
        transition: transform 0.8s ease-in-out;
        transform-origin: center center;
    }
    
    .battle-summary {
        background: rgba(52, 73, 94, 0.9);
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
    }
    
    .battle-summary h3 {
        color: #f39c12;
        margin-bottom: 15px;
        text-align: center;
    }
    
    .battle-summary p {
        margin-bottom: 8px;
        font-size: 1.1rem;
    }
    
    @media (max-width: 600px) {
        .battle-participants {
            flex-direction: column;
        }
        
        .vs-indicator {
            margin: 15px 0;
        }
        
        .protagonist-side, .antagonist-side {
            margin-bottom: 10px;
        }
    }
`;
document.head.appendChild(style);

} // end of: if (typeof document !== 'undefined')