# Fantasy Battle Generator

A simple web application that generates fantasy battle scenarios with customizable outcomes based on character, weapon, and location selections.

## Features

- **Character Selection**: Choose from Peter, Susan, Edmund, or Lucy as protagonists
- **Enemy Selection**: Battle against witch, cyclops, or ogre antagonists  
- **Weapon Choice**: Fight with sword, bow, or axe
- **Location Settings**: Battle in desert, forest, castle, or swamp environments
- **Real-Time Battle Arena**: Battle scene updates instantly as you change selections
- **Visual Battle Scenes**: Complete image composition with backgrounds and character images
- **Image-Based Results**: Shows characters in victory/defeat poses based on battle outcomes
- **Battle Statistics Tracking**: Comprehensive score system tracking wins, losses, draws, and stalemates
- **Win Rate Calculation**: Displays your success rate across all battles
- **Configurable Outcomes**: Pre-configured battle results with fallback to random outcomes
- **Image Resource System**: Organized folder structure for easy image management
- **Fallback Graphics**: Emoji icons display when images are missing
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. Open `index.html` in a web browser
2. Select your protagonist, antagonist, weapon, and location from the dropdown menus
3. Watch as the battle scene updates in real-time with your selections
4. Click "Fight!" to resolve the battle and see the outcome
5. View your battle statistics and results
6. Click "Try Again" to return to the battle arena for another fight

## Battle Outcomes

The application supports four different battle outcomes:
- **Protagonist Wins**: Hero defeats the enemy
- **Antagonist Wins**: Enemy defeats the hero  
- **Both Defeated**: Both combatants fall in battle
- **Both Standing**: Epic stalemate with mutual respect

## Customizing Outcomes

Battle outcomes are configured in the `battleOutcomes` object in `script.js`. You can modify existing combinations or add new ones using the format:

```javascript
"protagonist-antagonist-weapon-location": "outcome"
```

For example:
```javascript
"Peter-witch-sword-castle": "protagonist_wins"
```

If no specific outcome is configured, the system will randomly select from the available outcomes.

## Project Structure

```
├── index.html              # Main HTML file with form and battle interface
├── style.css               # Styling with fantasy theme
├── script.js               # Battle logic and outcome configuration
├── resources/              # Image assets folder
│   ├── characters/         # Character images (protagonists/antagonists with weapons)
│   ├── backgrounds/        # Location background images  
│   ├── weapons/            # Individual weapon images (future use)
│   └── README.md          # Image specifications and requirements
└── README.md              # This file
```

## Technologies Used

- HTML5 for structure
- CSS3 for styling with gradients and animations
- Vanilla JavaScript for interactivity
- Responsive design for mobile compatibility

## Browser Compatibility

This application works in all modern browsers that support:
- ES6 JavaScript features
- CSS3 flexbox and gradients
- HTML5 form elements

## Image Setup

### Required Images

The application expects images in the `resources/` folder:

**Character Images** (PNG with transparency recommended):
- `peter-sword.png`, `peter-bow.png`, `peter-axe.png`
- `susan-sword.png`, `susan-bow.png`, `susan-axe.png`
- `edmund-sword.png`, `edmund-bow.png`, `edmund-axe.png`
- `lucy-sword.png`, `lucy-bow.png`, `lucy-axe.png`
- `witch.png`, `cyclops.png`, `ogre.png`
- `peter-defeated.png`, `susan-defeated.png`, `edmund-defeated.png`, `lucy-defeated.png`
- `witch-defeated.png`, `cyclops-defeated.png`, `ogre-defeated.png`

**Background Images** (JPG or PNG):
- `desert.jpg`, `forest.jpg`, `castle.jpg`, `swamp.jpg`

### Image Specifications
- Character images: 200x300px recommended, PNG format with transparency
- Background images: 800x400px recommended, JPG or PNG format
- Follow exact naming conventions as shown above

### Fallback Behavior
If images are missing, the application gracefully falls back to:
- Text labels and emoji icons
- Colored placeholder backgrounds
- Console warnings about missing images

## Development

To modify the application:

1. Edit `index.html` to change the structure or add new form elements
2. Update `style.css` to modify the visual appearance
3. Modify `script.js` to change battle logic or add new outcomes
4. Add your images to the `resources/` folders following the naming convention
5. Test in a web browser by opening `index.html`

No build process or dependencies are required - this is a pure client-side application.