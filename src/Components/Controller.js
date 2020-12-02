import React from "react";
import axios from "axios";


import {MdAssignment, MdPoll, MdComment} from "react-icons/md";
import {FaFileUpload} from "react-icons/fa";
import moment from "moment";
import {openDB, deleteDB} from "idb";

import Login from "./Modules/Login/Login";
import LoadingOverlay from "./LoadingOverlay";
import Sidebar from "./Navigation/Sidebar";
import Topbar from "./Navigation/Topbar";
import Content from "./Modules/Content";
import DbLib from "../Lib/DbLib.js";

export default class Controller extends React.Component {
    constructor(props) {
        super(props);

        this.api = {
            url: "http://staging.psycharmor.org/",
            token: ""
        };

        this.menus = {
            teamReport: {
                icon: <MdAssignment/>,
                text: "Team Report",
                class: "team-report-icon"
            }
        };

        this.databaseName = "reportDatabase";

        this.state = {
            view: "teamReport",
            sidebarOpen: false,
            loading: false,
            dataLoaded: false,
            groups: {},
            users: {},
            courses: {},
            portfolios: {},
            activities: {},
            surveys: {},
            comments: {}
        };

        this.handleUserLogin = this.handleUserLogin.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
        this.handleUserLogout = this.handleUserLogout.bind(this);
        this.handleCommentAction = this.handleCommentAction.bind(this);

    }

    componentDidMount() {
        if (sessionStorage.getItem("USER")) {
            const user = JSON.parse(sessionStorage.getItem("USER"));
            this.api["token"] = user["token"];
            if (this.getUserRole() === "administrator") {
                this.menus["surveyResults"] = {
                    icon: <MdPoll/>,
                    text: "Survey Results",
                    class: "survey-icon"
                };
                // this.menus["comments"] = {
                //     icon: <MdComment/>,
                //     text: "Comments",
                //     class: "comment-icon"
                // };
                this.menus["groupUpload"] = {
                    icon: <FaFileUpload/>,
                    text: "Upload",
                    class: "upload-icon"
                };
            }
            this.initializeDatabase();
        }
    }

    handleUserLogin(token) {
        this.api["token"] = token;
        if (this.getUserRole() === "administrator") {
            this.menus["surveyResults"] = {
                icon: <MdPoll/>,
                text: "Survey Results",
                class: "survey-icon"
            };
            this.menus["groupUpload"] = {
                icon: <FaFileUpload/>,
                text: "Upload",
                class: "upload-icon"
            };
        }
        this.initializeDatabase();
    }

    handleViewChange(event) {
        this.setState({
            view: event.currentTarget.getAttribute("value"),
            sidebarOpen: false
        });
    }

    handleSidebarToggle(event) {
        this.setState({
            sidebarOpen: !this.state["sidebarOpen"]
        });
    }

    handleUserLogout() {
        sessionStorage.removeItem("USER");
        this.setState({
            view: "teamReport",
            sidebarOpen: false,
            loading: false,
            dataLoaded: false,
            groups: {},
            users: {},
            courses: {},
            portfolios: {},
            activities: {},
            surveys: {},
            comments: {},
            apiComments : []
        });
    }

    handleCommentAction(body) {
        const options = {
            headers: {
                Authorization: "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdGFnaW5nLnBzeWNoYXJtb3Iub3JnIiwiaWF0IjoxNTg1ODU5NTk0LCJuYmYiOjE1ODU4NTk1OTQsImV4cCI6MTU4NjQ2NDM5NCwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMTg1MTEifX19.tzO427GSJ4skJ-1xx5FkKQhj4PXloFITidyu69DgkwM"
            }
        };
        axios.post("https://psycharmor.org/wp-json/pai/v1/comments", body, options)
        .then((jsonData) => {
            if (jsonData["status"] === 200) {
                this.setState({
                    loading: true,
                    commentsDone: false
                });
                this.newApi["apiComments"] = [];
                this.doCommentsApiCalls(1000, 0);
            }
        })
        .catch((err) => {
            console.log("Promise Catch: Content.handleCommentAction", err);
        });
    }

    getUserRole() {
        const user = JSON.parse(sessionStorage.getItem("USER"));
        if (user) {
            const roles = user["user_role"];
            if (roles.includes("administrator")) {
                return "administrator";
            }
            if (roles.includes("group_leader")) {
                return "group_leader";
            }
        }

        return "";
    }

    async initializeDatabase() {
        this.setState({
            loading: true,
            dataLoaded: false,
            groups: {},
            users: {},
            courses: {},
            portfolios: {},
            activities: {},
            surveys: {},
            comments: {}
        });
        let exp = JSON.parse(localStorage.getItem("DBEXPIRATION"));
        exp = (exp) ? exp["exp"] : "";
        const dbLib = new DbLib(this.api);

        if (!exp || moment().isAfter(moment(exp))) {
            console.log("new day, delete database");
            await deleteDB(this.databaseName);
        }
        const db = await openDB(this.databaseName, 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                dbLib.initializeDb(db, oldVersion, newVersion, transaction);
            }
        });
        if (!exp || moment().isAfter(moment(exp))) {
            try {
                await dbLib.loadDb(db);
                const newExp = {
                    exp: moment().endOf("day")
                };
                localStorage.setItem("DBEXPIRATION", JSON.stringify(newExp));
            }
            catch (err) {
                sessionStorage.removeItem("USER");
                window.location.reload();
            }
        }
        this.initializeData(db, dbLib);
    }

    async initializeData(db, dbLib) {
        let [groups, users, courses, portfolios, activities, surveys, comments] = await Promise.all(
            [
                dbLib.fetchDbStore(db, "groups"),
                dbLib.fetchDbStore(db, "users"),
                dbLib.fetchDbStore(db, "courses"),
                dbLib.fetchDbStore(db, "portfolios"),
                dbLib.fetchDbStore(db, "activities"),
                dbLib.fetchDbStore(db, "surveys"),
                dbLib.fetchDbStore(db, "comments")
            ]
        );
        db.close();

        this.setState({
            loading: false,
            dataLoaded: true,
            groups: groups,
            users: users,
            courses: courses,
            portfolios: portfolios,
            activities: activities,
            surveys: surveys,
            comments : comments
        });
    }

    render() {
        if (sessionStorage.getItem("USER")) {
            console.log(this.state);
            return (
                <>
                {this.state["loading"] && <LoadingOverlay/>}
                <Sidebar
                    menus={this.menus}
                    view={this.state["view"]}
                    sidebarOpen={this.state["sidebarOpen"]}
                    viewChangeHandler={this.handleViewChange}
                    sidebarToggleHandler={this.handleSidebarToggle}
                />
                <div className={"main-content"}>
                    <Topbar
                        userLogoutHandler={this.handleUserLogout}
                        sidebarToggleHandler={this.handleSidebarToggle}
                    />
                    {this.state["dataLoaded"] &&
                    <Content
                        view={this.state["view"]}
                        groups={this.state["groups"]}
                        users={this.state["users"]}
                        courses={this.state["courses"]}
                        portfolios={this.state["portfolios"]}
                        activities={this.state["activities"]}
                        surveys={this.state["surveys"]}
                        comments={this.state["comments"]}
                        actionHandler={this.handleCommentAction}
                        url={this.api["url"]}
                    />}
                </div>
                </>
            );
        }
        else {
            return (
                <Login
                    loginHandler={this.handleUserLogin}
                    url={this.api["url"]}
                />
            );
        }
    }
}
