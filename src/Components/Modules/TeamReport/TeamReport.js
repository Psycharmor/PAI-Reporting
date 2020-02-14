import React from "react";

import {Container, Row, Col} from "reactstrap";
import {MdPerson} from "react-icons/md";
import moment from "moment";

import ReportFilters from "./Filters/ReportFilters";
import Brief from "./Briefing/Brief";
import ReportExportBtn from "./ReportExportBtn";
import TeamReportTable from "./TeamReportTable";
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
        this.setState({
            groupId: parseInt(event.target["value"]),
            subgroupId: 0
        });
    }

    handleSubgroupChange(event) {
        this.setState({
            subgroupId: parseInt(event.target["value"])
        });
    }

    handleStartDateChange(date) {
        if (typeof(date) === "string") {
            return;
        }
        this.setState({
            startDate: date
        });
    }

    handleEndDateChange(date) {
        if (typeof(date) === "string") {
            return;
        }
        this.setState({
            endDate: date
        });
    }

    getGroupIds() {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (user["user_role"].includes("administrator")) {
            return Object.keys(this.props["groups"]);
        }

        let groupIds = [];
        for (let i = 0; i < user["group"].length; ++i) {
            const groupId = user["group"][i]["id"];
            groupIds.push(groupId);
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
        console.log(this.props);
        console.log(this.state);

        const groups = (this.state["subgroupId"] === 0) ?
            this.props["groups"] : this.props["groups"][this.state["groupId"]]["subgroups"];
        const groupId = (this.state["subgroupId"] === 0) ?
            this.state["groupId"] : this.state["subgroupId"];
        return (
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
                            content={groups[groupId]["userIds"].length}
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
                    <Col sm={6}>
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
        );
    }
};
