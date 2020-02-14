**This folder is initialized by [Expo Cli](https://expo.io/tools#cli).**

### Folder structure

```
.                            // a complete Expo/ReactNative project: all of the client code
|
├── core                     // a complete create-react-app project: all of the website code
|   ├── build                // output from your TypeScript build for website
|   ├── node_modules         // all of your npm dependencies for website code
|   ├── public               // static assets that will be used to build website
|   ├── src                  // non-view layer code for both clients, and view layer code of the website
|   |   ├── actions          // Redux actions implementations, shared for both website and mobile apps
|   |   ├── models           // type definitions, may be used for both server and clients
|   |   ├── reducers         // Redux reducers implementations, shared for both website and mobile apps
|   |   ├── shared           // common utilities for client, shared for both website and mobile apps
|   |   ├── website          // all view layer code of the website
|   |   ├── index.tsx        // entry point of the website
|   |   ├── serviceWorker.ts // create-react-app generated file, which is used for debug
|   |   └── setupProxy.js    // bypasses all REST API calls to nodejs server while debugging
|   ├── package.json         // contains npm dependencies and build scripts for website
|   └── tsconfig.json        // config settings for compiling website
|
├── assets                   // images used by expo/react-native project
├── src                      // all view layer code of the mobile apps
├── app.json                 // Expo configuration for mobile apps
├── App.tsx                  // entry point of the Expo/ReactNative project
├── package.json             // contains npm dependencies and build scripts for mobile apps
├── babel.config.js          // expo-cli generated file for babel settings
├── metro.config.js          // config settings for Expo compiler
├── tsconfig.json            // config settings for compiling mobile apps
└── yarn.lock                // in which Yarnpkg stores versions of each dependency
```
