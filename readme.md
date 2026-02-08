# Fish Game
**Developed by Lukas Eifertinger**

Fish Game is a minimalist, JavaScript-based arcade game. It uses modern web technologies such as the **Canvas API** for smooth graphics and a **Glassmorphism UI** based on CSS backdrop filters.

### 🚀 Key Functionalities

* **Responsive Scaling**: The game dynamically calculates the size of the fish and obstacles based on the window height to ensure the experience is consistent across mobile and desktop.
* **Skin System**: Integrated selection menu for various fish skins (e.g., Clownfish, Shark, Jellyfish) and pipe designs.
* **Liquid Glass UI**: A modern main menu featuring blur effects (`backdrop-filter`) and interactive elements.
* **Persistent Highscore**: Your best performances are saved locally in the browser (`localStorage`).
* **Atmospheric Details**: A dynamically generated particle system (bubbles) with density that adjusts based on the device type.

### 🛠️ Technical Overview

#### Controls
| Input | Action |
| :--- | :--- |
| **Space / Click / Touch** | Swim / Jump |
| **Key P** | Pause Game |
| **Menu Buttons** | Switch Skins & Open Leaderboard |

#### File Structure
* `index.html`: The structure of the game and UI layers.
* `index.css`: Styling for the Glass design and responsiveness.
* `main.js`: Core game logic, collision detection, and rendering system.
