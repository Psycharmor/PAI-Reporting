import React from "react";

import {Button, Grid, Container, MenuItem, Select} from "@material-ui/core";

import {AUTH_TOKEN} from "../helper";
import WPAPI from "../service/wpClient";
import ApiCaller from "../items/ApiCaller";

import Window from "./Window";
import LabelValueBox from "./LabelValueBox";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
        this.nextGroup = {
            groupInfo: {},
            groupUsers: {},
            groupCourses: {},
            groupCourseActivities: {}
        };

        this.state = {
            groupInfo: {},
            groupUsers: {},
            groupCourses: {},
            groupCourseActivities: {},
            currentView: "groupView",
            courseView: {},
            userView: {},
            overlayActive: false
        };
    }

    componentDidMount() {
        this.setGroup(this.user.group[0].id);
    }

    handleGroupClick() {
        this.setState({
            currentView: "groupView"
        });
    }

    handleCourseClick(course) {
        this.setState({
            currentView: "courseView",
            courseView: course
        });
    }

    handleUserClick(user) {
        this.setState({
            currentView: "userView",
            userView: user
        });
    }

    render() {
        const teams = this.user.group.map((item, key) => {
            return <MenuItem key={key} value={item.id}>{item.name}</MenuItem>;
        });

        return(
            <Container>
                <Button variant="contained" color="primary" onClick={() => {
                            localStorage.removeItem(AUTH_TOKEN);
                            this.props.history.push("/");
                        }}
                >
                    Log Out
                </Button>
                <div>
                    <h2 onClick={() => this.handleGroupClick()}>{(this.state.groupInfo.result ? this.state.groupInfo.result[0].title : "")}</h2>
                    <Select
                        value={(this.state.groupInfo.result ? this.state.groupInfo.result[0].id : this.user.group[0].id)}
                        onChange={(e) => this.setGroup(e.target.value)}
                        >
                        {teams}
                    </Select>
                </div>
                <Grid container spacing={3}>
                    <Grid item md={3} xs={12}>
                        <LabelValueBox
                            boxContent={this.getUserCount()}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <LabelValueBox
                            boxContent={this.getCourseCompletionCount()}
                        />
                    </Grid>
                </Grid>
                <div>
                    <Window
                        dashboardState={this.state}
                        handleCourseClick={(e) => this.handleCourseClick(e)}
                        handleUserClick={(e) => this.handleUserClick(e)}
                    />
                </div>
            </Container>
        );
    }


    /* Utility functions */
    updateGroupState() {
        if (this.groupStatesHaveAllUpdated()) {
            this.setState({
                groupInfo: this.nextGroup.groupInfo,
                groupUsers: this.nextGroup.groupUsers,
                groupCourses: this.nextGroup.groupCourses,
                groupCourseActivities: this.nextGroup.groupCourseActivities,
                currentView: "groupView",
                overlayActive: false
            });
        }
    }

    groupStatesHaveAllUpdated() {
        const groupFields = [
            "groupInfo",
            "groupUsers",
            "groupCourses",
            "groupCourseActivities"
        ];

        for (let i = 0; i < groupFields.length; ++i) {
            const groupField = groupFields[i];
            if (JSON.stringify(this.nextGroup[groupField]) === JSON.stringify(this.state[groupField])) {
                return false;
            }
        }

        return true;
    }

    setGroup(groupId) {
        if (this.sameGroupId(groupId)) {
            return;
        }
        this.setState({
            overlayActive: true
        });
        this.setGroupState(groupId, WPAPI.groupsEndpoint, "groupInfo");
        this.setGroupState(groupId, WPAPI.usersEndpoint, "groupUsers");
        this.setGroupState(groupId, WPAPI.coursesEndpoint, "groupCourses");
        this.setGroupState(groupId, WPAPI.courseActivitiesEndpoint, "groupCourseActivities");
    }

    sameGroupId(groupId) {
        return (this.state.groupInfo.result && this.state.groupInfo.result[0].id === groupId);
    }

    setGroupState(groupId, endpoint, stateKey) {
        /*
            call the API using the given endpoint to get info about the group
            params:
                groupId         -> (int) group id
                endpoint        -> (str) api url to get
                stateKey        -> (str) which state property to modify
            return:
                undefined
        */
        const apiCaller = new ApiCaller();

        apiCaller.getApiResult(groupId, endpoint)
        .then((jsonData) => {
            this.nextGroup[stateKey] = jsonData;
            this.updateGroupState();
            console.log("setGroupState" + stateKey + " successful", this.nextGroup[stateKey]);
        })
        .catch((err) => {
            const msg = "setGroupState " + endpoint + " failed";
            console.log(msg, err);
        });
    }

    getUserCount() {
        if (Object.keys(this.state.groupUsers).length === 0) {
            return {};
        }
        return {label: "Total Users", value: this.state.groupUsers.count};
    }

    getCourseCompletionCount() {
        if (Object.keys(this.state.groupCourseActivities).length === 0) {
            return {};
        }

        let value = 0;
        for (let i in this.state.groupCourseActivities.result) {
            const activity = this.state.groupCourseActivities.result[i];
            if (activity["status"] === 1) {
                ++value;
            }
        }

        return {label: "Total Course Completions", value: value};
    }
}
export default Dashboard;
