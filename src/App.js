import React from 'react';

import Controller from "./Components/Controller";

function App() {

  var exp = JSON.parse(localStorage.getItem("DBEXPIRATION"));
  exp = (exp) ? exp["exp"] : "";

  /// Expired Date
  var expDate = new Date(exp);  // DBEXPIRATION
  var expDateDay = String(expDate.getDate()).padStart(2, '0');


  /// Today Date
  var todayDate = new Date();
  var todayDateDay = String(todayDate.getDate()).padStart(2, '0');

  if ( todayDateDay !== expDateDay){

  	console.log("DB is behind version");
  	var req = indexedDB.deleteDatabase('reportDatabase');
  	req.onsuccess = function () {
  			console.log("Deleted database successfully");
  			localStorage.clear();
  			// window.location.reload();
  	};
  	req.onerror = function () {
  			console.log("Couldn't delete database");
  	};
  	req.onblocked = function () {
  			console.log("Couldn't delete database due to the operation being blocked");
  	};
  }else{
  	console.log("DB is updated current");
  }

  return (
    <Controller/>
  );
}

export default App;
