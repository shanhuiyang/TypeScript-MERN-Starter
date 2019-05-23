# TypeScript MERN Starter
> **Note!** This project is still **under construction**, but it has already been working well. You can go to the [Quick Start](#quick-start) section and have a try.

This project is intended to build a RESTful MERN start point in TypeScript. With this project as a start point you can easily extend it to a community or blog app.

MERN is a free and open-source JavaScript software stack for building dynamic web sites and web applications. The MERN stack is composed of MongoDB, Express.js, React, and Node.js. 

This project implemented MERN in **TypeScript**. TypeScript is a typed superset of JavaScript. It has become popular recently in applications due to the benefits it can bring. 
If you are new to TypeScript it is highly recommended to become familiar with it first before proceeding. You can check out its documentation [here](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

TypeScript has brought the following benefits to MERN:

- **Unified modeling** across web client and server for objects
- Type safety, and easy refactoring of typed code across web client and server
- A superior developer experience in a team environment

Not only using TypeScript, but this project is also featured by:

- **[RESTful-style](https://www.restapitutorial.com/lessons/whatisrest.html)**, powered by an embedded [oauth2 server](https://github.com/jaredhanson/oauth2orize) and [passport.js](http://www.passportjs.org/), this project separate client and server clearly.
- **[React-router 4.0](https://reacttraining.com/react-router/)**, with it you can easily define client routes and manage them.
- **[Redux](https://redux.js.org/introduction)**, with it you can easily manage client states.
- **Almost ready** for a community app. We modelled ```User``` as well as ```Article```. This is a **real starter**  for who would like to build an community app on MERN.
- The client code is created from [create-react-app](https://facebook.github.io/create-react-app/), so now you can get rid of annoying configurations for babel and webpack.
# Motivation
(constructing...)
# Quick Start
## Prerequisite
To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)

## Clone the repository
```
git clone https://github.com/shanhuiyang/TypeScript-MERN-Starter.git <project_name>
```
## Install dependencies
```
cd <project_name>
npm run update
```
## Start your mongoDB server
(you'll probably have to start another command prompt)
```
mongod
```
## Build and run the project
```
npm run start
```
Finally, navigate to [http://localhost:3000](http://localhost:3000) and you should see the template being served and rendered locally!
# Project Structure
(constructing...)
# Tutorial 
(constructing...)
# Deploying the app
There are many ways to deploy an Node app, and in general, nothing about the deployment process changes because you're using TypeScript.
In this section, let's show you how to deploy this project to Azure App Service.
## Prerequisite
- [**Azure account**](https://azure.microsoft.com/en-us/free/) - If you don't have one, you can sign up for free.
The Azure free tier gives you plenty of resources to play around with including up to 10 App Service instances, which is what we will be using.
- [**VS Code**](https://code.visualstudio.com/) - We'll be using the interface provided by VS Code to quickly deploy our app.
- [**Azure App Service VS Code extension**](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) - In VS Code, search for `Azure App Service` in the extension marketplace (5th button down on the far left menu bar), install the extension, and then reload VS Code.
## Create production MongoDB
In this step, you create a MongoDB database in Azure. When your app is deployed to Azure, it uses this cloud database.
For MongoDB, we use Azure Cosmos DB. Cosmos DB supports MongoDB client connections.
### Open Azure Cloud Shell
1. Sign in [Azure Portal](https://portal.azure.com) using your account.
2. Open [Azure cloud shell button](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-nodejs-mongodb-app#open-azure-cloud-shell) on the menu in the upper-right corner of the portal.
3. Then if you are prompted that **You have no storage mounted**, just click **Create Storage**.
### Create a resource group
In the opened shell enter following command. Change the location according to your preference.
```
az group create --name myResourceGroup --location "West Europe"
```
After entering this you should get a Json response in the shell. With following property in it.
```
"properties": {
    "provisioningState": "Succeeded"
}
```
### Create a Cosmos DB account
In the following command, substitute a unique Cosmos DB name for the ```<cosmosdb_name>``` placeholder. This name is used as the part of the Cosmos DB endpoint, ```https://<cosmosdb_name>.documents.azure.com/```, so the name needs to be unique across all Cosmos DB accounts in Azure. The name must contain only lowercase letters, numbers, and the hyphen (-) character, and must be between 3 and 50 characters long.
```
az cosmosdb create --name <cosmosdb_name> --resource-group myResourceGroup --kind MongoDB
```
When the Cosmos DB account is created several minutes later, the Azure CLI shows information similar to the following example:
```
{
  "consistencyPolicy":
  {
    "defaultConsistencyLevel": "Session",
    "maxIntervalInSeconds": 5,
    "maxStalenessPrefix": 100
  },
  "databaseAccountOfferType": "Standard",
  "documentEndpoint": "https://<cosmosdb_name>.documents.azure.com:443/",
  "failoverPolicies": 
  ...
  < Output truncated for readability >
}
```
## Connect app to production MongoDB
In this step, you connect Typescript MERN project to the Cosmos DB database you just created, using a MongoDB connection string.
### Retrieve the database key
To connect to the Cosmos DB database, you need the database key. In the Cloud Shell, use following command to retrieve the primary key.
```
az cosmosdb list-keys --name <cosmosdb_name> --resource-group myResourceGroup
```
The Azure CLI shows information similar to the following example:
```
{
  "primaryMasterKey": "RS4CmUwzGRASJPMoc0kiEvdnKmxyRILC9BWisAYh3Hq4zBYKr0XQiSE4pqx3UchBeO4QRCzUt1i7w0rOkitoJw==",
  "primaryReadonlyMasterKey": "HvitsjIYz8TwRmIuPEUAALRwqgKOzJUjW22wPL2U8zoMVhGvregBkBk9LdMTxqBgDETSq7obbwZtdeFY7hElTg==",
  "secondaryMasterKey": "Lu9aeZTiXU4PjuuyGBbvS1N9IRG3oegIrIh95U6VOstf9bJiiIpw3IfwSUgQWSEYM3VeEyrhHJ4rn3Ci0vuFqA==",
  "secondaryReadonlyMasterKey": "LpsCicpVZqHRy7qbMgrzbRKjbYCwCKPQRl0QpgReAOxMcggTvxJFA94fTi0oQ7xtxpftTJcXkjTirQ0pT7QFrQ=="
}
```
Copy the value of ```primaryMasterKey```. You need this information in the next step.
### Configure the connection string in your Node.js application
In your Typescript MERN project open file _.env.production_. Replace the two ```<cosmosdb_name>``` placeholders with your Cosmos DB database name, and replace the ```<primary_master_key>``` placeholder with the key you copied in the previous step.
```
MONGODB_URI=mongodb://<cosmosdb_name>:<primary_master_key>@<cosmosdb_name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false
```
The ```ssl=true``` option is required because Cosmos DB requires SSL. Save your changes.
### Test the application in production mode
In file _.env.production_, change the ORIGIN_URI to the localhost.
```
ORIGIN_URI=http://localhost
```
Open your local terminal. Switch the local node env from development to production by entering following commands.
```
# Bash
NODE_ENV=production
# Windows PowerShell
$env:NODE_ENV = "production" 
```
Build the production for your TypeScript MERN project.
```
npm run build
```
Start your local production server.
```
npm run serve
```
In the output of terminal, you should see that **MongoDB is connected successfully**.

Navigate to http://localhost:3000 in a browser. Click Sign Up in the top menu and create a test user. If you are successful creating a user and signing in, then your app is writing data to the Cosmos DB database in Azure. You can check that in your Azure portal's **Azure Cosmos DB account** page using **Data Explorer**.

In the terminal, stop Node.js by typing Ctrl+C.
# Prior Art
### TypeScript-Node-Starter
https://github.com/Microsoft/TypeScript-Node-Starter
### mern-starter
https://github.com/Hashnode/mern-starter
### oauth2api
https://github.com/PatrickHeneise/oauth2api
# Road Map
We would like to extend this project from MERN to MERRN, another R stands for ReactNative. TypeScript will show the power of modeling in a **real fullstack** web app.