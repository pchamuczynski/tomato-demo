"""
Test suite for Fantasy Battle Generator - Standard Battle Only.
"""

import pytest
from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess
from functools import wraps


def run_tomato_with_stdin(model: str, options: list = []):
    result = subprocess.run(['tomato', '-H'] + options, input=model.encode('utf-8'), stdout=subprocess.PIPE)
    for line in [l for l in result.stdout.decode('utf-8').split('\n') if l != '']:
        yield line.split(',')

def run_tomato_with_file(input_file, function, options: list = []):
    result = subprocess.run(['tomato', '-H', '-f', function, input_file] + options, stdout=subprocess.PIPE)
    for line in [line for line in result.stdout.decode('utf-8').split('\n') if line != ''] :
        yield line.split(',')


def _create_browser_context(headless: bool):
    """Helper function to create a browser context with the specified headless setting.
    
    Args:
        headless: If True, launch browser in headless mode; if False, launch with UI visible.
    
    Yields:
        A Playwright page object pointing to the local index.html file.
    """
    with sync_playwright() as p:
        browser = p.webkit.launch(headless=headless)
        context = browser.new_context()
        page = context.new_page()
        
        # Load the HTML file
        current_dir = Path(__file__).parent.parent
        html_file = current_dir / "index.html"
        file_url = f"file://{html_file.absolute()}"
        
        print(f"\nLoading page from: {file_url} (headless={headless})")
        page.goto(file_url)
        print("Page loaded successfully!")
        
        yield page
        
        # Cleanup
        browser.close()
        print("Browser closed")


# Non-parameterized fixtures for specific modes
@pytest.fixture(scope="module")
def headless_browser_context():
    """Create a headless browser context that persists for the entire module."""
    yield from _create_browser_context(headless=True)


@pytest.fixture(scope="module")
def headed_browser_context():
    """Create a headed browser context that persists for the entire module."""
    yield from _create_browser_context(headless=False)


@pytest.mark.usefixtures("headless_browser_context")
@pytest.mark.parametrize("hero,hero_weapon,villain,villain_weapon,location,expected_outcome", 
    run_tomato_with_file(
        options = ['-n3'],
        input_file=str(Path(__file__).parent / "epic_battle.yaml"),
        function="standard battle"
    )
)
def test_standard_battle(request, hero, hero_weapon, villain, villain_weapon, location, expected_outcome):
    """Test Standard game battle outcomes."""
    page = request.getfixturevalue("headless_browser_context")
    
    # Reload page to reset state before each test
    page.reload()
    # Set battle type to standard game
    page.select_option("#outcomeSet", "Standard game")
    
    # Convert tomato output to lowercase for comparison
    expected_outcome = expected_outcome.lower().strip()
    
    # Set up battle parameters
    print(f"\nTesting STANDARD battle: Hero={hero} with {hero_weapon} vs Villain={villain} with {villain_weapon} at {location}")
    print(f"Expected outcome: {expected_outcome}")
    
    # Execute battle and verify outcome
    execute_battle(page, hero, hero_weapon, villain, villain_weapon, location, expected_outcome)


@pytest.mark.usefixtures("headed_browser_context")
@pytest.mark.parametrize("hero,hero_weapon,villain,villain_weapon,location,expected_outcome", 
    run_tomato_with_file(
        options = ['-n2', '--tuples-from', 'hero::name,villain::name'],
        input_file=str(Path(__file__).parent / "epic_battle.yaml"),
        function="hero-villain battle"
    )
)
def test_hero_villain_battle(request, hero, hero_weapon, villain, villain_weapon, location, expected_outcome):
    """Test Hero-Villain game battle outcomes."""
    page = request.getfixturevalue("headed_browser_context")
    
    # Reload page to reset state before each test
    page.reload()
    # Set battle type to hero-villain game
    page.select_option("#outcomeSet", "hero-villain")
    # Convert tomato output to lowercase for comparison
    expected_outcome = expected_outcome.lower().strip().replace('\r', '').replace('\n', '')
    
    # Set up battle parameters
    print(f"\nTesting HERO-VILLAIN battle: Hero={hero} with {hero_weapon} vs Villain={villain} with {villain_weapon} at {location}")
    print(f"Expected outcome: {expected_outcome}")
    
    # Execute battle and verify outcome
    execute_battle(page, hero, hero_weapon, villain, villain_weapon, location, expected_outcome)
    
def execute_battle(page, hero, hero_weapon, villain, villain_weapon, location, expected_outcome):
    """Helper function to execute a battle on the given page."""
    # Clean up expected outcome - remove trailing whitespace and carriage returns
    expected_outcome = expected_outcome.lower().strip().replace('\r', '').replace('\n', '')
    
    # Use Playwright methods to set form values
    page.select_option("#protagonist", hero.lower().strip())
    page.select_option("#protagonistWeapon", hero_weapon.lower().strip())
    page.select_option("#antagonist", villain.lower().strip())
    page.select_option("#antagonistWeapon", villain_weapon.lower().strip())
    page.select_option("#location", location.lower().strip())
    
    # Execute battle
    page.click("#fight")
    
    # Get battle outcome from scene description
    outcome_text = page.text_content("#sceneDescription")
    
    print(f"Battle outcome text: {outcome_text}")

    # Verify the outcome based on expected result
    if expected_outcome == "hero wins":
        assert "Victory!" in outcome_text or "hero stands triumphant" in outcome_text.lower(), \
               f"Expected hero victory but got: {outcome_text}"
    elif expected_outcome == "villain wins":
        assert "Defeat" in outcome_text or "dark forces prove too powerful" in outcome_text.lower(), \
               f"Expected villain victory but got: {outcome_text}"
    else:
        raise AssertionError(f"Unknown expected outcome: {expected_outcome}")
