# GitHub Workspace 🚀

> A premium, full-stack GitHub developer hub — built to explore, manage, and collaborate on GitHub repositories with a stunning dark glassmorphism UI.

**Developed by: Estiuk Arafat Arnob**

---

## 📌 Project Objective

**GitHub Workspace** is a full-stack web application designed to be your personal GitHub command center. The primary goal is to provide a beautiful, intuitive, and powerful interface that allows developers and non-developers alike to:

- **Discover GitHub developers** by searching any public GitHub username
- **Browse and explore repositories** with rich details including code previews, file trees, contributors, commits, branches, and issues
- **Authenticate with GitHub** securely using OAuth to unlock personal features
- **Create and manage repositories** directly from the dashboard without visiting GitHub
- **Upload files and folders** to any repository using a drag-and-drop interface
- **Enable GitHub Pages** for repositories with one click
- **Organize favorites** — save interesting repositories and users for quick access
- **Build collections** of repositories for personal organization

The project aims to demonstrate a production-grade, premium-quality React application integrated with a real GitHub OAuth backend — complete with professional UI/UX design, glassmorphism aesthetics, dark/light theme support, and real-time API data.

---

## 🌟 Features at a Glance

| Feature | Description |
|---|---|
| 🔐 GitHub OAuth Login | Real authentication via GitHub OAuth App — no passwords stored |
| 🔎 User Search | Search any GitHub username and view their public profile & repos |
| 📦 Repository Explorer | Browse file trees, preview code with syntax highlighting |
| 🛠️ Create Repository | Create new GitHub repos directly from the app (requires login) |
| 📤 File Uploader | Drag-and-drop files/folders directly into any repository |
| 🌐 GitHub Pages | Enable & monitor GitHub Pages for your repositories |
| ⭐ Favorites | Star repos or users locally for quick access |
| 🗂️ Collections | Organize repos into personal named collections |
| 🔔 Notifications | In-app notification center for activity alerts |
| 🌙 Theme Toggle | Switch between Dark, Light, and System themes |
| 👤 My Profile | View & manage your personal GitHub repositories |
| ⚙️ Settings | Customize theme, pagination size, and default search type |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Pure Vanilla CSS — Custom Design System with CSS Variables, Glassmorphism, Glowing Borders, Pill UI
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Fonts**: Outfit (primary), Space Grotesk (clock), JetBrains Mono (code)
- **State Management**: React Context API + localStorage hooks
- **Animations**: CSS keyframes, micro-interactions, 3D glass transforms

### Backend
- **Runtime**: Node.js + Express
- **Authentication**: GitHub OAuth 2.0 flow (Client ID + Secret never exposed to frontend)
- **Session**: Express sessions for storing authenticated GitHub user
- **Proxy**: Server-side proxy for secure GitHub API calls (repo creation, tree commits, file uploads)
- **Environment**: dotenv for safe credential management

---

## 🔐 How Authentication Works

1. User clicks **"Login with GitHub"** on the My Profile page
2. The browser is redirected to GitHub's OAuth authorization page
3. After the user approves, GitHub redirects back with a `code`
4. The Express backend exchanges this `code` for an `access_token` (securely — keys never exposed to the client)
5. The server stores the GitHub user info in the session
6. The frontend reads the session to determine auth state
7. Authenticated users can create repositories, upload files, and enable GitHub Pages

---

## 🗺️ How the App Works — Page by Page

### 🏠 Dashboard (`/dashboard`)
Your home after login. Shows a welcome card, quick action shortcuts, your connected GitHub profile card, popular developers, and recent activity. Includes a global search bar to jump directly into user or repository searches.

### 🔎 Search (`/search`)
Search for any GitHub **user** or **repository** in real time. Results are paginated and each card links to a detailed view. Toggle between "Users" and "Repositories" mode.

### 👤 User Details (`/users/:username`)
Displays a full GitHub user profile — avatar, bio, follower stats, and a list of their public repositories with language, star, and fork counts.

### 📦 Repository Details (`/repos/:owner/:repo`)
A rich repository view with:
- **Overview**: Repo info, star/fork/watcher/issue counts, topics, language
- **Code**: Interactive file tree with code preview and syntax highlighting
- **Contributors**: Top contributors with avatars and commit counts
- **Issues**: Open issues list
- **Branches**: All branches
- **Commits**: Recent commit history
- **Actions**: Open on GitHub, Download ZIP, Favorite, Live Preview, GitHub Pages

