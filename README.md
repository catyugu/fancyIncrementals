# **Fancy Incrementals - A Full-Stack Cloudflare Application**

This document provides a guide on how to set up, develop, and deploy this full-stack serverless application using Cloudflare Pages for the frontend, Cloudflare Workers for the backend API, and Cloudflare R2 for object storage.

## **1\. Project Overview**

This project is a platform for hosting and playing incremental games. The premier game, **Cosmic Forge**, challenges players to generate Energy, build a cosmic empire, and ascend to gain powerful permanent boosts.

*   **Frontend:** A React application built with Vite, hosted on Cloudflare Pages. It serves as the main hub for discovering and playing games.
*   **Backend:** A serverless API built with Cloudflare Workers. It will handle game-specific logic and data persistence.
*   **Storage:** Cloudflare R2 is used for storing game saves, while `localStorage` is used for client-side persistence.

## **2\. Features**

*   **React Frontend:** A modern, responsive frontend built with React and Vite.
*   **Example Game: Cosmic Forge**
    *   **Advanced Mechanics:** Features multiplicative and exponential upgrades.
    *   **Ascension System:** Players can reset progress to gain "Stardust" for powerful, permanent boosts.
    *   **Persistence:** Game state is automatically saved to `localStorage` every 5 seconds.
    *   **Offline Progress:** Calculates and applies resource gains that occurred while the game was closed.
*   **Serverless Backend:** A scalable, serverless backend using Cloudflare Workers.
*   **Cloudflare Integration:** Fully integrated with Cloudflare for deployment, hosting, and storage.
*   **Code Quality:** ESLint is configured to ensure code quality and consistency.

## **3\. Prerequisites**

Before you begin, ensure you have the following installed and configured:

*   **Node.js and npm:** It is highly recommended to use a Node Version Manager (like nvm) to install a recent LTS (Long-Term Support) version.
    ```bash
    node -v # Should be v18.x or higher
    npm -v
    ```
*   **A Cloudflare Account:** You will need a free Cloudflare account to deploy your application.
*   **Git:** For version control.

## **4\. Initial Project Setup**

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd fancy-incrementals
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```

## **5\. Local Development**

To run and test your entire application on your local machine:

1.  **Start the Development Server:** This command starts the frontend and backend servers simultaneously.
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:5173` (or a similar port).

2.  **View in Browser:** Open `http://localhost:5173` in your web browser to interact with the React frontend.

## **6\. Project Structure Explained**

*   `src/`: Contains all the frontend React application code.
    *   `App.jsx`: The main application component that handles routing.
    *   `main.jsx`: The entry point for the React app.
    *   `HomePage/`: Contains the components for the main landing page.
    *   `games/`: Contains the frontend components for each individual game.
*   `worker/`: Contains the backend serverless API code.
    *   `src/index.js`: The entry point for all API requests. This is where API routing and logic begins.
    *   `src/games/`: Contains the backend logic for each game, separated into its own module.
*   `wrangler.jsonc`: The main configuration file for Cloudflare. It defines your project name, entry points, and bindings to services like R2.
*   `package.json`: Defines project scripts (like `dev`, `deploy`) and dependencies.
*   `vite.config.js`: Configuration file for Vite, the frontend build tool.
*   `eslint.config.js`: Configuration for ESLint, the code linter.
*   `styling_regulations.md`: A document that outlines the styling regulations for the project.

## **7. Code Quality**

To ensure code quality, this project uses ESLint. You can run the linter with the following command:

```bash
npm run lint
```

## **8\. Deployment**

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

## **9. Contributing**

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Run the linter (`npm run lint`).
5.  Commit your changes (`git commit -m 'Add some feature'`).
6.  Push to the branch (`git push origin feature/your-feature`).
7.  Open a pull request.

## **10. License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
