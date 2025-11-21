// Fantasy Battle Generator JavaScript

// Battle outcome configuration
const battleOutcomes = {
    // Format: "protagonist-protagonistWeapon-antagonist-antagonistWeapon-location": "outcome"
    // Outcomes: "protagonist_wins", "antagonist_wins", "both_defeated", "both_standing"
    
    // Sample battles (hero-heroWeapon-villain-villainWeapon-location)
    "peter-sword-witch-sword-castle": "protagonist_wins",
    "peter-bow-witch-axe-forest": "both_standing",
    "peter-axe-witch-bow-desert": "antagonist_wins",
    "peter-sword-cyclops-axe-desert": "both_defeated",
    "peter-bow-cyclops-sword-castle": "protagonist_wins",
    "peter-axe-ogre-bow-swamp": "antagonist_wins",
    
    "susan-bow-witch-sword-forest": "protagonist_wins",
    "susan-sword-cyclops-axe-castle": "both_standing",
    "susan-bow-ogre-sword-swamp": "protagonist_wins",
    "susan-axe-witch-bow-desert": "both_defeated",
    
    "edmund-sword-witch-axe-desert": "both_standing",
    "edmund-axe-cyclops-sword-forest": "antagonist_wins",
    "edmund-sword-ogre-bow-castle": "protagonist_wins",
    "edmund-bow-witch-sword-swamp": "both_defeated",
    
    "lucy-bow-witch-sword-castle": "protagonist_wins",
    "lucy-sword-cyclops-axe-swamp": "both_defeated",
    "lucy-axe-ogre-sword-forest": "antagonist_wins",
    "lucy-axe-witch-bow-desert": "both_standing",
    
    // Additional battles with new weapons
    "peter-crossbow-witch-dagger-forest": "protagonist_wins",
    "peter-dagger-cyclops-mace-castle": "antagonist_wins",
    "susan-crossbow-ogre-mace-desert": "both_defeated",
    "susan-dagger-witch-crossbow-swamp": "both_standing",
    "edmund-crossbow-cyclops-dagger-forest": "protagonist_wins",
    "edmund-dagger-ogre-crossbow-castle": "antagonist_wins",
    "lucy-crossbow-witch-dagger-desert": "both_standing",
    "lucy-dagger-cyclops-crossbow-swamp": "both_defeated",
    
    // Mace-specific battles for cyclops and ogre
    "peter-sword-cyclops-mace-desert": "antagonist_wins",
    "susan-bow-ogre-mace-forest": "both_defeated",
    "edmund-axe-cyclops-mace-castle": "protagonist_wins",
    "lucy-dagger-ogre-mace-swamp": "antagonist_wins",
    
    // Wildcard patterns - more specific patterns should come after exact matches
    "edmund-*-*-*-forest": "protagonist_wins",  // Edmund always wins in forest
    "lucy-bow-*-*-*": "protagonist_wins",       // Lucy with bow always wins
    "*-*-cyclops-mace-*": "antagonist_wins",   // Cyclops with mace always wins
    "*-dagger-witch-*-swamp": "both_defeated",  // Dagger vs witch in swamp always results in both defeated
    "susan-*-ogre-*-*": "both_standing"         // Susan vs ogre always results in stalemate
};

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
const protagonistSelect = document.getElementById('protagonist');
const protagonistWeaponSelect = document.getElementById('protagonistWeapon');
const antagonistSelect = document.getElementById('antagonist');
const antagonistWeaponSelect = document.getElementById('antagonistWeapon');
const locationSelect = document.getElementById('location');
const fightBtn = document.getElementById('fight');
const tryAgainBtn = document.getElementById('tryAgain');

const battleForm = document.querySelector('.battle-form');
const battleScene = document.getElementById('battleScene');
const battleResult = document.getElementById('battleResult');
const sceneDescription = document.getElementById('sceneDescription');
const battleImage = document.getElementById('battleImage');
const resultDescription = document.getElementById('resultDescription');
const scoreDisplay = document.getElementById('scoreDisplay');

// Current battle state and score tracking
let currentBattle = {};
let gameStats = {
    totalBattles: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    stalemates: 0
};

// Event listeners
protagonistSelect.addEventListener('change', updateBattleScene);
protagonistWeaponSelect.addEventListener('change', updateBattleScene);
antagonistSelect.addEventListener('change', () => {
    updateAntagonistWeapons();
    updateBattleScene();
});
antagonistWeaponSelect.addEventListener('change', updateBattleScene);
locationSelect.addEventListener('change', updateBattleScene);
fightBtn.addEventListener('click', executeBattle);
tryAgainBtn.addEventListener('click', resetBattle);

// Initialize the battle scene on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAntagonistWeapons();
    updateBattleScene();
});

function updateAntagonistWeapons() {
    const antagonist = antagonistSelect.value;
    const currentWeapon = antagonistWeaponSelect.value;
    
    // Define available weapons for each antagonist
    const availableWeapons = {
        witch: ['sword', 'bow', 'crossbow', 'axe', 'dagger'],
        cyclops: ['sword', 'bow', 'crossbow', 'axe', 'dagger', 'mace'],
        ogre: ['sword', 'bow', 'crossbow', 'axe', 'dagger', 'mace']
    };
    
    const weapons = availableWeapons[antagonist] || ['sword', 'bow', 'crossbow', 'axe', 'dagger'];
    
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
}

