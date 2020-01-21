import React from "react";

import {MdAssignment, MdFileUpload, MdSpeakerNotes} from "react-icons/md";

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
            this.menus["survey"] = {
                icon: <MdSpeakerNotes/>,
                text: "Survey Results",
                class: "survey-icon"
            };
        }

        this.state = {
            view: "teamReport"
        };

        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleUserLogout = this.handleUserLogout.bind(this);
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
        const newView = event.target.getAttribute("value");
        this.setState({
            view: newView
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
            <div>
                <Sidebar
                    menus={this.menus}
                    view={this.state["view"]}
                    viewChangeHandler={this.handleViewChange}
                />
                <div className={"main-content"}>
                    <Topbar userLogoutHandler={this.handleUserLogout}/>
                    <Content view={this.state["view"]} menus={this.menus}/>
                </div>
            </div>
        );
    }
}
export default Controller;
