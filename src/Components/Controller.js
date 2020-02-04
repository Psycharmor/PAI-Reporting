import React from "react";

import {MdAssignment, MdFileUpload, MdPoll, MdComment} from "react-icons/md";

import Sidebar from "./Modules/Main/Sidebar";
import Topbar from "./Modules/Main/Topbar";
import Content from "./Modules/Content/Content";

/*
    The controller acts as the master of all the views/windows. It only knows
    2 things:
        1. Rendering the topbar and the sidebar
        2. The events/properties related to them
*/
class Controller extends React.Component {
    constructor(props) {
        super(props);

        // initialize menus meant for everyone
        this.menus = {
            teamReport: {
                icon: <MdAssignment/>,     // icon to display
                text: "Team Report",       // label to display
                class: "team-report-icon"  // style for the icon
            },
            // upload: {
            //     icon: <MdFileUpload/>,
            //     text: "Group Batch",
            //     class: "upload-icon"
            // }
        };

        // add additional menus only for certain roles
        if (this.getUserRole() === "administrator") {
            // this.menus["survey"] = {
            //     icon: <MdPoll/>,
            //     text: "Survey Results",
            //     class: "survey-icon"
            // };
            this.menus["comments"] = {
                icon: <MdComment/>,
                text: "Comments",
                class: "comment-icon"
            };
        }

        this.state = {
            view: "teamReport",
            sidebarOpen: false
        };

        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleUserLogout = this.handleUserLogout.bind(this);
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
    }

    // Event Handler Methods

    /*
        Set the currently displayed view to the new view
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleViewChange(event) {
        const newView = event.currentTarget.getAttribute("value");
        this.setState({
            view: newView,
            sidebarOpen: false
        });
    }

    /*
        Log user out and return them to the login page
        Params:
            none
        Return:
            undefined
    */
    handleUserLogout() {
        localStorage.removeItem("USER");
        this.props["history"].push("/");
    }

    /*
        Toggle the sidebar open or closed on responsive view
        Params:
            none
        Return:
            undefined
    */
    handleSidebarToggle() {
        this.setState({
            sidebarOpen: !this.state["sidebarOpen"]
        });
    }

    // Utility Methods

    /*
        Get the highest priority role of the user to determine which type of
        user view should be used.
        Params:
            none
        Return:
            undefined
    */
    getUserRole() {
        const user = JSON.parse(localStorage.getItem("USER"));
        const roles = user["user_role"];
        if (roles.includes("administrator")) {
            return "administrator";
        }
        if (roles.includes("group_leader")) {
            return "group_leader";
        }
    }

    render() {
        return (
            <>
                <Sidebar
                    menus={this.menus}
                    responsiveOpen={this.state["sidebarOpen"]}
                    view={this.state["view"]}
                    viewChangeHandler={this.handleViewChange}
                    sidebarToggleHandler={this.handleSidebarToggle}
                />
                <div className={"main-content"}>
                    <Topbar
                        userLogoutHandler={this.handleUserLogout}
                        sidebarToggleHandler={this.handleSidebarToggle}
                    />
                    <Content view={this.state["view"]} menus={this.menus}/>
                </div>
            </>
        );
    }
}
export default Controller;
