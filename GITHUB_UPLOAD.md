# GitHub Upload Instructions

## Prerequisites
1. Install Git: https://git-scm.com/downloads
2. Create a GitHub account: https://github.com/signup
3. Install GitHub CLI (optional): https://cli.github.com/

## Option 1: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: See https://cli.github.com/

# Authenticate with GitHub
gh auth login

# Create repository and push
gh repo create chamapay --public --source=. --remote=origin --push
```

## Option 2: Manual Git Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ChamaPay - Kenyan Chama Management Platform"

# Create a new repository on GitHub:
# 1. Go to https://github.com/new
# 2. Repository name: chamapay
# 3. Description: Modern Kenyan Chama management platform
# 4. Make it Public
# 5. DO NOT initialize with README (we already have one)
# 6. Click "Create repository"

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/chamapay.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Option 3: Using VS Code

1. Open the project in VS Code
2. Click the Source Control icon (left sidebar)
3. Click "Initialize Repository"
4. Stage all changes (click + next to "Changes")
5. Enter commit message: "Initial commit: ChamaPay - Kenyan Chama Management Platform"
6. Click "Commit"
7. Click "Publish Branch"
8. Select "Publish to GitHub"
9. Choose "Public repository"
10. Click "Publish"

## After Upload

Your repository will be available at:
`https://github.com/YOUR_USERNAME/chamapay`

## Next Steps

1. **Update README**: Replace `yourusername` with your actual GitHub username
2. **Add CI/CD**: Set up GitHub Actions for automated testing and deployment
3. **Enable Issues**: Allow users to report bugs and request features
4. **Add Topics**: Add relevant topics like `react`, `typescript`, `fintech`, `kenya`, `mpesa`

## Repository Structure

```
chamapay/
├── src/
│   ├── pages/          # Page components
│   ├── lib/            # Store and utilities
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── dist/               # Build output (gitignored)
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.js      # Vite config
├── README.md           # Documentation
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## Troubleshooting

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy the output and add to https://github.com/settings/keys
```

### "Updates were rejected because the remote contains work"
```bash
# Pull remote changes first
git pull origin main --rebase

# Then push
git push -u origin main
```

### "fatal: remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/chamapay.git
```

## Deployment

After uploading, you can deploy to:

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
Add to `vite.config.js`:
```js
export default defineConfig({
  base: '/chamapay/',
  // ... rest of config
})
```

Then deploy using GitHub Actions.

## Support

For issues with the upload process:
- GitHub Docs: https://docs.github.com/
- Git Documentation: https://git-scm.com/doc
