import React from "react";

import {Select, MenuItem, Button, Container} from "@material-ui/core";
import LoadingOverlay from "react-loading-overlay";

import {AUTH_TOKEN, getUserSnippet} from "../helper";
import ApiCaller from "../items/ApiCaller";
import WPAPI from "../service/wpClient";
import Table from "./table/Table";
import Summary from "./summary/Summary";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
        this.state = {
            groupInfo: {},
            groupUsers: {},
            groupCourses: {},
            groupCourseActivities: {},
            currentWindow: "groupSummary",
            courseWindow: {},
            userWindow: {},
            overlayActive: false
        };

        this.nextGroup = {
            groupInfo: {},
            groupUsers: {},
            groupCourses: {},
            groupCourseActivities: {}
        }
    }

    componentDidMount() {
        /*
            initialize the dashboard to a default group,
            will be the first group listed by the user but
            for now hardcoded
            params:
                none
            return:
                undefined
        */
        this.setGroup(this.user.group[0].id);
    }

    handleGroupClick() {
        this.setState({
            currentWindow: "groupSummary"
        });
    }

    handleCourseClick(course) {
        /*
            Whenever a course row gets clicked, go to the course summary window
            params:
                courseId        -> (int) course id
            return:
                undefined
        */

        this.setState({
            currentWindow: "courseSummary",
            courseWindow: course
        });
    }

    handleUserClick(user) {
        /*
            Whenever a user row gets clicked, go to the user summary window
            params:
                userId        -> (int) user id
            return:
                undefined
        */
        this.setState({
            currentWindow: "userSummary",
            userWindow: user
        });
    }

    setGroup(groupId) {
        this.setState({
            overlayActive: true
        });
        this.setGroupState(groupId, WPAPI.groupsEndpoint, "groupInfo");
        this.setGroupState(groupId, WPAPI.usersEndpoint, "groupUsers");
        this.setGroupState(groupId, WPAPI.coursesEndpoint, "groupCourses");
        this.setGroupState(groupId, WPAPI.courseActivitiesEndpoint, "groupCourseActivities");
    }

    render() {
        if (Object.keys(this.state.groupInfo).length === 0) {
            return <div></div>;
        }

        const options = this.user.group.map((item, key) => {
            return <MenuItem key={key} value={item.id}>{item.name}</MenuItem>;
        });

        return(
            <Container>
                <div className="Dashboard-container">
                    <div className="user-snippet">
                        <h1>{getUserSnippet(this.user.user_display_name)}</h1>
                    </div>
                    <h2>{this.user.user_display_name}</h2>
                    <Button variant="contained" color="primary" onClick={() => {
                        localStorage.removeItem(AUTH_TOKEN);
                        this.props.history.push("/");
                    }}
                    >Log Out</Button>
                </div>
                <div>
                    <h2 onClick={(e) => this.handleGroupClick(e)}>{(this.state.groupInfo.result ? this.state.groupInfo.result[0].title : "")}</h2>
                    <Select
                        value={(this.state.groupInfo.result ? this.state.groupInfo.result[0].id : this.user.group[0].id)}
                        onChange={(e) => this.setGroup(e.target.value)}
                        >
                        {options}
                    </Select>
                </div>
                <LoadingOverlay
                    active={this.state.overlayActive}
                    spinner
                >
                <Summary dashboardState={this.state} />
                <Table
                    dashboardState={this.state}
                    handleCourseClick={(e) => this.handleCourseClick(e)}
                    handleUserClick={(e) => this.handleUserClick(e)}
                />
                </LoadingOverlay>
            </Container>
        );
    }

    updateGroupState() {
        if (this.groupStatesHaveAllUpdated()) {
            this.setState({
                groupInfo: this.nextGroup.groupInfo,
                groupUsers: this.nextGroup.groupUsers,
                groupCourses: this.nextGroup.groupCourses,
                groupCourseActivities: this.nextGroup.groupCourseActivities,
                currentWindow: "groupSummary",
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
}
export default Dashboard;
