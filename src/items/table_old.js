import React, { Component } from 'react'
import { AUTH_TOKEN } from '../helper';
import WPAPI from '../service/wpClient';

import {Button} from '@material-ui/core';

class Table extends Component {

  constructor () {
    super();
    this.state = {
      activities: [],
    }
    this.paging = {
        count: 0,
        limit: 100,
        offset: 0
    }
  }

  componentDidMount (){
    this.fetch_data_from_api(true);
  }//end MOUNT

  render() {
    const items = this.state.activities.map((item, key) =>
            <li key={key}>Name: {item.first_name} {item.last_name}; course id: {item.activity.id}</li>
        );

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => this.fetch_data_from_api(false)}>Prev</Button>
            <Button variant="contained" color="primary" onClick={() => this.fetch_data_from_api(true)}>Next</Button>
            <div className="container">
                <ul>
                    {items}
                </ul>
            </div>
        </div>
    )
  }

  create_group_id_list(group_ids) {
      let arg_string = "";
      for (var i = 0; i < group_ids.length; ++i) {
          arg_string += group_ids[i].id + ',';
      }
      if (!arg_string) {
          return arg_string;
      }

      return arg_string.substr(0, arg_string.length - 1);
  }

  create_query_params(args) {
      let query_string = "?";
      Object.keys(args).forEach(function(key) {
          query_string += key + '=' + args[key] + '&';
      });
      return query_string.substr(0, query_string.length - 1);
  }

  fetch_data_from_api(going_forward) {
      const user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
      const activity_url = WPAPI.userActsEndpoint;
      console.log("On click", this.paging);
      if (!going_forward) {
          this.paging.offset = Math.max(0, this.paging.offset - this.paging.limit - this.paging.count );
      }
      console.log("before api", this.paging);
      let query_params = this.create_query_params({
          limit: this.paging.limit,
          offset: this.paging.offset
      });
      if (user.user_role.includes("group_leader")) {
          query_params = this.create_query_params({
              limit: this.paging.limit,
              offset: this.paging.offset,
              group_id: this.create_group_id_list(user.group)
          });
      }
      console.log(activity_url + query_params);
      let request = new Request(activity_url + query_params, {
          method: "GET",
          headers: {
              Authorization: "Bearer " + user.token
          },
          mode: "cors"
      });
      fetch(request)
          .then((response) => {
              if (response.ok) {
                  return response.json();
              }
              else {
                  throw new Error("BAD HTTPS");
              }
          })
          .then((json_data) => {
              this.paging.offset += json_data.length;
              this.paging.count = json_data.length;
              console.log(json_data);
              this.setState({
                  activities: json_data
              });
              console.log("after api", this.paging);
          })
          .catch((err) => {
              console.log(err);
          });
  }
}
export default Table
