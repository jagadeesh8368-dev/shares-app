# React + TypeScript + Vite

## Local demo mode

The app opens with local mock stock data when Firebase variables are left blank. Add the `VITE_FIREBASE_*` values from `.env.example` to enable the account sign-in flow for a deployed or shared environment.

## Firebase Authentication

The app now requires a Firebase Authentication session before opening the stock research dashboard. To configure it:

1. Create or open a project in the Firebase Console.
2. In **Authentication > Sign-in method**, enable **Email/Password**.
3. In **Project settings > Your apps**, register a web app and copy its config values.
4. Copy `.env.example` to `.env` and fill in the six `VITE_FIREBASE_*` values.
5. Run `npm run dev`, then create an account from the login screen.

Firebase web config values are intended to be public client configuration. Do not put service-account private keys or passwords in `.env` or the frontend.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
