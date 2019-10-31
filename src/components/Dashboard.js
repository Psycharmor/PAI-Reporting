import React from "react";
import { forwardRef } from 'react';

// all this just for a dumb table...
import {AddBox, ArrowUpward, Check, ChevronLeft, ChevronRight,
        Clear, DeleteOutline, Edit, FilterList, FirstPage,
        LastPage, Remove, SaveAlt, Search, ViewColumn
        } from "@material-ui/icons";

import MaterialTable from "material-table";
import "react-table/react-table.css";
import {Grid, Paper, Typography, Container, Select, MenuItem, Button} from "@material-ui/core";

import {AUTH_TOKEN} from "../helper";
import WPAPI from "../service/wpClient";
import ApiCaller from "../items/ApiCaller";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
        this.role = this.getUserRole();
        this.nextApi = {
            apiInfo: [],
            apiUsers: [],
            apiCourses: [],
            apiActivities: []
        };

        this.group = {
            users: [],
            courses: [],
            activities: []
        };

        this.subgroups = {};

        this.state = {
            apiInfo: [],
            apiUsers: [],
            apiCourses: [],
            apiActivities: [],

            viewHeaders: [],
            viewRows: [],
            groupId: this.user["group"][0]["id"],
            subGroupId: 0
        };
    }

    componentDidMount() {
        this.setApi(this.user["group"][0]["id"]);
        // this.setApi(353011); // TESTING PURPOSES
    }

    handleGroupChange(e) {
        this.setApi(e.target["value"]);
    }

    handleSubGroupChange(e) {
        if (e.target["value"] === 0) {
            const tableData = this.setDataAndHeaders(0);
            this.setState({
                subGroupId: 0,
                viewHeaders: tableData["headers"],
                viewRows: tableData["data"]
            });
        }
        else {
            const tableData = this.setDataAndHeaders(e.target["value"]);
            this.setState({
                subGroupId: e.target["value"],
                viewHeaders: tableData["headers"],
                viewRows: tableData["data"]
            });
        }
    }

    handleLogOut() {
        localStorage.removeItem(AUTH_TOKEN);
        this.props["history"].push("/");
    }

    render() {
        const table = this.renderTable();
        const dropDown = this.user["group"].map((group, key) => {
            return (
                <MenuItem key={key} value={group["id"]}>{group["name"]}</MenuItem>
            );
        });
        const subGroups = this.renderSubGroupDropdown();
        const totalUsersBox = this.renderBox("users");
        const totalCourseCompletionsBox = this.renderBox("courseCompletions");

        return (
            <Container className="window-class">
                <Container className="container-margin">
                    <Grid container justify="flex-start" alignItems="center" spacing={2}>
                        <Grid item className="select-grid-container" xs={12} md={3}>
                            <Select autoWidth={true} className="select-box" value={this.state["groupId"]} onChange={(e) => this.handleGroupChange(e)}>
                                {dropDown}
                            </Select>
                        </Grid>
                        <Grid item className="select-grid-container" xs={12} md={3}>
                            {subGroups}
                        </Grid>
                        <Grid item className="select-grid-container" xs={12} md={3}>
                        </Grid>
                        <Grid item className="select-grid-container" xs={12} md={3}>
                            <Button variant="outlined" onClick={(e) => this.handleLogOut(e)}>Log Out</Button>
                        </Grid>
                    </Grid>
                </Container>
                <Container className="container-margin">
                    <Grid container justify="flex-start" alignItems="center" spacing={2}>
                        <Grid item xs={12} md={3}>
                            {totalUsersBox}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            {totalCourseCompletionsBox}
                        </Grid>
                    </Grid>
                </Container>
                {table}
            </Container>
        );
    }

    // RENDER FUNCTIONS
    renderBox(box) {
        let title = "";
        let data = 0;

        if (box === "users") {
            title = "Total Users";
            data = this.state["viewRows"].length;
        }
        else if (box === "courseCompletions") {
            title = "Total Course Completions";
            for (let i = 0; i < this.state["viewRows"].length; ++i) {
                for (let courseId in this.state["viewRows"][i]) {
                    const progress = this.state["viewRows"][i][courseId];
                    if( progress >= 100 ) {
                        ++data;
                    }
                }
            }
        }

        return (
            <Paper className="box-container">
                <Typography variant="h5" align="center">
                    {title}
                </Typography>
                <Typography variant="h5" align="center">
                    {data}
                </Typography>
            </Paper>
        );
    }

    renderTable() {
        if (this.state["viewRows"].length === 0) {
            return;
        }

        const tableIcons = {
            Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
            Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
            Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
          };

        return (
            <Container className="container-margin">
                <MaterialTable
                    title="Course Completions"
                    icons={tableIcons}
                    data={this.state["viewRows"]}
                    columns={this.state["viewHeaders"]}
                    options={{
                      sorting: true,
                      pageSize: 10,
                      showTitle: false,
                      headerStyle: {
                          padding: "5px 0 5px 5px",
                          backgroundColor: "#4168B1",
                          color: "#FFFFFF"
                      }
                    }}
                />
            </Container>
        );
    }items

    renderSubGroupDropdown() {
        const groupInfo = this.nextApi["apiInfo"][Object.keys(this.nextApi["apiInfo"])[0]];
        if (!groupInfo) {
            return;
        }
        if (!groupInfo["subGroups"] || Object.keys(groupInfo["subGroups"]).length === 0) {
            return;
        }

        let subGroups = [];
        for (let key in groupInfo["subGroups"]) {
            subGroups.push(
                <MenuItem key={key} value={parseInt(key)}>{groupInfo["subGroups"][key]["title"]}</MenuItem>
            );
        }

        return (
            <Select className="select-box" value={this.state["subGroupId"]} onChange={(e) => this.handleSubGroupChange(e)}>
                <MenuItem key={0} value={0}>Filter by SubGroup</MenuItem>
                {subGroups}
            </Select>
        );
    }


    // UTILITY FUNCTIONS
    getUserRole() {
        /*
            Get main user role to be used for the app. Certain permissions
            are given depending on the user role.
            Priority: administrator -> group_leader -> subgroup_leader
            Params:
                none
            Return:
                string          -> user role to be used
        */

        const roles = this.user.user_role;
        if (roles.includes("administrator")) {
            return "administrator";
        }
        if (roles.includes("group_leader")) {
            return "groupLeader";
        }
        if (roles.includes("subgroup_leader")) {
            return "subGroupLeader";
        }
    }

    setApi(id) {
        if (this.sameApiId(id)) {
            return;
        }

        this.setApiState(id, WPAPI.groupsEndpoint, "apiInfo");
        this.setApiState(id, WPAPI.usersEndpoint, "apiUsers");
        this.setApiState(id, WPAPI.coursesEndpoint, "apiCourses");
        this.setApiState(id, WPAPI.courseActivitiesEndpoint, "apiActivities");
    }

    sameApiId(id) {
        return this.state["apiInfo"]["result"] && this.state["apiInfo"]["result"][0]["id"] === id;
    }

    setApiState(id, endpoint, stateKey) {
        const apiCaller = new ApiCaller();

        let queryArg = "groupid";
        if (this.role === "subGroupLeader") {
            queryArg = "subgroupid";
        }

        apiCaller.getApiResult(id, queryArg, endpoint)
        .then((jsonData) => {
            this.nextApi[stateKey] = jsonData["result"];
            this.updateApiState();
            console.log("setApiState " + stateKey + " successful");
        })
        .catch((err) => {
            console.log("setApiState " + endpoint + " failed", err);
        });
    }

    setDataAndHeaders(subgroup) {
        let group = this.group;
        if (subgroup !== 0) {
            group = this.subgroups[subgroup];
        }

        let headers = [{
            title: "Username",
            field: "username",
            cellStyle: {
                padding: "5px 0 5px 5px"
            }
        }];
        for (let key in group["courses"]) {
            headers.push({
                title: group["courses"][key]["title"],
                field: group["courses"][key]["id"].toString(),
                cellStyle: {
                    padding: "5px 0 5px 5px"
                }
            });
        }

        let data = [];
        for (let key in group["users"]) {
            let userData = { username: group["users"][key]["username"] };
            for (let courseId in group["courses"]) {
                let progress = 0;
                const activityKey = key + "_" + courseId;
                if (activityKey in group["activities"]) {
                    const stepsCompleted = group["activities"][activityKey]["stepsCompleted"];
                    const stepsTotal = group["activities"][activityKey]["stepsTotal"];
                    progress = +(stepsCompleted / stepsTotal * 100).toFixed(2);
                }

                userData[group["courses"][courseId]["id"].toString()] = progress;
            }
            data.push(userData);
        }

        return {
            data: data,
            headers: headers
        }
    }

    updateApiState() {
        if (this.apiStatesHaveAllUpdated()) {
            this.updateData();

            const view = this.setDataAndHeaders(0);

            // update state api/view
            this.setState({
                apiInfo: this.nextApi["apiInfo"],
                apiUsers: this.nextApi["apiUsers"],
                apiCourses: this.nextApi["apiCourses"],
                apiActivities: this.nextApi["apiActivities"],

                viewHeaders: view["headers"],
                viewRows: view["data"],
                groupId: this.nextApi["apiInfo"][Object.keys(this.nextApi["apiInfo"])[0]]["id"]
            });
        }
    }

    apiStatesHaveAllUpdated() {
        const deepEqual = require("deep-equal");
        const fields = [
            "apiInfo",
            "apiUsers",
            "apiCourses",
            "apiActivities"
        ];

        for (let i = 0; i < fields.length; ++i) {
            if (deepEqual(this.nextApi[fields[i]], this.state[fields[i]], {strict: true})) {
                return false;
            }
        }

        return true;
    }

    updateData() {

        this.group = {
            users: [],
            courses: [],
            activities: []
        };
        this.subgroups = {};

        if (this.role === "subGroupLeader") {
            this.group = {
                users: this.nextApi["apiUsers"],
                courses: this.nextApi["apiCourses"],
                activities: []
            };
            for (let key in this.nextApi["apiActivities"]) {
                const activity = this.nextApi["apiActivities"][key];
                if (activity["userId"] in this.group["users"] && activity["courseId"] in this.group["courses"]) {
                    this.group["activities"][activity["userId"] + "_" + activity["courseId"]] = activity;
                }
            }

            return;
        }

        const groupInfo = this.nextApi["apiInfo"][Object.keys(this.nextApi["apiInfo"])[0]];

        // set most of subgroups' properties
        for (let key in groupInfo["subGroups"]) {
            let users = {};
            for (let i = 0; i < groupInfo["subGroups"][key]["enrolledUsers"].length; ++i) {
                const userId = groupInfo["subGroups"][key]["enrolledUsers"][i];
                users[userId] = this.nextApi["apiUsers"][userId];
            }

            let courses = {};
            for (let i = 0; i < groupInfo["subGroups"][key]["courses"].length; ++i) {
                const courseId = groupInfo["subGroups"][key]["courses"][i];
                courses[courseId] = this.nextApi["apiCourses"][courseId];
            }

            this.subgroups[key] = {
                users: users,
                courses: courses,
                activities: {}
            };
        }

        // set most of group's properties
        let users = {};
        for (let i = 0; i < groupInfo["enrolledUsers"].length; ++i) {
            const userId = groupInfo["enrolledUsers"][i];
            users[userId] = this.nextApi["apiUsers"][userId];
        }

        let courses = {};
        for (let i = 0; i < groupInfo["courses"].length; ++i) {
            const courseId = groupInfo["courses"][i];
            courses[courseId] = this.nextApi["apiCourses"][courseId];
        }

        this.group = {
            users: users,
            courses: courses,
            activities: {}
        };

        // now loop through the activities and place them to the respective
        // group or subgroup(s)
        for (let key in this.nextApi["apiActivities"]) {
            const activity = this.nextApi["apiActivities"][key];
            if (activity["userId"] in this.group["users"] && activity["courseId"] in this.group["courses"]) {
                this.group["activities"][activity["userId"] + "_" + activity["courseId"]] = activity;
            }

            for (let subGroupId in this.subgroups) {
                if (activity["userId"] in this.subgroups[subGroupId]["users"] && activity["courseId"] in this.subgroups[subGroupId]["courses"]) {
                    this.subgroups[subGroupId]["activities"][activity["userId"] + "_" + activity["courseId"]] = activity;
                }
            }
        }
    }
}
export default Dashboard;
