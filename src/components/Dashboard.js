import React from "react";

import AssignmentIcon from '@material-ui/icons/Assignment';
import StarIcon from '@material-ui/icons/Star';
import PostAddIcon from '@material-ui/icons/PostAdd';

import {AUTH_TOKEN} from "../helper";
import WPAPI from "../service/wpClient";
import ApiCaller from "../items/ApiCaller";
import ApiProcessor from "../items/ApiProcessor";
import TableDataProcessor from "../items/TableDataProcessor";
import FrontEnd from "./FrontEnd";

/*
 *  Main class component for the application. All calculations will be done here
 *  either directly coded in here or from a different module.
 *  The render function will pass the needed results as props for the front end
 *  to display.
 *  Process function call order for group change:
 *      1. setApi
 *          a. isSameApi
 *      2. setApiState (called 4 times)
 *      3. updateApiState
 *          a. apiStatesHaveAllUpdated
 *          b. ApiProcessor.getSubGroupUsersAndCourses
 *          c. ApiProcessor.parseCourseActivities
 *      4. BRANCH: Also get the vro/vrhpo required courses?
 *          TRUE. setCoursesByTag
 *      5. setTableData
 *      6. setNewState
 */

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
        this.role = this.getUserRole();

        // initialize the main data that will be passed to the render
        this.menus = {
            dashboard: {
                icon: <AssignmentIcon/>, // icon to display
                text: "Dashboard"        // label to display
            },
            update: {
                icon: <PostAddIcon/>,
                text: "Group Batch"
            }
        };

        // add additional menus only if the user is an admin
        if (this.role === "administrator") {
            this.menus["vro"] = {
                icon: <StarIcon/>,
                text: "VRO"
            };
            this.menus["vrhpo"] = {
                icon: <StarIcon/>,
                text: "VRHPO"
            }
        }

        // needed to copy the this.menu data because some libraries
        // modifies the props given to them
        this.deepCopy = require("deepcopy");

        // used to get all the results of the api calls first before setting state
        // done so only one state update is needed rather than 4 async ones
        this.nextApi = {
            apiInfo: {},
            apiUsers: {},
            apiCourses: {},
            apiActivities: {}
        };

        this.vrhpoCourses = {}; // all the vrhpo required courses
        this.group = {};        // group data (users, courses, completions)
        this.subgroups = {};    // all subgroups data separated by subgroupId

        this.state = {
            // front end view
            view: "dashboard",
            mobileDrawerOpen: false,

            // api call results
            apiInfo: [],
            apiUsers: [],
            apiCourses: [],
            apiActivities: [],

            groupId: this.user["group"][0]["id"], // current group id to display
            subgroupId: 0                         // current subgroup id to display
        };

    }

    componentDidMount() {
        this.setApi(this.user["group"][0]["id"], true);
    }

    // event handlers
    handleMobileDrawerToggle() {
        /*
            On smaller screen sizes, toggle the sidebar opened or closed.
            Event triggers when the menu button on the top bar is clicked
            Params:
                none
            Return:
                undefined
        */
        this.setState({
            mobileDrawerOpen: !this.state["mobileDrawerOpen"]
        });
    }

    handleUserLogOut() {
        /*
            Log the user out and return them to the login page.
            Event fires when the "LOG OUT" text is clicked
            Params:
                none
            Return:
                undefined
        */
        localStorage.removeItem(AUTH_TOKEN);
        this.props["history"].push("/");
    }

    handleViewChange(newView) {
        /*
            Change the current display of the Application.
            Event fires when any of the tabs on the sidebar is clicked
            Params:
                newView         -> (string) the new page to display
            Return:
                undefined
        */
        if (this.state["view"] === newView) {
            return;
        }

        this.setState({
            view: newView,
            mobileDrawerOpen: false
        });
    }

    handleGroupChange(groupId) {
        /*
            Update all the data to reflect the new group's data users,
            courses, course completions.
            Event fired when a new group is selected from the dropdown
        */
        if (groupId !== this.state["groupId"]) {
            this.setApi(groupId, false);
        }
    }

    render() {
        /*
            Use the FrontEnd component to display the current page and pass
            all the necessary event handlers to the component
        */
        return (
            <div>
                <FrontEnd
                    menus={this.deepCopy(this.menus)}
                    view={this.state["view"]}
                    openDrawer={this.state["mobileDrawerOpen"]}
                    mobileDrawerHandler={this.handleMobileDrawerToggle.bind(this)}
                    logOutHandler={this.handleUserLogOut.bind(this)}
                    viewChangeHandler={this.handleViewChange.bind(this)}
                    groupChangeHandler={this.handleGroupChange.bind(this)}
                    groupId={this.state["groupId"]}
                />
            </div>
        );
    }

    // Utility methods
    getUserRole() {
        /*
            Get the highest priority role of the user to determine
            which type of user view should be used
            Params:
                none
            Return:
                undefined
        */
        const roles = this.user["user_role"];
        if (roles.includes("administrator")) {
            return "administrator";
        }
        if (roles.includes("group_leader")) {
            return "groupLeader";
        }
        if (roles.includes("subgroup_leader")) {
            return "subgroupLeader";
        }
    }

    setApi(id, doCourseTag) {
        /*
            Call the api from the server to get all the group's users,
            courses, and course completions. If we also need to get the
            vro/vrhpo courses, do that too.
            Params:
                id            -> (int) the id of the group to api fetch
                doCourseTag   -> (bool) whether to also do an api call
                                        to get certain courses by tag
            Return:
                undefined
        */
        if (this.isSameApi(id)) {
            return;
        }

        this.setApiState(id, WPAPI.groupsEndpoint, "apiInfo", doCourseTag);
        this.setApiState(id, WPAPI.usersEndpoint, "apiUsers", doCourseTag);
        this.setApiState(id, WPAPI.coursesEndpoint, "apiCourses", doCourseTag);
        this.setApiState(id, WPAPI.courseActivitiesEndpoint, "apiActivities", doCourseTag);
    }

    isSameApi(id) {
        /*
            Return whether or not id given is already the current group's id
            that is currently displayed. Stops the api calls from happening
            if the id selected is already being displayed.
            Params:
                id      -> (int) the group id that was selected
            Return:
                bool    -> whether the selected group id is already being displayed
                           or not
        */
        return this.state["apiInfo"]["result"] && (this.state["apiInfo"]["result"][0]["id"] === id)
    }

    setApiState(id, endpoint, stateKey, doCourseTag) {
        /*
            Make an api call to the server with the following args and endpoints.
            If successful, then only do an update if all the other api calls are
            completed.
            It uses this.nextApi as a buffer (i.e. temp storage) which will be
            used to check if all the api calls are finished. The entire update
            process will continue only if all the api calls are done.
            Params:
                id              -> (int) id to be used to fetch api by query arg
                endpoint        -> (string) api url to use
                stateKey        -> (string) the key to update in the this.nextApi property
                doCourseTag     -> (bool) whether to also do an api call
                                          to get certain courses by tag
            Return:
                undefined
        */
        const apiCaller = new ApiCaller();

        let queryArg = "groupid";
        if (this.role === "subGroupLeader") {
            queryArg = "subgroupid";
        }

        apiCaller.getApiResult(id, queryArg, endpoint)
        .then((jsonData) => {
            this.nextApi[stateKey] = jsonData["result"];
            this.updateApiState(doCourseTag, id);
            console.log("setApiState " + stateKey + " successful");
        })
        .catch((err) => {
            console.log("setApiState " + endpoint + " failed", err);
        });
    }

    apiStatesHaveAllUpdated() {
        /*
            Check if all the api calls have finished.
            Params:
                none
            Return:
                bool        -> whether all the api calls have finished
        */
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

    updateApiState(doCourseTag, groupId) {
        /*
            If all the api calls are done, then do the following:
                - set the users, courses, activities for the group and the
                  subgroup(s) if available
                - if we also need courses filtered by course tag (for vro/vrhpo)
                  then do one additional api call for that
                - In any case set the table data that will be used for the table
                  that will be shown for each page
                - finally set the new state
            Params:
                doCourseTag     -> (bool) whether to also get courses filtered
                                          by course tag
                id              -> (int) the group id that will eventually be
                                         displayed
            Return:
                undefined
        */
        if (this.apiStatesHaveAllUpdated()) {
            let doSubgroups = false;
            this.subgroups = {};
            if (this.role !== "subgroupLeader") {
                this.subgroups = ApiProcessor.getSubGroupUsersAndCourses(this.nextApi);
                doSubgroups = true;
            }
            this.group = {
                users: this.nextApi["apiUsers"],
                courses: this.nextApi["apiCourses"],
                activities: {}
            }

            ApiProcessor.parseCourseActivities(this.nextApi, doSubgroups, this.group, this.subgroups);

            if (doCourseTag) {
                this.setCoursesByTag(7659, WPAPI.coursesEndpoint, groupId);
            }
            else {
                this.setTableData();
                this.setNewState(groupId);
            }
        }
    }

    setCoursesByTag(id, endpoint, groupId) {
        /*
            Make an api call to get all the filtered courses by tag.
            This is mainly used to fetch vro/vrhpo courses
            Params:
                id          -> (int) the tag id to filter by
                endpoint    -> (string) the api url to use
                groupId     -> (int) the group id that will be used to later
                                     set the new state. Only used here to pass to
                                     a function
            Return:
                undefined
        */
        const apiCaller = new ApiCaller();
        const queryArg = "tagid";

        apiCaller.getApiResult(id, queryArg, endpoint)
        .then((jsonData) => {
            this.vrhpoCourses = jsonData["result"];
            this.setTableData();
            this.setNewState(groupId);
        })
        .catch((err) => {
            console.log("setCoursesByTag " + endpoint + " failed", err);
        });
    }

    setTableData() {
        /*
            1. set all the table headers for each menu
            2. set all the table data (rows) for each menu
            Params:
                none
            Return:
                undefined
        */

        // set all the table headers and place them in this.menus respective key
        // handle each headers using switch cases to determine which function to
        // use to get the proper headers
        for (let menu in this.menus) {
            let headers = {};
            switch(menu) {
                case "dashboard":
                    headers = TableDataProcessor.getDashboardHeaders(this.group, this.subgroups);
                    break;
                default:
            }

            // only run if the result of getting the headers is not empty
            // give the results to this.menu["certain menu page"][headers] under group
            // and subgroups key.
            if (Object.entries(headers).length !== 0 && headers.constructor === Object) {
                this.menus[menu]["group"] = {
                    headers: headers["group"],
                    data: []
                };
                this.menus[menu]["subgroups"] = {};
                for (let subgroupId in this.subgroups) {

                    this.menus[menu]["subgroups"][subgroupId] = {
                        headers: headers["subgroups"][subgroupId],
                        data: []
                    };
                }
            }
        }

        // then do the same with each menu's table data (rows)
        for (let userId in this.group["users"]) {
            for (let menu in this.menus) {
                switch(menu) {
                    case "dashboard":
                        const tableData = TableDataProcessor.getDashboardData(userId, this.group, this.subgroups);
                        this.menus[menu]["group"]["data"].push(tableData["group"]);

                        // now add to the subgroup data for the respective menu page
                        for (let subgroupId in this.menus[menu]["subgroups"]) {
                            // only add to subgroups obj if the value is not empty
                            if (Object.entries(tableData["subgroups"][subgroupId]).length !== 0 && tableData["subgroups"][subgroupId].constructor === Object) {
                                this.menus[menu]["subgroups"][subgroupId]["data"].push(tableData["subgroups"][subgroupId]);
                            }
                        }
                        break;
                    default:
                }
            }
        }
    }

    setNewState(id) {
        /*
            update the new state using the id given for the groupId state
            Params:
                id          -> (int) the group id that is currently being displayed
            Return:
                undefined
        */
        this.setState({
            apiInfo: this.nextApi["apiInfo"],
            apiUsers: this.nextApi["apiUsers"],
            apiCourses: this.nextApi["apiCourses"],
            apiActivities: this.nextApi["apiActivities"],

            groupId: id,
            subgroupId: 0
        });
    }

}
export default Dashboard;
