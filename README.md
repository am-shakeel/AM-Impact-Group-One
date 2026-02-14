# AM Impact – ServiceNow Learners Hub

A comprehensive web application for the AM Impact Group, serving as a central hub for ServiceNow learners, job seekers, and the broader community.

## Divisions

1.  **AM Academy**: Education wing focusing on ServiceNow, SAP, and competitive exams.
2.  **AM Marketing**: Digital branding and corporate event management.
3.  **AM Foods**: Cloud kitchens and packaged food products.
4.  **AM Tech**: IT services and automation solutions.

## Technical Stack

*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Routing**: React Router (HashRouter for GitHub Pages compatibility)
*   **Icons**: Lucide React
*   **Backend/Data**: Firebase Firestore (Mock implementation provided for demo)

## How to Deploy to GitHub

You can deploy this website to GitHub Pages easily.

### Option 1: Manual Upload
1.  Create a new repository on GitHub.
2.  Click "Upload files".
3.  Drag and drop all project files (pages, components, package.json, etc.) into the upload area.
4.  Commit changes.
5.  Go to **Settings > Pages** and ensure the source is set to "GitHub Actions". The included `.github/workflows/deploy.yml` will handle the rest automatically.

### Option 2: Command Line
1.  Initialize git: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Initial commit"`
4.  Add remote: `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git`
5.  Push: `git push -u origin main`

The site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` after the Action completes (usually 2-3 minutes).
