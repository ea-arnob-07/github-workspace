# GitHub Workspace 📦✨

Welcome to **GitHub Workspace**, a premium, visually stunning React web application designed to help you explore GitHub users and repositories effortlessly. Developed with a high-end "Pitch Black Ice Glass" aesthetic, this dashboard offers a beautiful and seamless experience for interacting with the GitHub API.

**Developed by: ARNOB**

---

## 🌟 Key Features

- **Premium UI/UX**: Built with an immersive, dark glassmorphism design (deep `#050505` black), featuring dynamic glows, micro-animations, and fluid transitions.
- **GitHub Explorer**: 
  - Search for GitHub developers and repositories in real-time.
  - View detailed User Profiles (Overview, Repositories, Followers, Following).
  - Inspect rich Repository Data (Overview, Contributors, Open Issues, Branches, Commits).
- **Favorites System**: Easily save your favorite repositories or users to your local workspace for quick access later.
- **Interactive Dashboard**: A sleek masonry grid for quick actions and quick links to your personal GitHub repository (`ea-arnob-07`).
- **Fake Authentication Flow**: A beautifully styled Login and Sign Up screen to simulate an enterprise-level workspace entry.

## 🛠️ Technology Stack

- **Framework**: React + Vite
- **Styling**: Vanilla CSS (Custom Design System using CSS Variables for maximal control and aesthetics)
- **Routing**: React Router DOM
- **Data Fetching**: Native Fetch API interacting directly with the public `api.github.com` endpoints.
- **State Management**: React Hooks (`useState`, `useContext`) and custom `useLocalStorage` for persisting favorites and preferences.

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
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to see the application in action.

## 🎨 Design Philosophy

This project strictly avoids generic colors and embraces a rich, curated dark mode tailored to feel incredibly premium. Micro-interactions such as button hovers, glass card 3D transforms, and smooth route transitions are utilized to ensure the application feels alive and responsive to the touch.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
