# **Full-Stack Cloudflare Application Guide**

This document provides a complete, step-by-step guide on how to set up, develop, and deploy a full-stack serverless application using Cloudflare Pages for the frontend, Cloudflare Workers for the backend API, and Cloudflare D1 for the database.

## **1\. Project Overview**

This project is a simple user management application that demonstrates the core features of the Cloudflare developer platform.

* **Frontend:** A React application built with Vite, hosted on Cloudflare Pages. It allows users to view and add entries to a database.  
* **Backend:** A serverless API built with Cloudflare Workers. It handles requests to fetch and create users.  
* **Database:** A Cloudflare D1 SQL database that stores the user data.

## **2\. Prerequisites**

Before you begin, ensure you have the following installed and configured:

* **Node.js and npm:** It is highly recommended to use a Node Version Manager (like nvm) to install a recent LTS (Long-Term Support) version.  
  node \-v \# Should be v18.x or higher  
  npm \-v

* **A Cloudflare Account:** You will need a free Cloudflare account to deploy your application and create a D1 database.  
* **Git:** For version control and cloning projects.

## **3\. Initial Project Setup**

This section covers how to create a new project from scratch.

1. **Create the Project:** Use the create-cloudflare CLI to generate a new project. The following command sets up a React frontend with a simple Worker backend.  
   npm create cloudflare@latest my-cloudflare-app \-- \--framework=react \--template=simple

2. **Navigate into the Directory:**  
   cd my-cloudflare-app

3. **Answer the Prompts:**  
   * When asked Do you want to deploy your application?, select **No**. This prevents an initial, unnecessary deployment and allows you to set up your database first.  
4. **Install Dependencies:** Once the project is created, install all the required packages.  
   npm install

## **4\. Database Setup (Cloudflare D1)**

Follow these steps to create and configure your database. All commands should be run from the root of your project directory.

1. **Create the D1 Database:** This command creates a new, empty database in your Cloudflare account.  
   npx wrangler d1 create \<your-database-name\>

   After running, wrangler will output a configuration block. **Copy this block.**  
2. **Configure wrangler.jsonc:**  
   * Open the wrangler.jsonc file in your project root.  
   * Paste the copied configuration block into the file. It should look like this:

{  
  "name": "my-cloudflare-app",  
  "main": "worker/index.js",  
  "compatibility\_date": "2024-07-15",  
  "pages\_build\_output\_dir": "dist",  
  "d1\_databases": \[  
    {  
      "binding": "DB",  
      "database\_name": "\<your-database-name\>",  
      "database\_id": "\<your-database-id\>"  
    }  
  \]  
}  
The binding property ("DB") is the variable name your Worker code will use to access the database.

3. **Create the Database Schema:**  
   * Create a new file named schema.sql in the project root.  
   * Add your table definitions to this file. For example:

CREATE TABLE IF NOT EXISTS users (  
  id INTEGER PRIMARY KEY,  
  name TEXT NOT NULL,  
  email TEXT NOT NULL UNIQUE  
);

4. **Execute the Schema:** You need to create the tables in both your local and remote databases.  
   * **Local Database (for development):**  
     npx wrangler d1 execute \<your-database-name\> \--file=./schema.sql

   * **Remote Database (for production):**  
     npx wrangler d1 execute \<your-database-name\> \--remote \--file=./schema.sql

## **5\. Local Development**

To run and test your entire application on your local machine:

1. **Start the Development Server:** This command starts the frontend and backend servers simultaneously.  
   npm run dev

   Your application will be available at http://localhost:5173 (or a similar port).  
2. **Test the API (Optional):** Open a **new terminal window** and use curl to test your API endpoints directly.  
   * **Create a user (POST request):**  
     curl \-X POST http://localhost:5173/api/users \\  
       \-H "Content-Type: application/json" \\  
       \-d '{"name": "Test User", "email": "test@example.com"}'

   * **Get all users (GET request):**  
     curl http://localhost:5173/api/users

3. **View in Browser:** Open http://localhost:5173 in your web browser to interact with the React frontend.

## **6\. Project Structure Explained**

* src/: Contains all the frontend React application code.  
  * App.jsx: The main application component.  
  * main.jsx: The entry point for the React app.  
* worker/: Contains the backend serverless API code.  
  * index.js: The entry point for all API requests. This is where your API logic and database queries live.  
* wrangler.jsonc: The main configuration file for Cloudflare. It defines your project name, entry points, and bindings to services like D1.  
* package.json: Defines project scripts (like dev, deploy) and dependencies.  
* schema.sql: Defines the SQL structure of your database tables.

## **7\. Deployment**

Deploying your application to the internet is a single step.

1. **Run the Deploy Command:**  
   npm run deploy

2. **Process:** This command will:  
   * Build the React application for production.  
   * Deploy the static assets (dist folder) to Cloudflare Pages.  
   * Deploy your worker/ directory as a Cloudflare Worker.  
   * Link everything together.  
3. **Access Your Site:** Once complete, wrangler will provide you with the public URL for your live application (e.g., https://my-cloudflare-app.pages.dev).

**Note:** The live application uses the **remote** D1 database. Any data you added during local development will not be present. You will need to add data again using the live web form.