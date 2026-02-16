# Echo Master League Website

🏆 **The Premier Competitive Echo VR League** - Season 4

Modern, responsive website built with React, Chakra UI, and Vite.

## ✨ Features

- 🌓 Dark/Light theme toggle
- 📱 Fully responsive (mobile + desktop)
- 🎯 Modal-based navigation
- 👥 Team & player profiles
- 📊 Live standings & rankings
- 📅 Match schedules
- 🤖 Discord bot commands
- 📺 Media gallery

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Deploy automatically ✅

### Netlify

```bash
npm run build
# Drag & drop 'dist' folder to netlify.com
```

### GitHub Pages

```bash
# Update vite.config.js base to '/repo-name/'
npm run deploy
```

## 📁 Project Structure

```
src/
├── components/    # React components
├── hooks/         # Custom React hooks  
├── data/          # Static data (teams)
├── api/           # API integration
├── App.jsx        # Main app
└── main.jsx       # Entry point
```

## 🔧 Tech Stack

- **React 18** - UI framework
- **Chakra UI v3** - Component library
- **Vite** - Build tool
- **Lucide React** - Icons

## 📝 Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete setup instructions.

## 🎨 Customization

### Update Teams

Edit `src/data/teamRosters.js`

### Theme Colors

- Dark mode: Orange/Purple
- Light mode: Blue/Orange

### Add Content

Create components in `src/components/`

## 🐛 Troubleshooting

**Build fails?**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Blank page?**

- Check browser console for errors
- Verify all imports are correct
- Make sure `src/api/BoardSDK.js` exists

## 🔗 Links

- **Discord**: <https://discord.gg/YhKGzPhaUw>
- **Echo VR Lounge**: <https://discord.gg/yG6speErHC>
- **Twitch**: <https://twitch.tv/echomasterleague>
- **YouTube**: <https://youtube.com/@EchoMasterLeague>

## 📄 License

© 2024 Echo Master League. All rights reserved.

---

Built with ❤️ by the EML community
