# Usage

This document explains how to run the application, execute tests, and other useful information for working with the project.

## Starting the Application

To start the application in a development environment, ensure all prerequisites are installed and follow these steps:

1. Install dependencies

    Before starting the application, run:

    ```bash
        npm install
    ```

 2. Run the development server:

    Start the application using Vite:

    ```bash
        npm run start
    ```

    This will open the application in your browser at [http://localhost:3001](http://localhost:3001) (default port is 5173).

 3. Backend required:
 
    Ensure the backend TaxDown Senior Backend Challenge is running before interacting with the application.

## Building for Production

To generate an optimized build for production, use the following command:

```bash
    npm run build
```

The generated files will be located in the dist/ folder. You can serve them using any static web server, like [serve](https://www.npmjs.com/package/serve):

```bash
    npx serve dist
```

## Running Tests

This project includes unit and integration tests with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/). To run the tests, use:

```bash
    npm run test
```

The tests will run in the configured environment and provide a detailed report of the results.

## Environment Configuration

The project uses dotenv to manage environment-based configurations. Create a .env file at the root of the project and define the necessary variables, such as the backend URL:

```bash
    VITE_API_BASE_URL=http://localhost:3000
```

Ensure the variables match your backend environment to avoid errors.

## Recommended Tools

- React DevTools: Enhance debugging for React components. [Download here](https://reactjs.org/link/react-devtools).
- Vite Debugging: Enable debugging in Vite’s configuration to trace issues related to module bundling and loading.