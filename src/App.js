import React, { Component } from 'react';

import Router from './components/Router';

class App extends Component {

    // componentDidMount() {
    //     this.callBackendAPI()
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err));
    // }
    //
    // callBackendAPI = async () => {
    //     const response = await fetch("/backend");
    //     const body = await response.json();
    //
    //     if(response.status !== 200) {
    //         throw Error(body.message);
    //     }
    //
    //     return body;
    // };

  render() {
    return (
      <Router />
    );
  }
}

export default App;
