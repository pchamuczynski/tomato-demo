# Test Setup Instructions

## Prerequisites

1. Install pipenv (if not already installed):
```bash
pip install pipenv
```

2. Install Python dependencies:
```bash
cd test
pipenv install
```

3. Install Playwright browsers:
```bash
pipenv run python -m playwright install
```

## Running the Tests

### Run all tests:
```bash
cd test
pipenv run pytest test_standard_battle.py -v
```

### Run specific test:
```bash
pipenv run pytest test_standard_battle.py::TestStandardBattle::test_standard_battle_outcomes -v
```

### Run tests with browser visible (remove headless mode):
Edit `test_standard_battle.py` and change:
```python
browser = await p.chromium.launch(headless=True)
```
to:
```python
browser = await p.chromium.launch(headless=False)
```

## Test Description

The test suite includes:

1. **test_standard_battle_outcomes**: Parameterized test that verifies specific battle combinations produce expected outcomes according to Standard game rules
2. **test_villain_defeat_tracking**: Verifies that defeated villains are properly tracked in the UI
3. **test_game_type_switching**: Tests that changing game types resets the game state
4. **test_ui_elements_present**: Ensures all required UI elements are present and functional

## Test Cases Covered

The parameterized test covers these scenarios:
- Edmund vs Dragon in Swamp → Hero wins
- Lucy with dagger vs Witch → Hero wins  
- Peter vs Cyclops with mace → Hero wins
- Susan with bow vs Ogre → Hero wins
- Default cases → Villain wins

## Troubleshooting

### Browser Installation Issues
If you encounter browser installation issues:
```bash
pipenv run playwright install chromium
```

### Alternative: Use different browsers
You can also test with Firefox or WebKit:
```python
# In the test file, replace:
browser = await p.chromium.launch(headless=True)
# with:
browser = await p.firefox.launch(headless=True)
# or:
browser = await p.webkit.launch(headless=True)
```

### Debugging Tests
To run tests with verbose output and see browser actions:
```bash
pipenv run pytest test_standard_battle.py -v -s
```