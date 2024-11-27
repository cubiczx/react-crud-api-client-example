# Installation Guide

## Prerequisites

Ensure you have the following installed:

- Node.js >= 16
- npm >= 8

## Steps

1. Clone the repository:

   Start by cloning the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/react-crud-api-client-example.git
   cd react-crud-api-client-example
   ```

2. Install dependencies:

   To set up environment variables, create a .env file in the root of the project. You can copy the example configuration provided:

   ```bash
   npm install
   ```

3. Set up environment variables:

   To set up environment variables, create a .env file in the root of the project. You can copy the example configuration provided:

   ```bash
   cp .env.example .env
   ```

   After copying, edit the .env file to match your local or production environment configuration. Be sure to provide the correct API URLs and other necessary environment-specific settings.

4. Run the development server:

   To start the application in development mode, run:

   ```bash
   npm start
   ```

   This will start the application in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

5. Run the application in production:

   To build the application for production, run:

   ```bash
   npm build
   ```

   This will create a build/ directory with all the static files optimized for production.

6. Serve the production build:

   To serve the production build locally, you can use a simple HTTP server like serve. First, install it globally:

   ```bash
   npm install -g serve
   ```

   Then, run the following command to serve the build:

   ```bash
   serve -s build
   ```

   The application will be available at [http://localhost:5000](http://localhost:5000).

   Optional: Use a different port
      If you want to serve the production build on a different port (for example, port 3000), you can specify the port like this:

      ```bash
         serve -s build -l 3000
      ```

      In this case, the application will be available at [http://localhost:3000](http://localhost:3000).

7. Change Development or Production Port (Optional)

   If you want to change the default port for the development server or the production build, you can set the PORT variable in the .env file. For example:

   ```bash
   PORT=4000
   ```

   This will change the development server to run on port 4000. Similarly, you can configure the production server port by modifying the .env file.

## Notes

- Environment Variables: Be sure to correctly set the environment variables for local and production configurations in the .env file.
- Port Configuration: The default port for both development and production is 3000. You can change this by modifying the .env file for development or by passing a port when serving the production build.
- Production Build: Ensure that you build the application before deploying it to production. Running npm run build creates optimized, minified files ready for production.

## Troubleshooting

- If the server fails to start: Ensure that all environment variables are correctly set in the .env file.
- If you face issues with dependencies: Run npm install again to ensure all packages are installed correctly.

If you encounter any other issues, feel free to check the project’s documentation or contact the maintainers.