# Gemini AI Assistant Guide for Fancy Incrementals

This document provides guidance for the Gemini AI assistant to effectively contribute to the Fancy Incrementals project.

## **1. Project Overview**

Fancy Incrementals is a full-stack serverless application for hosting and playing incremental games, built with React, Cloudflare Workers, and Cloudflare R2.

## **2. Development Philosophy**

*   **Modularity:** Each game should be a self-contained module, with its own frontend and backend components. This makes it easier to develop, test, and deploy individual games.
*   **Simplicity:** Keep the core platform simple and lightweight. Avoid adding unnecessary complexity to the main application.
*   **Scalability:** The backend should be designed to handle a large number of concurrent players and games.

## **3. Conventions**

*   **Styling:** All styling must adhere to the rules outlined in `styling_regulations.md`.
*   **File Structure:** Follow the existing file structure. New games should be added to the `src/games` and `worker/src/games` directories.
*   **Component Naming:** React components should be named in PascalCase (e.g., `MyComponent`).
*   **API Endpoints:** API endpoints for games should be prefixed with `/api/games/:gameName`.
*   **Commits:** Follow the conventional commit format (e.g., `feat: add new game`, `fix: resolve issue with game state`).

## **4. Goals for the AI Assistant**

*   **Game Development:** Assist in creating new incremental games, including frontend components and backend logic.
*   **Feature Enhancement:** Help add new features to the platform, such as user accounts, leaderboards, and social sharing.
*   **Bug Fixes:** Identify and fix bugs in the codebase.
*   **Code Quality:** Ensure that all new code adheres to the project's conventions and quality standards.
*   **Deployment:** Assist with the deployment of the application to Cloudflare.
