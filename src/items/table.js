import React, { Component } from 'react'
import { AUTH_TOKEN } from '../helper';
import ApiCaller from './ApiCaller';
import ActivityTable from '../components/ActivityTable';

import {Button, Select, MenuItem, TextField} from '@material-ui/core';
// import LoadingOverlay from 'react-loading-overlay';

class Table extends Component {

    constructor () {
        super();

        const user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
        this.state = {
          activities: [],
          selectedGroup: user.group[0].id,
          showOverlay: true,
          disableNextBtn: false,
          disablePrevBtn: true
        };
        this.paging = {
            limit: 1000,
            offset: 0,
            updatedAfter: 0,
            count: 0
        }
        this.groups = user.group;
    }

    componentDidMount() {
        this.changeActivityState();
    }//end MOUNT

    changeActivityPage(goingForward) {
        if (!goingForward) {
            this.paging.offset = Math.max(0, this.paging.offset - (this.paging.limit + this.paging.count))
        }
        this.changeActivityState();
    }

    changeActivityState() {
        this.setState({
            showOverlay: true,
            disableNextBtn: true,
            disablePrevBtn: true
        });
        const apiCaller = new ApiCaller();
        apiCaller.getActivityFromGroup(this.state.selectedGroup, this.paging.limit, this.paging.offset, this.paging.updatedAfter)
            .then((jsonData) => {
                this.paging.offset += jsonData.length;
                this.paging.count = jsonData.length;
                this.setState({
                    activities: jsonData,
                    selectedGroup: this.state.selectedGroup,
                    showOverlay: false,
                    disableNextBtn: this.paging.count < this.paging.limit,
                    disablePrevBtn: (this.paging.offset - this.paging.count) <= 0
                });
                console.log(this.state, this.paging);
            })
            .catch((err) => {
                console.log(err);
            }
        );
    }

    changeSelectedGroup(groupId) {
        if(groupId === this.state.selectedGroup) {
            return;
        }
        this.setState({
            showOverlay: true,
            disableNextBtn: true,
            disablePrevBtn: true
        });
        const apiCaller = new ApiCaller();
        apiCaller.getActivityFromGroup(groupId, this.paging.limit, 0, this.paging.updatedAfter)
            .then((jsonData) => {
                this.paging.offset = jsonData.length;
                this.paging.count = jsonData.length;
                this.setState({
                    activities: jsonData,
                    selectedGroup: groupId,
                    showOverlay: false,
                    disableNextBtn: this.paging.count < this.paging.limit,
                    disablePrevBtn: (this.paging.offset - this.paging.count) <= 0
                });
                console.log(this.state, this.paging);
            })
            .catch((err) => {
                console.log(err);
            }
        );
    }

    getActivityAfterDate(dateThreshold) {
        console.log(dateThreshold);
        const date = new Date(dateThreshold + " 00:00");
        if (date.toString() === "Invalid Date") {
            return;
        }
        this.paging.offset = 0;
        this.paging.updatedAfter = Math.floor(date.valueOf() / 1000);
        this.changeActivityState();
    }

    render() {
        const groups = this.groups.map((item, key) =>
            <MenuItem key={key} value={item.id}>{item.name}</MenuItem>
        );

        return (
            <div>
                <Button variant="contained" color="primary" disabled={this.state.disablePrevBtn} onClick={() => this.changeActivityPage(false)}>Prev</Button>
                <Button variant="contained" color="primary" disabled={this.state.disableNextBtn} onClick={() => this.changeActivityPage(true)}>Next</Button>
                <Select value={this.state.selectedGroup} onChange={(e) => this.changeSelectedGroup(e.target.value)}>
                    {groups}
                </Select>
                <TextField
                    type="date"
                    onBlur={(e) => this.getActivityAfterDate(e.target.value)}
                />
                <ActivityTable showOverlay={this.state.showOverlay} activities={this.state.activities} />
            </div>
        );
    }
}
export default Table;
