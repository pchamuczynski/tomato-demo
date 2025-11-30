"""
Test suite for Fantasy Battle Generator - Standard Battle Only.
"""

import pytest
from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess


def run_tomato_with_stdin(model: str, options: list = []):
    result = subprocess.run(['tomato', '-H'] + options, input=model.encode('utf-8'), stdout=subprocess.PIPE)
    for line in [l for l in result.stdout.decode('utf-8').split('\n') if l != '']:
        yield line.split(',')

def run_tomato_with_file(input_file, function, options: list = []):
    result = subprocess.run(['tomato', '-H', '-f', function, input_file] + options, stdout=subprocess.PIPE)
    for line in [line for line in result.stdout.decode('utf-8').split('\n') if line != ''] :
        yield line.split(',')


# Single Playwright instance for the entire module
@pytest.fixture(scope="module")
def playwright_instance():
    """Create a single Playwright instance for the module."""
    with sync_playwright() as p:
        yield p


@pytest.fixture(scope="module")
def headed_browser_page(playwright_instance):
    """Create a headed browser context."""
    browser = playwright_instance.webkit.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    
    current_dir = Path(__file__).parent.parent.parent
    html_file = current_dir / "index.html"
    file_url = f"file://{html_file.absolute()}"
    
    print(f"\nLoading page from: {file_url} (headed)")
    page.goto(file_url)
    print("Page loaded successfully!")
    
    yield page
    
    browser.close()
    print("Headed browser closed")


@pytest.fixture(scope="module")
def headless_browser_page(playwright_instance):
    """Create a headless browser context."""
    browser = playwright_instance.webkit.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    
    current_dir = Path(__file__).parent.parent.parent
    html_file = current_dir / "index.html"
    file_url = f"file://{html_file.absolute()}"
    
    print(f"\nLoading page from: {file_url} (headless)")
    page.goto(file_url)
    print("Page loaded successfully!")
    
    yield page
    
    browser.close()
    print("Headless browser closed")


############################# TESTS #############################

@pytest.mark.parametrize("hero,hero_weapon,villain,villain_weapon,location,expected_outcome", 
    run_tomato_with_file(
        options = ['-n2', '--tuples-from', 'hero::name,villain::name'],
        input_file=str(Path(__file__).parent.parent / "epic_battle.yaml"),
        function="hero-villain battle"
    )
)
def test_hero_villain_battle(headed_browser_page, hero, hero_weapon, villain, villain_weapon, location, expected_outcome):
    """Test Hero-Villain game battle outcomes (headed mode)."""
    # Set battle type to hero-villain game
    headed_browser_page.select_option("#outcomeSet", "hero-villain")
    
    # Execute battle and verify outcome
    execute_battle(headed_browser_page, hero, hero_weapon, villain, villain_weapon, location, expected_outcome)

@pytest.mark.parametrize("hero,hero_weapon,villain,villain_weapon,location,expected_outcome", 
    run_tomato_with_file(
        options = ['-n3'],
        input_file=str(Path(__file__).parent.parent / "epic_battle.yaml"),
        function="standard battle"
    )
)
def test_standard_battle(headless_browser_page, hero, hero_weapon, villain, villain_weapon, location, expected_outcome):
    """Test Standard game battle outcomes (headless mode)."""
    # Set battle type to standard game
    headless_browser_page.select_option("#outcomeSet", "Standard game")
    
    # Execute battle and verify outcome
    execute_battle(headless_browser_page, hero, hero_weapon, villain, villain_weapon, location, expected_outcome)
    
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
    
    # Verify the outcome based on expected result
    if expected_outcome == "hero wins":
        assert "Victory!" in outcome_text or "hero stands triumphant" in outcome_text.lower(), \
               f"Expected hero victory but got: {outcome_text}"
    elif expected_outcome == "villain wins":
        assert "Defeat" in outcome_text or "dark forces prove too powerful" in outcome_text.lower(), \
               f"Expected villain victory but got: {outcome_text}"
    else:
        raise AssertionError(f"Unknown expected outcome: {expected_outcome}")
