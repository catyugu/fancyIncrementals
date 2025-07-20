# Gemini AI Assistant Guide for Fancy Incrementals

This document provides guidance for the Gemini AI assistant to effectively contribute to the Fancy Incrementals project.

## **1. Project Overview**

Fancy Incrementals is a full-stack serverless application for hosting and playing incremental games.

## **2. Key Technologies**

* **Frontend:** React (JavaScript/JSX) for building interactive user interfaces.
* **Backend:** Cloudflare Workers (JavaScript) for serverless API endpoints and logic.
* **Storage:** Cloudflare R2 for object storage, primarily used for game saves.
* **Build Tool:** Vite for fast development and optimized builds.
* **Deployment:** Cloudflare Pages for frontend hosting and Cloudflare Workers for backend deployment.

## **3. Development Philosophy**

* **Modularity:** Each game should be a self-contained module, with its own frontend and backend components. This makes it easier to develop, test, and deploy individual games.
* **Simplicity:** Keep the core platform simple and lightweight. Avoid adding unnecessary complexity to the main application.
* **Scalability:** The backend should be designed to handle a large number of concurrent players and games.

## **4. Conventions**

* **Styling:** All styling must adhere to the rules outlined in `styling_regulations.md`.
* **File Structure:** Follow the existing file structure. New games should be added to the `src/games` (frontend) and `worker/src/games` (backend) directories.
* **Component Naming:** React components should be named in PascalCase (e.g., `MyComponent`).
* **API Endpoints:** API endpoints for games should be prefixed with `/api/games/:gameName`. The Cloudflare Worker handles routes under `/api/*`.
* **Commits:** Follow the conventional commit format (e.g., `feat: add new game`, `fix: resolve issue with game state`).

## **5. Development Workflow**

* **Install Dependencies:** `npm install`
* **Start Development Server:** `npm run dev` (starts both frontend and a local Cloudflare Worker).
* **Build Project:** `npm run build` (builds frontend assets to `./dist`).
* **Deploy:** `npm run deploy` (deploys the Cloudflare Worker and frontend assets).
* **Testing:** `npm test` (if tests are implemented, otherwise refer to specific game directories for testing instructions).

## **6. Goals for the AI Assistant**

* **Game Development:** Assist in creating new incremental games, including frontend components (React) and backend logic (Cloudflare Workers).
* **Feature Enhancement:** Help add new features to the platform, such as user accounts, leaderboards, and social sharing, ensuring they integrate with Cloudflare Workers and R2.
* **Bug Fixes:** Identify and fix bugs in both frontend and backend code.
* **Code Quality:** Ensure that all new code adheres to the project's conventions and quality standards, including proper React practices and Cloudflare Worker best practices.
