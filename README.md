# Group Management

## Screenshots

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Run the project

### DEPENDENCIES
install the following packages:

material-ui<br>
material-table<br>
deepcopy<br>
deep-equal<br>
papaparse<br>

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Change WordPress URL

Go to `app.json` file and change the `siteUrl` value to yours.

## Covered features:

>> Client side form validations<br>
>> Server side form validations<br>
>> WordPress Authentication (login) with JWT<br>
>> Protected route with [React Router](https://reacttraining.com/react-router/)

<!--
function my_customize_rest_cors() {
	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', function( $value ) {
		header( 'Access-Control-Allow-Origin: *' );
		header( 'Access-Control-Allow-Methods: GET' );
		header( 'Access-Control-Allow-Credentials: true' );
		header( 'Access-Control-Expose-Headers: Link', false );
		return $value;
	} );
}
add_action( 'rest_api_init', 'my_customize_rest_cors', 15 ); -->


<!--
// // iterate localStorage
// for (var i = 0; i < localStorage.length; i++) {
//
//   // set iteration key name
//   var key = localStorage.key(i);
//
//   // use key name to retrieve the corresponding value
//   var value = localStorage.getItem(key);
//
//   // console.log the iteration key and value
//   console.log('Key: ' + key + ', Value: ' + value);
//
// }
 -->
