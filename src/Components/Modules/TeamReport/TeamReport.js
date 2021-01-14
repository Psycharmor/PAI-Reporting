import React from "react";

import {Container, Row, Col} from "reactstrap";
import {MdPerson} from "react-icons/md";
import moment from "moment";

import ReportFilters from "./Filters/ReportFilters";
import Brief from "./Briefing/Brief";
import ReportExportBtn from "./ReportExportBtn";
import TeamReportTable from "./TeamReportTable";
import LoadingOverlay from "../../LoadingOverlay";
import TeamReportFunctions from "../../../Lib/Modules/TeamReport/TeamReportFunctions";

export default class TeamReport extends React.Component {
    constructor(props) {
        super(props);

        this.groupIds = this.getGroupIds();

        this.state = {
            groupId: this.getInitGroup(),
            subgroupId: 0,
            startDate: moment("2017-01-01", "YYYY-MM-DD"),
            endDate: moment().endOf("day")
        };


        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleSubgroupChange = this.handleSubgroupChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    handleGroupChange(event) {
        // we need to edit the dom before react is able to rerender
        // so we force a timeout before the state change to allow showLoader
        // time to edit the loader.
        // Not very many ways to have a loader for the actual render itself
        showLoader(); // screw you react
        const groupId = parseInt(event.target["value"]);
        setTimeout(() => {
            requestAnimationFrame(() => {
                this.setState({
                    groupId: groupId,
                    subgroupId: 0
                });
            });
        });
    }

    handleSubgroupChange(event) {
        showLoader();
        const subgroupId = parseInt(event.target["value"]);
        setTimeout(() => {
            requestAnimationFrame(() => {
                this.setState({
                    subgroupId: subgroupId
                });
            });
        });
    }

    handleStartDateChange(date) {
        if (typeof(date) === "string") {
            return;
        }
        showLoader();
        setTimeout(() => {
            requestAnimationFrame(() => {
                this.setState({
                    startDate: date
                });
            });
        });
    }

    handleEndDateChange(date) {
        if (typeof(date) === "string") {
            return;
        }
        showLoader();
        setTimeout(() => {
            requestAnimationFrame(() => {
                this.setState({
                    endDate: date
                });
            });
        });
    }

    getGroupIds() {
        const user = JSON.parse(sessionStorage.getItem("USER"));
        if (user["user_role"].includes("administrator")) {
            return Object.keys(this.props["groups"]);
        }

        let groupIds = [];
        for (let i = 0; i < user["group"].length; ++i) {
            const groupId = user["group"][i]["id"];
            groupIds.push(groupId.toString());
        }

        return groupIds;
    }

    getInitGroup() {
        let groups = [];
        for (let groupId in this.props["groups"]) {
            if (this.groupIds.includes(groupId)) {
                groups.push({groupId: groupId, name: this.props["groups"][groupId]["title"]});
            }
        }
        groups.sort(function(a, b) {
            const aName = a["name"];
            const bName = b["name"];

            if (aName < bName) {
                return -1;
            }
            if (aName > bName) {
                return 1;
            }

            return 0;
        });

        return groups[0]["groupId"];
    }


    getUserCount(groups, groupId, users){
      const groupUserIds = groups[groupId]["userIds"];

      var userCount = [];

      for(var groupUserId in groupUserIds) {
          var userId = groupUserIds[groupUserId];
           const user = users[userId];
           // console.log(user["registeredDate"]);
           var registeredDateUnix = moment(user["registeredDate"], "YYYY-MM-DD").unix();
           if (TeamReportFunctions.isFilteredUser(this.state, registeredDateUnix )) {
             // console.log(user.length);
               if ( userCount.indexOf(userId) === -1 ) {
                   userCount.push(userId);
               }
           }

      }

      return userCount.length;
    }



    getUserCompletionCount(groups, groupId, activities) {
        const courseIds = groups[groupId]["courseIds"];
        const userIds = groups[groupId]["userIds"];

        var userCompletionCount = [];

        for (let activityId in activities) {
            const activity = activities[activityId];


            if (userIds.includes(activity["userId"]) && courseIds.includes(activity["courseId"])  && activity["status"]) {

                if (TeamReportFunctions.isFilteredActivity(this.state, activity)) {
                    if ( userCompletionCount.indexOf(activity["userId"]) === -1 ) {
                        userCompletionCount.push(activity["userId"]) ;
                    }
                }
            }
        }
        return userCompletionCount.length;
    }


    getCourseCompletionCount(groups, groupId, activities) {
        const courseIds = groups[groupId]["courseIds"];
        const userIds = groups[groupId]["userIds"];

        let courseCompletionCount = 0;
        for (let activityId in activities) {
            const activity = activities[activityId];
            if (userIds.includes(activity["userId"]) && courseIds.includes(activity["courseId"])
                    && activity["status"]) {
                if (TeamReportFunctions.isFilteredActivity(this.state, activity)) {
                    ++courseCompletionCount;
                }
            }
        }

        return courseCompletionCount;
    }

    render() {
        // console.log(this.props);
        // console.log(this.state);

        const groups = (this.state["subgroupId"] === 0) ?
            this.props["groups"] : this.props["groups"][this.state["groupId"]]["subgroups"];
        const groupId = (this.state["subgroupId"] === 0) ?
            this.state["groupId"] : this.state["subgroupId"];
        return (
            <>
            <LoadingOverlay/>
            <Container fluid={true}>
                <ReportFilters
                    groupId={this.state["groupId"]}
                    groups={this.props["groups"]}
                    groupIds={this.groupIds}
                    startDate={this.state["startDate"]}
                    endDate={this.state["endDate"]}
                    groupChangeHandler={this.handleGroupChange}
                    subgroupId={this.state["subgroupId"]}
                    subgroupChangeHandler={this.handleSubgroupChange}
                    startDateChangeHandler={this.handleStartDateChange}
                    endDateChangeHandler={this.handleEndDateChange}
                />
                <Row className={"margin-bot-30"}>
                    <Col sm={6} xl={3}>
                        <Brief
                            title={"Total Users"}
                            content={this.getUserCount(groups, groupId, this.props["users"])}
                            // content={groups[groupId]["userIds"].length}
                            icon={<MdPerson/>}
                            class={"team-report-total-users-icon"}
                        />
                    </Col>
                    <Col sm={6} xl={3}>
                        <Brief
                            title={"Active Users"}
                            content={this.getUserCompletionCount(groups, groupId, this.props["activities"])}
                            icon={<MdPerson/>}
                            class={"team-report-total-users-icon"}
                        />
                    </Col>
                    <Col sm={6} xl={3}>
                        <Brief
                            title={"Course Completions"}
                            content={this.getCourseCompletionCount(groups, groupId, this.props["activities"])}
                            icon={<MdPerson/>}
                            class={"team-report-total-course-completed-icon"}
                        />
                    </Col>
                        <Col sm={6} xl={3}>
                        <ReportExportBtn
                            group={groups[groupId]}
                            users={this.props["users"]}
                            courses={this.props["courses"]}
                            activities={this.props["activities"]}
                        />
                    </Col>
                </Row>
                <Row className={"margin-bot-30"}>
                    <Col>
                        <TeamReportTable
                            groupId={groupId}
                            groups={groups}
                            startDate={this.state["startDate"]}
                            endDate={this.state["endDate"]}
                            users={this.props["users"]}
                            courses={this.props["courses"]}
                            portfolios={this.props["portfolios"]}
                            activities={this.props["activities"]}
                        />
                    </Col>
                </Row>
            </Container>
            </>
        );
    }
};

function showLoader() {
    const loader = document.querySelector(".loading-overlay");
    loader.classList.remove("hide");
}
