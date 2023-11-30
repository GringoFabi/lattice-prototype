## Usage

Upon initially importing this project, go to its root directory and run the following command:

```bash
$ yarn
```
## Setup Local Environment

You may either simply create the .env files by yourself referring to the conventions set in Vite or you run the local
[setup script](setup_envs.sh). Be aware to provide all necessary values, those being a name for `envType` (provide
only a literal), a `logToConsole` value (boolean), a `persistLogs` value (boolean), a `localStorageLogs` value 
(boolean) and a `localStorageLimit` value (number), e.g.:
```shell
sh ./setup_envs.sh test true false true 100
```

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `yarn <NAME>`
After running above script, you will find a `.env.<NAME>` file in your project's local root.
Next up, you will need to add an entry to the `scripts` section of the project's [package.json](package.json).
It must be formatted like this:
```
{
  ...
  "scripts": {
    "dev": "vite",
    "<NAME>": "vite --mode <NAME>",
    ...
  },
  ...
}
```

Setting Vite's `--mode` flag allows for loading your newly created `.env` file.
If all steps have been done correctly, you can run `yarn <NAME>` to run the app with you environment 
variables set in place.

### `yarn build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

