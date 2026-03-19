# Multitube (YouTube Viewer)

A functional web application that allows users to input multiple YouTube video links and display them in a selected number of video players on the same page.

## 🚀 Live Demo

This project is automatically deployed to GitHub Pages. [View it Live!](https://rohits06oct.github.io/astral-flare-Multitube/)

## 🛠️ Deployment

This project uses **GitHub Actions** for automated deployment. Every push to the `main` branch will trigger a build and update the live site.

## 🎭 Playwright Automation

I have set up a complete automation suite in the `automation/` directory using Playwright. This suite covers both Desktop and Mobile views.

**Test Files:**
- `automation/tests/regression.spec.js`: Regression tests (Navigation, Parsing, Reset, Subscription).
- `automation/tests/e2e.spec.js`: E2E tests (Full Flow, Ads Visibility).

**Configuration:** 
`automation/playwright.config.js` supports Chrome Desktop, Pixel 5, and iPhone 12.

### How to Run Automation

1. **Navigate to the automation folder**:
   ```bash
   cd automation
   ```
2. **Run all tests**:
   ```bash
   npm test
   ```
3. **Run specific tests**:
   - **Desktop only**: `npm run test:desktop`
   - **Mobile only**: `npm run test:mobile`
   - **UI Mode (Interactive)**: `npm run test:ui`
4. **View Report**:
   ```bash
   npm run test:report
   ```

> [!NOTE]
> Playwright will automatically start the local server before running the tests, so you don't need to start it manually first.
