# Reporting App


## Run the project

### DEPENDENCIES
install the following packages:

react-router-dom<br>
bootstrap<br>
reactstrap react react-dom<br>
availity-reactstrap-validation<br>
axios<br>
react-icons<br>
react-bootstrap-table-next<br>
react-bootstrap-table2-paginator<br>
react-datetime<br>
natural<br>
react-chartjs-2 chart.js<br>
chartjs-plugin-datalabels<br>

To update:
`npm install`
<br><br>
To start fresh:
Have only the package.json file then run `npm install`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Firebase
1. cd to function/ folder
2. run npm install
3. Run `firebase deploy` and it should work automatically
4. start project yarn start run

## Start in server
yarn global add serve
serve -s build


### ONLY DO THIS STEP IF NEW FIREBASE PROJECT
### Prerequisites
1. Create a [Firebase](https://firebase.google.com/) Project
2. Install [Firebase CLI](https://firebase.google.com/docs/cli) tools
3. Login using `firebase login`

### Replace project
1. Register your app with Firebase - [Guide](https://firebase.google.com/docs/web/setup#register-app)
2. Copy your Project ID and replace on file `.firebaserc`
3. Copy your Firebase Config and replace on file `./src/firebase.js`

### Deploy
1. Run `firebase deploy` and it should work automatically
