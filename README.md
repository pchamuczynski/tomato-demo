# Fantasy Battle Generator - Test Automation Demo

This project demonstrates **parameterized testing** using [tomato](https://pypi.org/project/testomaton/) for test case generation. It showcases how to use the same YAML-based test model to drive both Python (pytest + Playwright) and JavaScript (Vitest) test suites.

## Overview

The Fantasy Battle Generator is a simple web application where battle outcomes are determined by combinations of hero, weapon, villain, and location. The key focus is on **testing the battle outcome logic** with automatically generated test parameters.

## Test Architecture

```
test/
├── epic_battle.yaml        # Tomato model defining test parameters
├── hero-villain.yaml       # Alternative battle model
├── pytest/                 # Python browser tests
│   ├── test_epic_battle.py
│   ├── Pipfile
│   └── pytest.ini
└── vitest/                 # JavaScript unit tests
    ├── script.test.js
    ├── scriptLoader.js
    └── package.json
```

## Tomato Test Model

The `test/epic_battle.yaml` file defines the test parameter space:

```yaml
standard battle:
  parameters:
    hero:
      name: [Peter, Susan, Edmund, Lucy]
      weapon: [sword, bow, axe, crossbow, dagger]
    villain:
      name: [witch, cyclops, ogre, dragon]
      weapon: [sword, bow, axe, crossbow, dagger, mace, claws and teeth]
    location: [desert, forest, castle, swamp]
    outcome: [hero wins, villain wins]
```

Tomato generates test combinations using n-wise algorithms, ensuring good coverage without exhaustive enumeration.

## Prerequisites

- **tomato**: Install with `pip install testomaton` (free, open-source)
- **Python 3.x** with pipenv (for pytest)
- **Node.js** (for Vitest)

## Running Tests

### Python Tests (pytest + Playwright)

The pytest suite runs end-to-end browser tests. It supports both **headed** (visible browser) and **headless** modes to demonstrate different testing scenarios.

```bash
cd test/pytest
pipenv install
pipenv run playwright install webkit
pipenv run pytest test_epic_battle.py -v
```

**How it works:**

1. `run_tomato_with_file()` executes tomato CLI to generate test cases
2. `@pytest.mark.parametrize` receives the generated combinations
3. Playwright automates the browser to test each combination
4. Two fixtures demonstrate headed vs headless execution:
   - `headed_browser_page` - browser UI visible (for demos)
   - `headless_browser_page` - no UI (for CI/CD)

```python
@pytest.mark.parametrize("hero,hero_weapon,villain,villain_weapon,location,expected_outcome", 
    run_tomato_with_file(
        input_file="epic_battle.yaml",
        function="standard battle",
        options=['-n3']  # 3-wise coverage
    )
)
def test_standard_battle(headless_browser_page, hero, hero_weapon, ...):
    # Test executes for each generated combination
```

### JavaScript Tests (Vitest)

The Vitest suite tests the battle outcome logic directly without a browser.

```bash
cd test/vitest
npm install
npm test
```

**How it works:**

1. `runTomato()` executes tomato CLI and parses CSV output
2. `it.each()` runs the test for each generated combination
3. `scriptLoader.js` extracts testable functions from `script.js`

```javascript
const standardBattleCases = runTomato('standard battle', ['-n3']);

describe('findBattleOutcome - Standard game', () => {
    it.each(standardBattleCases)(
        'battle(%s, %s, %s, %s, %s) should result in "%s"',
        (hero, heroWeapon, villain, villainWeapon, location, expectedOutcome) => {
            const battleKey = createBattleKey(hero, heroWeapon, villain, villainWeapon, location);
            expect(findBattleOutcome(battleKey, outcomes)).toBe(expected);
        }
    );
});
```

## Tomato CLI Usage

Generate test cases directly:

```bash
# 3-wise combinations for standard battle
tomato -H -f "standard battle" test/epic_battle.yaml -n3

# 2-wise with specific tuple focus
tomato -H -f "hero-villain battle" test/epic_battle.yaml -n2 --tuples-from "hero::name,villain::name"
```

Options:
- `-H` - Output without header row
- `-f "function"` - Select specific function from YAML
- `-n3` - N-wise coverage level (2=pairwise, 3=3-wise, etc.)
- `--tuples-from` - Focus coverage on specific parameter combinations

## Key Benefits

1. **Single Source of Truth**: Test parameters defined once in YAML, used by both test frameworks
2. **Efficient Coverage**: N-wise algorithms reduce test count while maintaining coverage
3. **Framework Agnostic**: Same model drives Python and JavaScript tests
4. **Maintainable**: Add new parameters or values in YAML, tests automatically adapt