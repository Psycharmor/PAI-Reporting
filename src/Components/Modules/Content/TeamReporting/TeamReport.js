import React from "react";

import {Spinner, Container, Row, Col, Card, CardHeader} from "reactstrap";
import {MdPerson, MdCheck} from "react-icons/md";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import TeamReportSummary from "./TeamReportSummary.js";
import TeamDropdown from "./TeamDropdown";
import GroupDropdown from "./GroupDropdown";
import ExportBtn from "./ExportBtn";
import TeamReportFunctions from "../../../../Lib/Content/TeamReporting/TeamReportFunctions";

/*
    This component will take in the current data retrieved from the api and
    process it before rendering the view.
*/
class TeamReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupId: 0
        };

        this.handleGroupChange = this.handleGroupChange.bind(this);
    }

    // lifecycle methods
    componentDidUpdate() {
        if (this.props["loading"] && this.state["groupId"] !== 0) {
            this.setState({
                groupId: 0
            });
        }
    }

    // Event Handler Methods

    /*
        Set the group (subgroup) as the new group set by the event
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleGroupChange(event) {
        this.setState({
            groupId: parseInt(event.target["value"])
        });
    }

    // Render Methods

    /*
        Render the filters for the report. Filter the report by Team (Group) and
        by Group (Subgroup).
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderFilters() {
        const groups = ("subGroups" in this.props["groupInfo"]) ? this.props["groupInfo"]["subGroups"] : {};
        return (
            <Row className={"team-report-row"}>
                <Col sm={6} md={3}>
                    <TeamDropdown
                        teamId={this.props["groupInfo"]["id"]}
                        teamChangeHandler={this.props["teamChangeHandler"]}
                    />
                </Col>
                <Col sm={6} md={3}>
                    <GroupDropdown
                        groups={groups}
                        groupChangeHandler={this.handleGroupChange}
                    />
                </Col>
            </Row>
        );
    }

    /*
        Render the boxes that show the total users in the team/group and their
        total course completions
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderSummary() {
        let group = this.props["groupInfo"];
        if (this.state["groupId"] !== 0) {
            group = this.props["groupInfo"]["subGroups"][this.state["groupId"]];
        }
        const totalUsers = group["enrolledUsers"].length;
        const courseCompletions = getCourseCompletionCount(group, this.props["activities"]);

        return (
            <Row className={"team-report-row"}>
                <Col sm={6} xl={3}>
                    <TeamReportSummary
                        title={"Total Users"}
                        content={totalUsers}
                        icon={<MdPerson/>}
                        class={"team-report-user-icon"}
                    />
                </Col>
                <Col sm={6} xl={3}>
                    <TeamReportSummary
                        title={"Course Completions"}
                        content={courseCompletions}
                        icon={<MdCheck/>}
                        class={"team-report-course-icon"}
                    />
                </Col>
                <Col sm={6}>
                    <ExportBtn
                        group={group}
                        courses={this.props["courses"]}
                        users={this.props["users"]}
                        activities={this.props["activities"]}
                    />
                </Col>
            </Row>
        );
    }

    /*
        Render the table that shows each user and their course progress
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderTable() {
        let group = this.props["groupInfo"];
        if (this.state["groupId"] !== 0) {
            group = this.props["groupInfo"]["subGroups"][this.state["groupId"]];
        }
        let headers = TeamReportFunctions.getTeamReportHeaders(
            group, this.props["courses"]);
        let data = TeamReportFunctions.getTeamReportData(
            group, this.props["users"], this.props["activities"]);

        const headerStyle = {
            padding: "0.75rem 1.5rem",
            borderBottom: "1px solid #E9ECEF",
            verticalAlign: "top",
            backgroundColor: "#F6F9FC",
            color: "#292A2B",
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            width: 210
        };

        const cellStyle = {
            padding: "1rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            verticalAlign: "top",
            fontSize: "0.8125rem",
            borderTop: "1px solid #E9ECEF",
            backgroundColor: "#FFFFFF",
            color: "#525F7F"
        };

        for (let i = 0; i < headers.length; ++i) {
            headers[i]["headerStyle"] = headerStyle;
            headers[i]["style"] = cellStyle;
        }

        return(
            <Row>
                <Col>
                    <Card className={"table-card"}>
                        <CardHeader>
                            <h3>{"User Course Completions"}</h3>
                            <p>{"All users and their course progress"}</p>
                        </CardHeader>
                        <BootstrapTable
                            bootstrap4={true}
                            wrapperClasses={"table-responsive"}
                            keyField={"email"}
                            columns={headers}
                            data={data}
                            bordered={false}
                            pagination={paginationFactory({
                                showTotal: true,
                                alwaysShowAllBtns: true,
                                sizePerPageList: [10, 50, 100, 200, 500]
                            })}
                        />
                    </Card>
                </Col>
            </Row>
        );
    }

    render() {
        if (this.props["loading"]) {
            return (
                <div className={"loading-overlay"}>
                    <Spinner className={"loading-spinner"}/>
                </div>
            );
        };

        if (!this.props["groupInfo"] || Object.keys(this.props["groupInfo"]).length === 0) {
            return (<div></div>);
        };

        return (
            <Container fluid={true}>
                {this.renderFilters()}
                {this.renderSummary()}
                {this.renderTable()}
            </Container>
        );
    }
}
export default TeamReport;

/*
    Get a count of all the team course completions for the enrolled courses
    Params:
        groupInfo  -> (object) info about the team obtained by the api
        activities -> (object) all the user activities obtained by the api
    Return:
        int -> a count of all the team course completions
*/
function getCourseCompletionCount(groupInfo, activities) {
    const courseIds = groupInfo["courses"];
    const userIds = groupInfo["enrolledUsers"];

    let courseCompletionCount = 0;
    for (let activityId in activities) {
        const activity = activities[activityId];
        if (userIds.includes(activity["userId"]) && courseIds.includes(activity["courseId"])
                && activity["status"] === 1) {
            ++courseCompletionCount;
        }
    }

    return courseCompletionCount;
}
