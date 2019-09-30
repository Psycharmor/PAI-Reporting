import React from 'react';

import { AUTH_TOKEN, getUserSnippet } from '../helper';
import Table from './table/Table';

import { Button, Container } from '@material-ui/core';



const Dashboard = props => {


    const user = JSON.parse(localStorage.getItem(AUTH_TOKEN));

    return (

      <Container>
      <div className="Dashboard-container">
        <div className="user-snippet">
          <h1>{getUserSnippet(user.user_display_name)}</h1>
        </div>
        <h2>{user.user_display_name}</h2>
        <Button variant="contained" color="primary" onClick={() => {
          localStorage.removeItem(AUTH_TOKEN);
          props.history.push('/');
          }}
          > Log Out </Button>
      </div>
          <Table />
      </Container>


    );

}

export default Dashboard;
