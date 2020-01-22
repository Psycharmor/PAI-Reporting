import React from "react";

import ApiHandler from "../../../Lib/ApiHandler";
import TeamReport from "./TeamReporting/TeamReport";
import Survey from "./Survey/Survey";

/*
    The Component will handle rendering the different views as well as handling
    the API calls used by them.
*/
class Content extends React.Component {
    constructor(props) {
        super(props);

        this.url = "http://staging.psycharmor.org/";

        this.newApi = {
            apiReportGroupInfo: {},
            apiReportGroupUsers: {},
            apiReportGroupCourses: {},
            apiReportGroupActivities: {},
            apiSurveyEntries: {}
        };

        this.reportEndpoint = this.getReportEndpoint();

        this.state = {
            loading: false,
            reportDone: true,
            surveyDone: true,
            apiReportGroupInfo: {},
            apiReportGroupUsers: {},
            apiReportGroupCourses: {},
            apiReportGroupActivities: {},
            apiSurveyEntries: {}
        };

        this.handleTeamChange = this.handleTeamChange.bind(this);
    }

    // Lifecycle Methods
    componentDidMount() {
        this.doGetApiCalls();
    }

    // Event Handlers Methods

    /*
        Set the team to be the newly selected team
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleTeamChange(event) {
        const teamId = event.target["value"];
        this.setState({
            loading: true,
            reportDone: false
        });

        Promise.all(this.doReportApiCalls(teamId)).then(() => {
            this.setState({
                reportDone: true
            });
            const loading = (this.state["surveyDone"] ? false : true);

            this.setState({
                loading: loading,
                apiReportGroupInfo: this.newApi["apiReportGroupInfo"][teamId],
                apiReportGroupUsers: this.newApi["apiReportGroupUsers"],
                apiReportGroupCourses: this.newApi["apiReportGroupCourses"],
                apiReportGroupActivities: this.newApi["apiReportGroupActivities"]
            });
        });
    }

    // Utility Methods

    /*
        Get the endpoint that will be used to fetch api. Either groupId (team)
        or subgroupId (group)
        Params:
            none
        Return:
            string/undefined -> the endpoint to use
    */
    getReportEndpoint() {
        const user = JSON.parse(localStorage.getItem("USER"));
        const roles = user["user_role"];
        if (roles.includes("administrator") || roles.includes("group_leader")) {
            return "groupid";
        }
        if (roles.includes("subgroup_leader")) {
            return "subgroupid";
        }
    }

    /*
        Run all the get API calls one menu at a time. This should only run once
        which is during the component mount.
        Params:
            none
        Return:
            undefined
    */
    doGetApiCalls() {
        this.setState({
            loading: true,
            reportDone: false,
            surveyDone: false
        });
        const user = JSON.parse(localStorage.getItem("USER"));
        Promise.all(this.doReportApiCalls(user["group"][0]["id"])).then(() => {
            this.setState({
                reportDone: true
            });
            const loading = (this.state["surveyDone"] ? false : true);
            const teamId = Object.keys(this.newApi["apiReportGroupInfo"])[0];

            this.setState({
                loading: loading,
                apiReportGroupInfo: this.newApi["apiReportGroupInfo"][teamId],
                apiReportGroupUsers: this.newApi["apiReportGroupUsers"],
                apiReportGroupCourses: this.newApi["apiReportGroupCourses"],
                apiReportGroupActivities: this.newApi["apiReportGroupActivities"]
            });
        });

        if ("survey" in this.props["menus"]) {
            this.doSurveyApiCalls(1000, 0);
        }
        else {
            this.setState({
                surveyDone: true
            });
        }
    }

    /*
        Run all the API calls related to team reporting
        Params:
            teamId -> (int) the team id to fetch
        Return:
            array -> all promises related to the api
    */
    doReportApiCalls(teamId) {
        const calls = [
            {
                url: this.url + "wp-json/pai/v1/groups/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupInfo"
            },
            {
                url: this.url + "wp-json/pai/v1/users/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupUsers"
            },
            {
                url: this.url + "wp-json/pai/v1/courses/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupCourses"
            },
            {
                url: this.url + "wp-json/pai/v1/course-activities/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupActivities"
            },
        ];

        const requestOptions = {
            method: "GET",
            mode: "cors"
        };

        let promises = [];

        for (let i = 0; i < calls.length; ++i) {
            const call = calls[i];
            promises.push(
                ApiHandler.doApiCall(new Request(call["url"], requestOptions))
                .then((jsonData) => {
                    this.newApi[call["state"]] = jsonData["result"];
                })
                .catch((err) => {
                    console.log("Promise Catch: Content.doReportApiCalls", err);
                })
            );
        }

        return promises;
    }

    /*
        Run all the API calls related to survey results
        Params:
            none
        Return:
            undefined
    */
    doSurveyApiCalls(limit, offset) {
        const url = this.url + "wp-json/pai/v1/survey?limit=" + limit + "&offset=" + offset;
        const requestOptions = {
            method: "GET",
            mode: "cors"
        };

        ApiHandler.doApiCall(new Request(url, requestOptions))
        .then((jsonData) => {
            this.setSurveyApiProperty(jsonData, limit, offset);
        })
        .catch((err) => {
            console.log("Promise Catch: Content.doSurveyApiCalls", err);
        });
    }

    setSurveyApiProperty(newEntries, limit, offset) {
        let count = 0;
        for (let portfolioId in newEntries) {
            if (!(portfolioId in this.newApi["apiSurveyEntries"])) {
                this.newApi["apiSurveyEntries"][portfolioId] = {
                    name: newEntries[portfolioId]["name"],
                    courses: {}
                };
            }
            for (let courseId in newEntries[portfolioId]["courses"]) {
                if (!(courseId in this.newApi["apiSurveyEntries"][portfolioId]["courses"])) {
                    this.newApi["apiSurveyEntries"][portfolioId]["courses"][courseId] = {
                        name: newEntries[portfolioId]["courses"][courseId]["name"],
                        entries: []
                    };
                }
                for (let i = 0; i < newEntries[portfolioId]["courses"][courseId]["entries"].length; ++i) {
                    const entry = newEntries[portfolioId]["courses"][courseId]["entries"][i];
                    this.newApi["apiSurveyEntries"][portfolioId]["courses"][courseId]["entries"].push(entry);
                    ++count;
                }
            }
        }

        if (count >= limit) {
            this.doSurveyApiCalls(limit, offset + count);
        }
        else {
            this.setState({
                surveyDone: true
            });
            const loading = (this.state["reportDone"] ? false : true);
            this.setState({
                loading: loading,
                apiSurveyEntries: this.newApi["apiSurveyEntries"]
            });
        }
    }

    getContent(view) {
        switch(view) {
            case "teamReport":
                return (
                    <TeamReport
                        groupInfo={this.state["apiReportGroupInfo"]}
                        users={this.state["apiReportGroupUsers"]}
                        courses={this.state["apiReportGroupCourses"]}
                        activities={this.state["apiReportGroupActivities"]}
                        loading={this.state["loading"]}
                        teamChangeHandler={this.handleTeamChange}
                    />
                );
            case "upload":
                return this.props["view"];
            case "survey":
                return (
                    <Survey
                        surveyEntries={this.state["apiSurveyEntries"]}
                        loading={this.state["loading"]}
                    />
                );
            default:
        }
    }

    render() {
        console.log(this.state);
        const content = this.getContent(this.props["view"]);

        return (
            <div className={"view-content"}>
                {content}
            </div>
        );
    }
}
export default Content;