function updateBattleScene() {
    // Get current selected values
    currentBattle = {
        protagonist: protagonistSelect.value,
        protagonistWeapon: protagonistWeaponSelect.value,
        antagonist: antagonistSelect.value,
        antagonistWeapon: antagonistWeaponSelect.value,
        location: locationSelect.value
    };
    
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
        mace: '🔨'
    };
    return weaponIcons[weapon] || '⚔️';
}

function getAntagonistIcon(antagonist) {
    const antagonistIcons = {
        witch: '🧙‍♀️',
        cyclops: '👁️',
        ogre: '👹'
    };
    return antagonistIcons[antagonist] || '👹';
}

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

function findBattleOutcome(battleKey) {
    // First, try exact match
    if (battleOutcomes[battleKey]) {
        return battleOutcomes[battleKey];
    }
    
    // Then, try wildcard patterns
    for (const pattern in battleOutcomes) {
        if (pattern.includes('*') && matchesPattern(battleKey, pattern)) {
            return battleOutcomes[pattern];
        }
    }
    
    return null;
}

function executeBattle() {
    // Generate battle key with all 5 parameters
    const battleKey = `${currentBattle.protagonist}-${currentBattle.protagonistWeapon}-${currentBattle.antagonist}-${currentBattle.antagonistWeapon}-${currentBattle.location}`;
    
    // Get outcome from configuration (exact match or wildcard) or use random default
    let outcome = findBattleOutcome(battleKey);
    if (!outcome) {
        outcome = defaultOutcomes[Math.floor(Math.random() * defaultOutcomes.length)];
    }
    
    // Store outcome for result display
    currentBattle.outcome = outcome;
    
    // Update game statistics
    gameStats.totalBattles++;
    switch(outcome) {
        case 'protagonist_wins':
            gameStats.wins++;
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
    
    // Show defeated characters inline
    showBattleResult(outcome);
    
    // Hide form and show result controls
    document.querySelector('.form-row').style.display = 'none';
    fightBtn.style.display = 'none';
    
    // Show result info and try again button
    const resultInfo = document.createElement('div');
    resultInfo.className = 'result-info';
    resultInfo.innerHTML = `
        <div class="battle-outcome-summary" data-testid="battle-outcome">${resultSummaries[outcome]}</div>
        <div class="result-text">${resultDescriptions[outcome]}</div>
        <div class="battle-stats">
            <strong>Battle ${gameStats.totalBattles}:</strong> 
            ${currentBattle.protagonist.charAt(0).toUpperCase() + currentBattle.protagonist.slice(1)} (${currentBattle.protagonistWeapon}) vs 
            ${currentBattle.antagonist.charAt(0).toUpperCase() + currentBattle.antagonist.slice(1)} (${currentBattle.antagonistWeapon}) 
            in ${currentBattle.location}
        </div>
        <button id="tryAgainInline" class="btn btn-secondary">Try Again</button>
    `;
    
    // Remove any existing result info
    const existing = document.querySelector('.result-info');
    if (existing) existing.remove();
    
    // Add result info after battle form
    document.querySelector('.battle-form').appendChild(resultInfo);
    
    // Add event listener to new try again button
    document.getElementById('tryAgainInline').addEventListener('click', resetBattle);
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

function resetBattle() {
    // Show form controls again
    document.querySelector('.form-row').style.display = 'flex';
    fightBtn.style.display = 'block';
    
    // Remove result info
    const resultInfo = document.querySelector('.result-info');
    if (resultInfo) resultInfo.remove();
    
    // Show VS indicator again
    const vsIndicator = document.querySelector('.vs-indicator');
    if (vsIndicator) vsIndicator.style.display = 'block';
    
    // Remove rotation classes from existing character images
    const protagonistImg = document.querySelector('.protagonist-character img');
    const antagonistImg = document.querySelector('.antagonist-character img');
    if (protagonistImg) {
        protagonistImg.classList.remove('character-defeated-hero');
    }
    if (antagonistImg) {
        antagonistImg.classList.remove('character-defeated-villain');
    }
    
    // Update weapon options and battle scene with current selections (this will restore original character images)
    updateAntagonistWeapons();
    updateBattleScene();
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

// Add some CSS for the battle visualization
const style = document.createElement('style');
style.textContent = `
    .battle-visual {
        text-align: center;
        color: #ecf0f1;
    }
    
    .battle-canvas, .result-canvas {
        position: relative;
        width: 80vw;
        max-width: 1000px;
        min-height: 40vh;
        border-radius: 8px;
        overflow: hidden;
        margin: 0 auto 20px auto;
        border: 2px solid #34495e;
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
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 100%;
        padding: 20px;
        min-height: 40vh;
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
        max-width: 20vw;
        max-height: 30vh;
        height: 30vh;
    }
    
    .antagonist-character .character-image,
    .antagonist-result .result-character-image {
        max-width: 24vw;
        max-height: 36vh;
        height: 36vh;
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
    
    .battle-info {
        background: rgba(52, 73, 94, 0.9);
        padding: 15px;
        border-radius: 8px;
        font-size: 1.1rem;
        border-left: 4px solid #f39c12;
    }
    
    .battle-result-visual {
        margin: 20px 0;
    }
    
    .result-characters {
        min-height: 250px;
    }
    
    .result-info {
        background: rgba(52, 73, 94, 0.9);
        padding: 20px;
        border-radius: 8px;
        margin-top: 15px;
        text-align: center;
        border-left: 4px solid #f39c12;
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