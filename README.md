<div align="center">
    <h1>AuthEase</h1>
    <img src="./images/authease.svg" alt="AuthEase Logo" width="200" height="200" />
</div>

AuthEase is a complete solution for secure user management in your Node.js application. It provides session management to ensure that your user's data is kept safe and secure. AuthEase is built using TypeScript, Node.js, Express, MongoDB, Typegoose, and Zod.

## Getting Started

To get started with AuthEase, you'll need to have Node.js and Yarn installed on your machine. You'll also need to have MongoDB installed and running.

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Adi-ty/AuthEase.git
cd AuthEase
```

Next, install the dependencies using Yarn:

```bash
yarn install
```

Then, create a .env file in the root directory of the project and add your MongoDB connection string:

```bash
DB_URI=mongodb://localhost:27017/db-authease
```

Finally, start the API using the following command:

```bash
yarn dev
```

This will start the API in development mode. You can then access the API at http://localhost:3000.

If you prefer to run the API in a Docker container, you can use the following command instead:

```bash
docker-compose up
```

This will start the API. You can then access the API at http://localhost:3000.

## API Documentation

AuthEase comes with a comprehensive API documentation website that you can use to learn more about the API and its endpoints. You can access the documentation website at [auth-ease-documentation.vercel.app/](https://auth-ease-documentation.vercel.app/).

## Contributing

If you'd like to contribute to AuthEase, please fork the repository and create a new branch for your changes. Once you've made your changes, submit a pull request and we'll review your changes as soon as possible.
