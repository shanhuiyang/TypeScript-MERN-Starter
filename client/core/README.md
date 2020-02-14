**This folder is initialized by [Create React App](https://create-react-app.dev/docs/getting-started).**

### Folder structure

```
.                        // a complete create-react-app project: all of the website code
├── build                // output from your TypeScript build for website
├── node_modules         // all of your npm dependencies for website code
├── public               // static assets that will be used to build website
|   ├── images           // public static images for website
|   ├── storage          // local file storage for debugging
|   ├── favicon.png      // website favicon
|   └── index.html       // static webpage to be sent to website users
├── src                  // non-view layer code for both clients, and view layer code of the website
|   |
|   ├── actions          // Redux actions implementations, shared for both website and mobile apps
|   ├── models           // type definitions, may be used for both server and clients
|   |   ├── client       // type definitions for client only
|   |   └── response     // type definitions for HTTP response shared between server and clients
|   ├── reducers         // Redux reducers implementations, shared for both website and mobile apps
|   ├── shared           // common utilities for client, shared for both website and mobile apps
|   |   └── translations // international strings used by both clients and server
|   |
|   ├── website          // all view layer code of the website
|   ├── index.tsx        // entry point of the website
|   ├── serviceWorker.ts // create-react-app generated file, which is used for debug
|   └── setupProxy.js    // bypasses all REST API calls to nodejs server while debugging
├── .babelrc             // babel related configurations
├── package.json         // contains npm dependencies and build scripts for website
├── tsconfig.json        // config settings for compiling website
└── yarn.lock            // in which Yarnpkg stores versions of each dependency

```
