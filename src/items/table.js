import React, { Component } from 'react'
import { AUTH_TOKEN } from '../helper';
import WPAPI from '../service/wpClient';

class Table extends Component {
  constructor () {
    super();
    this.state = {
      clouds: []
    }
  }

  componentDidMount (){
    const user = JSON.parse(localStorage.getItem(AUTH_TOKEN));

    // let jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wc3ljaGFybW9yLmNvbSIsImlhdCI6MTU2ODM4NzUyMywibmJmIjoxNTY4Mzg3NTIzLCJleHAiOjE1Njg5OTIzMjMsImRhdGEiOnsidXNlciI6eyJpZCI6IjE4NTExIn19fQ.gp3Vt_AGrMsRvKDokIJfauphOvhfXEnXjTP3ZoOaiAk'
    // let jwtData = jwt.split('.')[1]
    // let decodedJwtJsonData = window.atob(jwtData)
    // let decodedJwtData = JSON.parse(decodedJwtJsonData)
    //
    // let isAdmin = decodedJwtData.admin
    //
    // console.log('jwtData: ' + jwtData)
    // console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
    // console.log('decodedJwtData: ' + decodedJwtData)
    // console.log('Is admin: ' + isAdmin)
    // 
    // console.log(user)
    // debugger
    const usersUrl = WPAPI.usersEndpoint;
    let header = new Headers();
    header.append('Accept', 'application/json');
    let req = new Request(usersUrl, {
        method: 'GET',
        headers : {
          Authorization:'Bearer' + user.token },
        mode: 'cors'
    });
    fetch(req)
        .then( (response)=>{
            if(response.ok){
                return response.json();
            }else{
                throw new Error('BAD HTTPS');
            }
        }).then( (jsonData) => {
            this.setState({ clouds: jsonData })

          console.log(jsonData);

        }).catch( (err) =>{
            console.log('ERROR:', err.message);
        });
  }//end MOUNT

  render() {
    const items = this.state.clouds.map((item, key) =>
            <li key={item.id}>ID :{item.id}</li>
        );

    return (
      <div className="container">
        <ul>
          {items}
        </ul>
      </div>
    )
  }
}
export default Table
