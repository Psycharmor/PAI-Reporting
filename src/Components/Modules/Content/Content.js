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
            groupInfoDone: true,
            groupUsersDone: true,
            groupCoursesDone: true,
            groupActivitiesDone: true,
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
            groupInfoDone: false,
            groupUsersDone: false,
            groupCoursesDone: false,
            groupActivitiesDone: false
        });

        this.doReportApiCalls(teamId, 3000, 0);
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
            groupInfoDone: false,
            groupUsersDone: false,
            groupCoursesDone: false,
            groupActivitiesDone: false,
            surveyDone: false
        });
        const user = JSON.parse(localStorage.getItem("USER"));
        this.doReportApiCalls(user["group"][0]["id"], 3000, 0);

        if ("survey" in this.props["menus"]) {
            this.doSurveyApiCalls(3000, 0, 0);
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
            limit  -> (int) the max number to get for certain endpoints
            offset -> (int) the number to start from
        Return:
            array -> all promises related to the api
    */
    doReportApiCalls(teamId, limit, offset) {
        const calls = [
            {
                url: this.url + "wp-json/pai/v1/groups/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupInfo",
                doneState: "groupInfoDone"
            },
            {
                url: this.url + "wp-json/pai/v1/users/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupUsers",
                doneState: "groupUsersDone"
            },
            {
                url: this.url + "wp-json/pai/v1/courses/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupCourses",
                doneState: "groupCoursesDone"
            },
            {
                url: this.url + "wp-json/pai/v1/course-activities/?" + this.reportEndpoint + "=" + teamId,
                state: "apiReportGroupActivities",
                doneState: "groupActivitiesDone"
            },
        ];

        for (let i = 0; i < calls.length; ++i) {
            this.doTeamApiCall(calls[i], limit, offset, teamId);
        }
    }

    /*
        Do the team report api call
        Params:
            call    -> (object) info about the api call
            limit   -> (int) the max number to get from api call
            offset  -> (int) index to start from
            teamId  -> (int) to be used by groupInfo to get the group object
        Return:
            undefined
    */
    doTeamApiCall(call, limit, offset, teamId) {
        const requestOptions = {
            method: "GET",
            mode: "cors"
        };
        const limitOffset = "&limit=" + limit + "&offset=" + offset;
        ApiHandler.doApiCall(new Request(call["url"] + limitOffset, requestOptions))
        .then((jsonData) => {
            this.setTeamApiResults(jsonData, call, teamId, limit, offset);
        })
        .catch((err) => {
            console.log("Promise Catch: Content.doReportApiCalls", err);
        })
    }

    /*
        Once the api call is done, set it to the state only if done getting
        data from that endpoint
        Params:
            jsonData -> (object) the result of the api
            call     -> (object) info about the api call
            teamId   -> (int) the team id to fetch api for
            limit   -> (int) the max number to get from api call
            offset  -> (int) index to start from
        Return:
            undefined
    */
    setTeamApiResults(jsonData, call, teamId, limit, offset) {
        this.newApi[call["state"]] = {...this.newApi[call["state"]], ...jsonData["result"]};
        if (jsonData["count"] >= limit) {
            this.doTeamApiCall(call, limit, offset + jsonData["count"], teamId);
        }
        else {
            this.setState({
                [call["doneState"]]: true
            });
            const loading = !this.allDone(call["doneState"]);
            if (call["state"] === "apiReportGroupInfo") {
                this.setState({
                    loading: loading,
                    [call["state"]]: this.newApi[call["state"]][teamId]
                });
            }
            else {
                this.setState({
                    loading: loading,
                    [call["state"]]: this.newApi[call["state"]]
                });
            }
        }
    }

    /*
        Run all the API calls related to survey results
        Params:
            limit -> (int) the max to get at a time
            offset -> (int) where to start from
            caregivers -> (int) whether to do the caregivers api
        Return:
            undefined
    */
    doSurveyApiCalls(limit, offset, doCaregivers) {
        let url = this.url + "wp-json/pai/v1/survey?limit=" + limit + "&offset=" + offset;
        if (doCaregivers === 1) {
            url += "&caregivers=1";
        }
        const requestOptions = {
            method: "GET",
            mode: "cors"
        };

        ApiHandler.doApiCall(new Request(url, requestOptions))
        .then((jsonData) => {
            this.setSurveyApiProperty(jsonData, limit, offset, doCaregivers);
        })
        .catch((err) => {
            console.log("Promise Catch: Content.doSurveyApiCalls", err);
        });
    }

    setSurveyApiProperty(newEntries, limit, offset, doCaregivers) {
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
            this.doSurveyApiCalls(limit, offset + count, doCaregivers);
        }
        else if (doCaregivers !== 1) {
            this.doSurveyApiCalls(limit, 0, 1);
        }
        else {
            this.setState({
                surveyDone: true
            });
            const loading = !this.allDone("surveyDone");
            this.setState({
                loading: loading,
                apiSurveyEntries: this.newApi["apiSurveyEntries"]
            });
        }
    }

    /*
        Check if all the api calls are done
        Params:
            ignored -> (string) the state to ignore checking for
        Return:
            bool -> whether all api calls are done or not
    */
    allDone(ignored) {
        const apiStates = [
            "groupInfoDone",
            "groupUsersDone",
            "groupCoursesDone",
            "groupActivitiesDone",
            "surveyDone"
        ];
        for (let i = 0; i < apiStates.length; ++i) {
            if (apiStates[i] !== ignored && !this.state[apiStates[i]]) {
                return false;
            }
        }

        return true;
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
            case "comment":
                return this.props["view"];
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
