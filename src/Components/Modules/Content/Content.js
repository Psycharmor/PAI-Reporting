import React from "react";

import ApiHandler from "../../../Lib/ApiHandler";
import TeamReport from "./TeamReporting/TeamReport";
import Survey from "./Survey/Survey";
import Comments from "./Comments/Comments";

/*
    The Component will handle rendering the different views as well as handling
    the API calls used by them.
*/
class Content extends React.Component {
    constructor(props) {
        super(props);

        this.url = "https://psycharmor.org/";
        this.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvcHN5Y2hhcm1vci5vcmciLCJpYXQiOjE1ODAyMzAyOTIsIm5iZiI6MTU4MDIzMDI5MiwiZXhwIjoxNTgwODM1MDkyLCJkYXRhIjp7InVzZXIiOnsiaWQiOiIyNTYxNyJ9fX0.Q24IEyUoHZhXs9-VqJaGnuGHCVVctyUIeS2h30dXX5g";

        this.newApi = {
            apiReportGroupInfo: {},
            apiReportGroupUsers: {},
            apiReportGroupCourses: {},
            apiReportGroupActivities: {},
            apiSurveyEntries: {},
            apiFrqCategories: [],
            apiFrqResponses: [],
            apiComments: []
        };

        this.reportEndpoint = this.getReportEndpoint();

        this.state = {
            loading: false,
            groupInfoDone: true,
            groupUsersDone: true,
            groupCoursesDone: true,
            groupActivitiesDone: true,
            surveyDone: true,
            commentsDone: true,
            frqCategoriesDone: true,
            frqResponsesDone: true,
            apiReportGroupInfo: {},
            apiReportGroupUsers: {},
            apiReportGroupCourses: {},
            apiReportGroupActivities: {},
            apiSurveyEntries: {},
            apiFrqCategories: [],
            apiFrqResponses: [],
            apiComments: []
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

        this.doReportApiCalls(teamId, 5000, 0);
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
            surveyDone: false,
            frqCategoriesDone: false,
            frqResponsesDone: false,
            commentsDone: false
        });
        const user = JSON.parse(localStorage.getItem("USER"));
        this.doReportApiCalls(user["group"][0]["id"], 5000, 0);

        if ("survey" in this.props["menus"]) {
            this.doSurveyApiCalls(5000, 0, 0);
            this.doFrqApiCalls();
        }
        else {
            this.setState({
                surveyDone: true,
                frqCategoriesDone: true,
                frqResponsesDone: true
            });
        }

        if ("comments" in this.props["menus"]) {
            this.doCommentsApiCalls(1000, 0);
        }
        else {
            this.setState({
                commentsDone: true
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
        const headers = new Headers({
            Authorization: "Bearer " + this.token
        });
        const requestOptions = {
            method: "GET",
            mode: "cors",
            headers: headers
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
        const headers = new Headers({
            Authorization: "Bearer " + this.token
        });
        const requestOptions = {
            method: "GET",
            mode: "cors",
            headers: headers
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

    doFrqApiCalls() {
        const headers = new Headers({
            Authorization: "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdGFnaW5nLnBzeWNoYXJtb3Iub3JnIiwiaWF0IjoxNTgwNDg3NDE3LCJuYmYiOjE1ODA0ODc0MTcsImV4cCI6MTU4MTA5MjIxNywiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjU2MTcifX19.dQ0Ts9uBttdND5B0Uo8dIN3pCVusy2cRlXKDooDNi10"
        });
        const requestOptions = {
            method: "GET",
            mode: "cors",
            headers: headers
        };

        // categories
        ApiHandler.doApiCall(new Request("http://staging.psycharmor.org/wp-json/pai/v1/frq?fetch=categories", requestOptions))
        .then((jsonData) => {
            this.newApi["apiFrqCategories"] = jsonData;
            this.setState({
                frqCategoriesDone: true,
            });

            const loading = !this.allDone("frqCategoriesDone");
            this.setState({
                loading: loading,
                apiFrqCategories: jsonData
            });
        })
        .catch((err) => {
            console.log("Promise Catch: Content.doFrqApiCalls", err);
        });

        // responses
        ApiHandler.doApiCall(new Request("http://staging.psycharmor.org/wp-json/pai/v1/frq?fetch=responses", requestOptions))
        .then((jsonData) => {
            this.newApi["apiFrqResponses"] = jsonData;
            this.setState({
                frqResponsesDone: true,
            });

            const loading = !this.allDone("frqResponsesDone");
            this.setState({
                loading: loading,
                apiFrqResponses: jsonData
            });
        })
        .catch((err) => {
            console.log("Promise Catch: Content.doFrqApiCalls", err);
        });
    }

    doCommentsApiCalls(limit, offset) {
        let url = "http://staging.psycharmor.org/" + "wp-json/pai/v1/comments?limit=" + limit + "&offset=" + offset;
        const headers = new Headers({
            Authorization: "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdGFnaW5nLnBzeWNoYXJtb3Iub3JnIiwiaWF0IjoxNTgwNDg3NDE3LCJuYmYiOjE1ODA0ODc0MTcsImV4cCI6MTU4MTA5MjIxNywiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjU2MTcifX19.dQ0Ts9uBttdND5B0Uo8dIN3pCVusy2cRlXKDooDNi10"
        });
        const requestOptions = {
            method: "GET",
            mode: "cors",
            headers: headers
        };

        ApiHandler.doApiCall(new Request(url, requestOptions))
        .then((jsonData) => {
            this.newApi["apiComments"] = this.newApi["apiComments"].concat(jsonData);
            if (jsonData.length >= 1000) {
                this.doCommentsApiCalls(limit, offset + jsonData.length);
            }
            else {
                this.setState({
                    commentsDone: true
                });
                const loading = !this.allDone("commentsDone");
                this.setState({
                    loading: loading,
                    apiComments: this.newApi["apiComments"]
                });
            }
        })
        .catch((err) => {
            console.log("Promise Catch: Content.doSurveyApiCalls", err);
        });
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
            "surveyDone",
            "commentsDone",
            "frqCategoriesDone",
            "frqResponsesDone"
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
                        frqCategories={this.state["apiFrqCategories"]}
                        frqResponses={this.state["apiFrqResponses"]}
                    />
                );
            case "comments":
                return (
                    <Comments
                        comments={this.state["apiComments"]}
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
