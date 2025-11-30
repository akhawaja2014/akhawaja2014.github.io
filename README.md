# Minimal Research Portfolio (static)

This is a minimal static research portfolio you can host for free on GitHub Pages.

Files added:

- `index.html` — homepage
- `publications.html` — manual publications list (can be automated later)
- `css/style.css` — simple styles

Quick preview locally (zsh / macOS):

```bash
cd /Users/arsalankhawaja/Documents/PHD/Github_Projects/website
# start a simple server and open http://localhost:8000
python3 -m http.server 8000
```

Deploy to GitHub Pages (one-time setup):

1. Create a GitHub repository named `your-username.github.io` (replace `your-username`).
2. In this folder, run the commands below (or use the GitHub Desktop / web UI):

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
# replace with your repository URL
git remote add origin git@github.com:your-username/your-username.github.io.git
git push -u origin main
```

Visit `https://your-username.github.io` after pushing.

If you'd like, I can:
- Add a `publications.bib` importer and render publications automatically.
- Convert this to a Jekyll starter so you can use templates and blog posts.
- Create the GitHub repo and push the site for you (give me your GitHub username).
