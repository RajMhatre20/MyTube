# Welcome to the MyTube code

## Introduction

This repository contains the codebase for MyTube, a video sharing platform. This README.md file provides essential information on setting up the environment and getting started with the project.

## Setup

### Environment Variables

To run the project locally, you need to create an `.env` file in the root directory of the project. This file should contain the following parameters:

-   `PORT`: The port number on which the server will run.
-   `MONGODB_URI`: The URI for connecting to your MongoDB database.
-   `CORS_ORIGIN`: The CORS origin for allowing cross-origin requests.
-   `ACCESS_TOKEN_SECRET`: The secret key used for generating access tokens.
-   `ACCESS_TOKEN_EXPIRY`: The expiry time for access tokens.
-   `REFRESH_TOKEN_SECRET`: The secret key used for generating refresh tokens.
-   `REFRESH_TOKEN_EXPIRY`: The expiry time for refresh tokens.
-   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
-   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
-   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

Ensure you replace placeholders with appropriate values.

### Running the Project

Make sure you have all dependencies installed using command npm install and the MongoDB instance is running. Once you have set up the environment variables in the `.env` file, you can run the project using npm run dev.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
