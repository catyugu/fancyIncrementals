# **Fancy Incrementals - A Full-Stack Cloudflare Application**

This document provides a guide on how to set up, develop, and deploy this full-stack serverless application using Cloudflare Pages for the frontend, Cloudflare Workers for the backend API, and potentially Cloudflare D1 for the database in the future.

## **1\. Project Overview**

This project is a platform for hosting and playing incremental games.

*   **Frontend:** A React application built with Vite, hosted on Cloudflare Pages. It serves as the main hub for discovering and playing games.
*   **Backend:** A serverless API built with Cloudflare Workers. It will handle game-specific logic and data persistence.
*   **Database:** While not fully implemented, the project is set up to potentially use Cloudflare D1 for storing game state and user progress.

## **2\. Prerequisites**

Before you begin, ensure you have the following installed and configured:

*   **Node.js and npm:** It is highly recommended to use a Node Version Manager (like nvm) to install a recent LTS (Long-Term Support) version.
    ```bash
    node -v # Should be v18.x or higher
    npm -v
    ```
*   **A Cloudflare Account:** You will need a free Cloudflare account to deploy your application.
*   **Git:** For version control.

## **3\. Initial Project Setup**

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd fancy-incrementals
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```

## **4\. Local Development**

To run and test your entire application on your local machine:

1.  **Start the Development Server:** This command starts the frontend and backend servers simultaneously.
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:5173` (or a similar port).

2.  **View in Browser:** Open `http://localhost:5173` in your web browser to interact with the React frontend.

## **5\. Project Structure Explained**

*   `src/`: Contains all the frontend React application code.
    *   `App.jsx`: The main application component that handles routing.
    *   `main.jsx`: The entry point for the React app.
    *   `HomePage/`: Contains the components for the main landing page.
    *   `games/`: Contains the frontend components for each individual game.
*   `worker/`: Contains the backend serverless API code.
    *   `src/index.js`: The entry point for all API requests. This is where API routing and logic begins.
    *   `src/games/`: Contains the backend logic for each game, separated into its own module.
*   `wrangler.jsonc`: The main configuration file for Cloudflare. It defines your project name, entry points, and bindings to services like D1.
*   `package.json`: Defines project scripts (like `dev`, `deploy`) and dependencies.
*   `vite.config.js`: Configuration file for Vite, the frontend build tool.
*   `eslint.config.js`: Configuration for ESLint, the code linter.

## **6\. Deployment**

Deploying your application to the internet is a single step.

1.  **Run the Deploy Command:**
    ```bash
    npm run deploy
    ```

2.  **Process:** This command will:
    *   Build the React application for production.
    *   Deploy the static assets (`dist` folder) to Cloudflare Pages.
    *   Deploy your `worker/` directory as a Cloudflare Worker.
    *   Link everything together.

3.  **Access Your Site:** Once complete, wrangler will provide you with the public URL for your live application (e.g., `https://fancy-incrementals.pages.dev`).
