# GitHub Workspace 📦✨

Welcome to **GitHub Workspace**, a premium, visually stunning Full-Stack web application designed to help you explore GitHub users, authenticate with OAuth, and manage repositories effortlessly. Developed with a high-end "Pitch Black Ice Glass" aesthetic, this dashboard offers a beautiful and seamless experience for interacting with the GitHub API.

**Developed by: ARNOB**

---

## 🌟 Key Features

- **Premium UI/UX**: Built with an immersive, dark glassmorphism design, featuring dynamic glows, micro-animations, and fluid transitions.
- **Secure GitHub OAuth Integration**: Real authentication flow using a Node.js Express backend to safely store your OAuth Client ID and Secret.
- **Repository Management**: 
  - Search for GitHub developers and repositories in real-time.
  - Create new repositories directly from the dashboard.
  - Instantly upload folders and files to your GitHub repositories via a drag-and-drop interface.
  - Enable and monitor GitHub Pages for your repositories.
- **Interactive File Explorer**: Browse repository file trees and preview code with beautiful syntax highlighting.
- **Favorites System**: Save your favorite repositories or users to your local workspace for quick access.

## 🛠️ Technology Stack

**Frontend:**
- **Framework**: React + Vite
- **Styling**: Vanilla CSS (Custom Design System using CSS Variables, Glowing Borders, and Pill Buttons)
- **Routing**: React Router DOM

**Backend:**
- **Runtime**: Node.js + Express
- **Authentication**: Official GitHub OAuth Flow via GitHub REST API
- **Proxying**: Secure server-side proxy for executing complex GitHub Actions (Repo Creation, Tree Commits).

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd github-workspace
   ```

2. **Install dependencies:**
   This project uses a root package manager to handle both frontend and backend dependencies using `concurrently`.
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Navigate into the `server` folder, copy the example environment file, and add your actual GitHub OAuth App credentials.
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `.env` to include your:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

4. **Run the application:**
   Go back to the root directory and start both the Express server and Vite frontend at the same time:
   ```bash
   cd ..
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to see the application in action.

## 🎨 Design Philosophy

This project strictly avoids generic colors and embraces a rich, curated dark mode tailored to feel incredibly premium. Micro-interactions such as button hovers, glass card 3D transforms, custom glowing gradient borders, and smooth route transitions are utilized to ensure the application feels alive and responsive to the touch.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

