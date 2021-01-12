import firebase from "firebase/app";
import "firebase/database";

// Initialize Firebase
const config = {
	apiKey: "AIzaSyCjwO2-0mCLZwkdTbQlr6VA0SxrQrXtgfM",
	authDomain: "reporting-b5318.firebaseapp.com",
	databaseURL: "https://reporting-b5318-default-rtdb.firebaseio.com",
	projectId: "reporting-b5318",
	storageBucket: "reporting-b5318.appspot.com",
	messagingSenderId: "773630701506",
	appId: "1:773630701506:web:966a6ac90766d6060e705b",
	measurementId: "G-DLR9QT5VFZ"
};

firebase.initializeApp(config);
const database = firebase.database;

export {database};
