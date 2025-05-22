# Planulka

This project is a task management application built with Angular 19 and Firebase. It supports user authentication, task management, and role-based access control.

## Features

- **Frontend**: Angular 19, TypeScript, Angular Material, Tailwind CSS 4.0
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Authentication**: JWT-based authentication with Firebase Auth
- **Routing**: Angular Router with role-based guards
- **Progressive Web App (PWA)**: Offline support and installable on devices
- **Responsive Design**: Mobile-first approach with a sweet and friendly UI

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Firebase Setup

Ensure you have Firebase configured in your project. Update the `environment.ts` and `environment.prod.ts` files with your Firebase project credentials.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Test Accounts

- **Admin Account**:
  - Email: `admin@example.com`
  - Password: `admin123`
- **User Account**:
  - Email: `user@example.com`
  - Password: `user123`

## Style Guide

The application uses a sweet, innocent, and friendly design with the following color palette:

- **Celadon**: `hsla(137, 38%, 77%, 1)`
- **Peach Yellow**: `hsla(37, 90%, 84%, 1)`
- **Tangerine**: `hsla(28, 82%, 54%, 1)`
- **Hunter Green**: `hsla(133, 28%, 32%, 1)`
- **Fawn**: `hsla(28, 85%, 71%, 1)`

## Future Enhancements

- Integration with Google Calendar
- CI/CD pipeline setup

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
