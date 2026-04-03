# 🧪 Mapping AI Prompt

![Mapping Prompt Banner](https://mappingaiprompt.vercel.app/og-image.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

**Mapping AI Prompt** is a simple, professional-grade web application designed for AI artists and creators. It simplifies the process of building high-quality prompts for AI image generators (Midjourney, DALL-E) and video models (Sora, Runway Gen-2, Pika, Perchance).

[**🚀 Live Demo**](https://mappingaiprompt.vercel.app/)

## ✨ Key Features

*   **🗺️ Visual Mapping**: Build your prompt using modular blocks (Character, Environment, Camera, etc.) for a structured creative process.
*   **🪄 Magic Wand (Enhancer)**: One-click injection of high-end technical keywords tailored for both photography and cinematic video.
*   **🌈 Global Vibes (Master Presets)**: Apply cohesive thematic styles (e.g., Cyber Noir, Epic Fantasy) instantly to your entire prompt.
*   **🎬 Video Storyboarding**: Specialized system for timestamped sequences, perfect for complex AI video generation.
*   **📄 Visual Blueprint (Recipe Cards)**: Generate and download aesthetic, shareable index cards of your prompt formulas.
*   **🌐 Multi-Language Support**: Write your primary concepts in your native language and translate them to AI-ready English with one click.

## 🛠️ Tech Stack

- **Framework**: React.js with Vite
- **Styling**: Vanilla CSS (Premium Custom Design)
- **Icons**: Lucide React
- **Exporting**: modern-screenshot (PNG) & XLSX (Excel/JSON)
- **Drag & Drop**: dnd-kit

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/promptferry/promptmap.git
   ```
2. Navigate to the project directory:
   ```bash
   cd promptmap
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📈 SEO & Optimization

The application is fully optimized with:
- Dedicated **Open Graph** tags for social previews.
- **Google Analytics** integration for traffic monitoring.
- Clean, semantic HTML5 structure.

## 🤝 Support the Project

If you find this tool helpful, consider supporting the development via the link in the application footer.

## � Release Notes

### v1.1.0 (2026-04-03)
- Added Gallery <-> Excel import/export workflow
  - `Export Gallery to Excel` (one workbook, one sheet per prompt)
  - `Import Gallery from Excel` (clears existing gallery before loading)
  - App expects set format per sheet:
    - Title (row 1), Folder (row 2), IsFavorite (row 3), Section/Type/Detail/IsSelected (row 4)
    - Data rows from row 5 onwards
- Added gallery search clear button (`x`) for fast reset
- Added versioned history modal with changelog in-app
- Added `history.md` as internal deployment history
- Added `custom-scrollbar` CSS rule (desktop hidden scrollbars)

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Crafted for the future of AI creativity.*