### ⭐ Favorites (`/favorites`)
All your saved repositories and users, stored locally. One click to jump back to any saved item.

### 🗂️ Collections (`/collections`)
Organize repositories into named personal collections for better project management.

### 🔔 Notifications (`/notifications`)
In-app notification center showing recent activity and system alerts.

### 👤 My Profile (`/my-profile`)
- Shows your GitHub login status
- Search any GitHub username to view their repositories
- **Create New Repository** button — opens the creation form (requires GitHub login)

### 🛠️ Create Repository (`/my-profile/create-repository`)
A full repository creation form (requires GitHub OAuth login):
- Repository name, description, visibility (public/private)
- Initialize with README, .gitignore, license options
- After creation, optionally upload files directly

### ⚙️ Settings (`/settings`)
Customize your experience:
- **Theme**: Dark / Light / System
- **Pagination Size**: 10 / 20 / 50 items per page
- **Default Search Type**: Users or Repositories

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A GitHub OAuth App ([Create one here](https://github.com/settings/developers)) with:
  - Homepage URL: `https://ea-arnob-07.github.io/github-workspace/`
  - Callback URL: `http://localhost:5000/auth/github/callback` *(local dev)*

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/ea-arnob-07/github-workspace.git
cd github-workspace
```

**2. Install all dependencies (frontend + backend):**
```bash
npm install
```

**3. Configure environment variables:**
```bash
cd server
cp .env.example .env
```
Then edit `server/.env`:
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SESSION_SECRET=any_random_secret_string
```

**4. Start the full application:**
```bash
cd ..
npm run dev
```

**5. Open your browser:**
```
https://ea-arnob-07.github.io/github-workspace/
```

> 🔗 **Live Repository**: [github.com/ea-arnob-07/github-workspace](https://github.com/ea-arnob-07/github-workspace)

---

## 🔑 Trial Account (Local Auth)

You can log in with this pre-registered test account to explore the app without signing up:

| Field | Value |
|---|---|
| **Email** | `eaarnob178@gmail.com` |
| **Password** | `arnob123` |

> **Note**: This is the local (fake) auth system built into the app for demo purposes. To unlock GitHub-specific features (create repo, upload files, GitHub Pages), you need to click **"Login with GitHub"** using a real GitHub account.

---

## 🎨 Design Philosophy

- **Dark-first design** — Deep ocean dark theme that auto-applies on every login
- **Glassmorphism** — Frosted glass cards with subtle borders, backdrop blur, and inner glows
- **Premium color palette** — Curated purples (`#7c3aed`, `#a855f7`), accent greens, and warm whites
- **Micro-animations** — Every hover, click, and route transition is animated for a premium feel
- **Custom scrollbar** — Thin purple scrollbar on all scrollable areas
- **Space Grotesk clock** — The navbar clock uses a modern digital-display typeface with blinking colon
- **Responsive** — Mobile-friendly with a bottom dock navigation on smaller screens

---

## 📁 Project Structure

```
github-workspace/
├── src/
│   ├── components/
│   │   ├── common/         # Reusable: LoadingSpinner, ErrorMessage, Pagination
│   │   ├── github/         # GitHub-specific: LoginButton, FileUploader, PagesStatus
│   │   ├── layout/         # Navbar, Sidebar
│   │   ├── repositories/   # RepoCard, FileTree, CodePreview
│   │   └── users/          # UserCard
│   ├── context/            # AuthContext, SettingsContext
│   ├── hooks/              # useTheme, useLocalStorage
│   ├── pages/              # All page components + their CSS
│   ├── routes/             # AppRoutes, ProtectedRoute
│   ├── services/           # API calls: githubApi, githubAuthApi, githubUserApi
│   └── utils/              # Validators, helpers
├── server/
│   ├── controllers/        # authController, githubController
│   ├── routes/             # authRoutes, githubRoutes
│   └── index.js            # Express server entry
├── package.json            # Root scripts (concurrently)
└── vite.config.js
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

**GitHub Workspace** — Built with ❤️ by **Estiuk Arafat Arnob**

*Explore. Create. Collaborate.*

</div>
