## Usage

```bash
$ yarn
```
## Setup Local Environment

You may either simply create the .env files by yourself referring to the conventions set in Vite or you run the local
[setup script](setup_envs.sh). Be aware to provide all necessary values, those being a name for `envType` (provide
only a literal), a `logToConsole` value (boolean), a `persistLogs` value (boolean), a `localStorageLogs` value 
(boolean) and a `localStorageLimit` value (number), e.g.:
```shell
./setup_envs.sh test true false true 100
```

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `yarn build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

Learn more about deploying your application with the [documentations](https://vitejs.dev/guide/static-deploy.html)
