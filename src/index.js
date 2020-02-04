import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "../node_modules/react-datetime/css/react-datetime.css";
import './index.css';
import "./Styles/login.css";
import "./Styles/controller.css";
import "./Styles/content.css";
import "./Styles/teamreport.css";
import "./Styles/survey.css";
import "./Styles/comments.css";
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
