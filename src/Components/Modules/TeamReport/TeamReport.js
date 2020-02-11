import React from "react";

import {Container, Row, Col} from "reactstrap";
import {MdPerson} from "react-icons/md";

import ReportFilters from "./Filters/ReportFilters";
import Brief from "./Briefing/Brief";
import ReportExportBtn from "./ReportExportBtn";
import TeamReportTable from "./TeamReportTable";

export default class TeamReport extends React.Component {
    constructor(props) {
        super(props);

        this.groupIds = this.getGroupIds();

        this.state = {
            groupId: this.getInitGroup(),
            subgroupId: 0
        };

        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleSubgroupChange = this.handleSubgroupChange.bind(this);
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
                ++courseCompletionCount;
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
                    groupChangeHandler={this.handleGroupChange}
                    subgroupId={this.state["subgroupId"]}
                    subgroupChangeHandler={this.handleSubgroupChange}
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
