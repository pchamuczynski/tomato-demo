# Image Resources for Fantasy Battle Generator

This folder contains all the graphical assets for the Fantasy Battle Generator application.

## Folder Structure

```
resources/
├── backgrounds/         # Location background images
├── characters/         # Character images (protagonists and antagonists)
├── weapons/           # Weapon images
└── README.md         # This file
```

## Required Images

### Background Images (resources/backgrounds/)
- `desert.jpg` - Desert battle scene background
- `forest.jpg` - Forest battle scene background  
- `castle.jpg` - Castle battle scene background
- `swamp.jpg` - Swamp battle scene background

### Character Images (resources/characters/)

#### Protagonists (with weapons)
- `peter-sword.png` - Peter holding a sword
- `peter-bow.png` - Peter holding a bow
- `peter-axe.png` - Peter holding an axe
- `susan-sword.png` - Susan holding a sword
- `susan-bow.png` - Susan holding a bow
- `susan-axe.png` - Susan holding an axe
- `edmund-sword.png` - Edmund holding a sword
- `edmund-bow.png` - Edmund holding a bow
- `edmund-axe.png` - Edmund holding an axe
- `lucy-sword.png` - Lucy holding a sword
- `lucy-bow.png` - Lucy holding a bow
- `lucy-axe.png` - Lucy holding an axe

#### Antagonists (with weapons)
- `witch-sword.png` - Witch with sword
- `witch-bow.png` - Witch with bow
- `witch-axe.png` - Witch with axe
- `giant-sword.png` - Giant with sword
- `giant-bow.png` - Giant with bow
- `giant-axe.png` - Giant with axe
- `ogre-sword.png` - Ogre with sword
- `ogre-bow.png` - Ogre with bow
- `ogre-axe.png` - Ogre with axe

#### Defeated Characters
- `peter-defeated.png` - Peter defeated
- `susan-defeated.png` - Susan defeated
- `edmund-defeated.png` - Edmund defeated
- `lucy-defeated.png` - Lucy defeated
- `witch-defeated.png` - Witch defeated
- `giant-defeated.png` - Giant defeated
- `ogre-defeated.png` - Ogre defeated

## Image Specifications

### Recommended Format
### Recommended Format
- PNG format for character images (supports transparency for proper layering)
- JPG format for background images (no transparency needed)
- Consistent resolution for characters (e.g., 200x300px)
- Background resolution: 800x400px or similar

### Naming Convention
- Use lowercase names with hyphens
- Match exactly with the names used in the application
- Include weapon type for protagonist images

### Fallback Behavior
If an image is missing, the application will:
1. Display a placeholder with the character/weapon name
2. Show emoji icons as backup
3. Log a console message about the missing image

## Usage in Application
The images are automatically loaded based on:
- Selected protagonist + weapon combination
- Selected antagonist
- Selected location background
- Battle outcome (for defeated character images)

Images are dynamically composed into a complete battle scene during gameplay.