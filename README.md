# Echo Master League

This repo contains a React + Vite site for the Echo Master League. I reorganized the project into an idiomatic Vite setup and added skeleton files so it can be run locally.

Getting started

Prerequisites:

- Node.js (v18+ recommended)

Install and run:

```bash
npm install
npm run dev
```

The app will be available at <http://localhost:3000> by default.

What I added

- Root `package.json` and scripts
- `vite.config.js` with React plugin
- `index.html` and `main.jsx` entry that mounts `App.jsx`
- `styles.css` minimal global styles
- `.gitignore`

Notes

- The app's main component is `App.jsx` at the repo root. It uses Chakra UI; dependencies are declared in `package.json`.
- If you prefer the source files under `src/`, I can move them and update imports.

Next steps (optional)

- Move source files into `src/` for a conventional layout
- Add ESLint + Prettier and CI workflows
- Add unit / integration tests

# echo-master-league

Echo Master League Website
