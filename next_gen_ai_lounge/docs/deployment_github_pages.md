# Deploying a Next.js App to GitHub Pages (Static Export)

This document outlines how to deploy a Next.js application as a static site to GitHub Pages. This method is suitable for sites that do not require server-side rendering (SSR), API routes, or other dynamic Node.js server features at runtime. Our `platform-app` currently uses an API route (`/api/personalize`), which **will not work** if deployed statically to GitHub Pages.

## Overview

GitHub Pages is designed to host static websites. To deploy a Next.js app to GitHub Pages, you must export it to static HTML, CSS, and JavaScript files.

## Steps for Static Export and Deployment

**Note on `platform-app` Configuration (as of recent updates):**

The `platform-app` within this repository has now been pre-configured for static export suitable for GitHub Pages:

-   **`platform-app/next.config.ts`** has been updated with `output: 'export'`.
-   It also includes a conditional `basePath` and `assetPrefix` set to `/next_gen_ai_lounge`. If your GitHub repository is named differently, you **must** update these values in `platform-app/next.config.ts` to match `/<your-repo-name>` for correct deployment on GitHub Pages.
-   **`platform-app/package.json`** includes a `deploy-gh` script (`"gh-pages -d out -t true"`) which can be run via `npm run deploy-gh` (after `npm install`) from the `platform-app` directory to build and deploy the static site to the `gh-pages` branch.

The UI page `/show-personalized-content` has also been adjusted to better handle the absence of API routes in a static environment. Remember that API routes like `/api/personalize` **will not function** in this static deployment.

### 1. Configure `next.config.js` (if needed)

For GitHub Pages, if your repository is named `<your-username>.github.io` and you're deploying to the root, no special `basePath` is needed. However, if you are deploying to a subpath like `https://<your-username>.github.io/<repository-name>/`, you'll need to configure `basePath` and potentially `assetPrefix` in your `next.config.js` file located in `platform-app/next.config.js`.

**Example for a repository named `my-nextjs-app`:**
```javascript
// platform-app/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set basePath if deploying to a subfolder on GitHub Pages
  // e.g., if your GitHub Pages URL is https://<username>.github.io/<repo-name>
  // then basePath should be "/<repo-name>"
  basePath: process.env.NODE_ENV === 'production' ? '/<repo-name>' : '', // Replace <repo-name>

  // Set assetPrefix for correct asset loading in subfolders (optional but recommended)
  assetPrefix: process.env.NODE_ENV === 'production' ? '/<repo-name>/' : '', // Replace <repo-name>

  // Important: Disable server-side features for static export
  output: 'export', // This enables static HTML export

  // Optional: If you use next/image, you might need to configure a custom loader
  // if the default Vercel loader isn't suitable for static hosting.
  // For GitHub Pages, a simple relative path loader might be needed if issues arise.
  // images: {
  //   loader: 'custom',
  //   loaderFile: './image-loader.js', // Example custom loader
  // },

  // Ensure trailing slashes if your static host requires them (GitHub Pages usually doesn't strictly)
  // trailingSlash: true,
};

module.exports = nextConfig;
```
**Note:** Our current `platform-app/next.config.js` is minimal. You would need to add the `output: 'export'` line and potentially `basePath` and `assetPrefix` if deploying the `platform-app` to a repository subpath on GitHub Pages.

### 2. Update `package.json` Build Scripts

In `platform-app/package.json`, ensure your `build` script includes `next export` after `next build` if you are not using `output: 'export'` in `next.config.js`. However, with `output: 'export'` in `next.config.js` (the recommended Next.js 13+ way), the `next build` command will automatically produce the static export in the `out/` directory.

If `output: 'export'` is in `next.config.js`:
```json
// platform-app/package.json
"scripts": {
  // ... other scripts
  "build": "next build", // This will produce static output in `out/`
  // ...
}
```
The `next build` command will generate the static files in the `platform-app/out` directory.

### 3. Export the Application

Run the build command from the `platform-app` directory:
```bash
cd platform-app
npm run build
```
This will create an `out/` directory containing the static HTML, CSS, and JavaScript files.

### 4. Deploy to GitHub Pages

There are several ways to deploy the `out/` directory contents to GitHub Pages:

**a) Manual Deployment:**
   - Commit the contents of the `platform-app/out/` directory to a specific branch (commonly `gh-pages` or the `docs/` folder on your main branch).
   - Configure your repository's GitHub Pages settings to serve from that branch/folder.

**b) Using `gh-pages` CLI Tool (Recommended for simplicity):**
   - Install the `gh-pages` package as a dev dependency:
     ```bash
     cd platform-app
     npm install gh-pages --save-dev
     ```
   - Add a deploy script to `platform-app/package.json`:
     ```json
     // platform-app/package.json
     "scripts": {
       // ... other scripts
       "build": "next build",
       "deploy-gh": "npm run build && gh-pages -d out -t true" // -t true includes dotfiles
     }
     ```
     (The `-t true` option ensures that files like `.nojekyll` are also included if you add one to the `out` directory, which can be important for GitHub Pages.)
   - Run the deploy script from the `platform-app` directory:
     ```bash
     npm run deploy-gh
     ```
     This command will build the app, and then push the contents of the `out/` directory to the `gh-pages` branch of your repository. You'll then need to configure GitHub Pages in your repository settings to serve from the `gh-pages` branch.

## Limitations of Static Export

Deploying a Next.js app as a static site has significant limitations:

-   **No API Routes:** Any files in `pages/api` (or `src/app/api` for App Router) will not work. Our `/api/personalize` endpoint would be unavailable.
-   **No Server-Side Rendering (SSR):** Functions like `getServerSideProps` or dynamic rendering in App Router components that rely on server-side Node.js environment will not work.
-   **No Incremental Static Regeneration (ISR)** without a custom setup on a compatible hosting platform.
-   **Dynamic Routing:** Dynamic routes will be exported as individual HTML files based on `getStaticPaths`. If `fallback` is `true` or `blocking`, those fallback behaviors won't work as they require a Node.js server.
-   **`next/image`:** May require a custom image loader for optimization if the default cloud provider optimizations are not available.

## Conclusion

For simple, static content sites, GitHub Pages can be a good, free hosting option. However, for the full functionality of Next.js, including API routes and server-side features (which our `next_gen_ai_lounge/platform-app` is intended to have), platforms like Vercel (which we've already documented) or Netlify are more appropriate.

If the goal is to have a simple brochure site or a demo with limited interactivity from the `platform-app` on GitHub Pages, ensure all necessary data is fetched at build time or client-side from external APIs.
