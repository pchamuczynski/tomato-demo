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
- `peter-crossbow.png` - Peter holding a crossbow
- `peter-axe.png` - Peter holding an axe
- `peter-dagger.png` - Peter holding a dagger
- `susan-sword.png` - Susan holding a sword
- `susan-bow.png` - Susan holding a bow
- `susan-crossbow.png` - Susan holding a crossbow
- `susan-axe.png` - Susan holding an axe
- `susan-dagger.png` - Susan holding a dagger
- `edmund-sword.png` - Edmund holding a sword
- `edmund-bow.png` - Edmund holding a bow
- `edmund-crossbow.png` - Edmund holding a crossbow
- `edmund-axe.png` - Edmund holding an axe
- `edmund-dagger.png` - Edmund holding a dagger
- `lucy-sword.png` - Lucy holding a sword
- `lucy-bow.png` - Lucy holding a bow
- `lucy-crossbow.png` - Lucy holding a crossbow
- `lucy-axe.png` - Lucy holding an axe
- `lucy-dagger.png` - Lucy holding a dagger

#### Antagonists (with weapons)
- `witch-sword.png` - Witch with sword
- `witch-bow.png` - Witch with bow
- `witch-crossbow.png` - Witch with crossbow
- `witch-axe.png` - Witch with axe
- `witch-dagger.png` - Witch with dagger
- `cyclops-sword.png` - Cyclops with sword
- `cyclops-bow.png` - Cyclops with bow
- `cyclops-crossbow.png` - Cyclops with crossbow
- `cyclops-axe.png` - Cyclops with axe
- `cyclops-dagger.png` - Cyclops with dagger
- `cyclops-mace.png` - Cyclops with mace
- `ogre-sword.png` - Ogre with sword
- `ogre-bow.png` - Ogre with bow
- `ogre-crossbow.png` - Ogre with crossbow
- `ogre-axe.png` - Ogre with axe
- `ogre-dagger.png` - Ogre with dagger
- `ogre-mace.png` - Ogre with mace

#### Defeated Characters
- `peter-defeated.png` - Peter defeated
- `susan-defeated.png` - Susan defeated
- `edmund-defeated.png` - Edmund defeated
- `lucy-defeated.png` - Lucy defeated
- `witch-defeated.png` - Witch defeated
- `cyclops-defeated.png` - Cyclops defeated
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