import React from "react";

import {Spinner, Container, Nav, NavItem, TabContent, TabPane, Row, Col} from "reactstrap";

import PortfolioDropdown from "./Filters/PortfolioDropdown";
import CourseDropdown from "./Filters/CourseDropdown";
import ExtraSurveyFilters from "./Filters/ExtraSurveyFilters";
import ExportBtn from "./ExportBtn";
import SurveyResults from "./SurveyResults";
import UserDemographics from "./UserDemographics/UserDemographics";
import FreeResponse from "./FreeResponse/FreeResponse";
import SurveyFunctions from "../../../../Lib/Content/Survey/SurveyFunctions";

/*
    This component will take in the current data retrieved from the api and
    process it before rendering the view.
*/
class Survey extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date("2019/09/01"),
            endDate: new Date((new Date()).setHours(23, 59, 59, 999)),
            portfolioId: 0,
            courseId: 0,
            team: 0,
            organization: 0,
            role: 0,
            results: {},
            tab: "results"
        };

        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handlePortfolioChange = this.handlePortfolioChange.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleTeamChange = this.handleTeamChange.bind(this);
        this.handleOrgChange = this.handleOrgChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
    }

    // Lifecycle Methods
    componentDidMount() {
        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            {
                startDate: this.state["startDate"].getTime() / 1000,
                endDate: this.state["endDate"].getTime() / 1000,
                team: this.state["team"],
                organization: this.state["organization"],
                role: this.state["role"],
            }
        );
        this.setState({
            results: results,
            portfolioId: 0,
            courseId: 0
        });
    }

    // Event Handler Methods

    /*
        Set the viewed tab to the new one defined by the event
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleActiveTabChange(event) {
        this.setState({
            tab: event.target.getAttribute("value")
        });
    }

    /*
        Set the portfolioId for the survey view so that you will only view
        that portfolio's results
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handlePortfolioChange(event) {
        this.setState({
            portfolioId: parseInt(event.target["value"]),
            courseId: 0
        });
    }

    /*
        Set the courseId for the survey view so that you will only view results
        from that specific course
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleCourseChange(event) {
        this.setState({
            courseId: parseInt(event.target["value"])
        });
    }

    /*
        Set the new start date for the filter
        Params:
            date -> (Moment) the new start date
        Return:
            undefined
    */
    handleStartDateChange(date) {
        if ((typeof date) === "string") {
            return;
        }
        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            {
                startDate: date.unix(),
                endDate: this.state["endDate"].getTime() / 1000,
                team: this.state["team"],
                organization: this.state["organization"],
                role: this.state["role"],
            }
        );
        this.setState({
            results: results,
            startDate: date.toDate()
        });
    }

    /*
        Set the new end date for the filter
        Params:
            date -> (Moment) the new end date
        Return:
            undefined
    */
    handleEndDateChange(date) {
        if ((typeof date) === "string") {
            return;
        }

        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            {
                startDate: this.state["startDate"].getTime() / 1000,
                endDate: date.unix(),
                team: this.state["team"],
                organization: this.state["organization"],
                role: this.state["role"],
            }
        );
        this.setState({
            results: results,
            endDate: date.toDate()
        });
    }

    /*
        Set the team to be the new team
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleTeamChange(event) {
        const team = (event.target["value"] === "0") ? 0 : event.target["value"];
        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            {
                startDate: this.state["startDate"].getTime() / 1000,
                endDate: this.state["endDate"].getTime() / 1000,
                team: team,
                organization: this.state["organization"],
                role: this.state["role"],
            }
        );
        this.setState({
            results: results,
            team: team
        });
    }

    /*
        Set the org to be the new org
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleOrgChange(event) {
        const org = (event.target["value"] === "0") ? 0 : event.target["value"];
        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            {
                startDate: this.state["startDate"].getTime() / 1000,
                endDate: this.state["endDate"].getTime() / 1000,
                team: this.state["team"],
                organization: org,
                role: this.state["role"],
            }
        );
        this.setState({
            results: results,
            organization: org
        });
    }

    /*
        Set the role with veterans to be the new role
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleRoleChange(event) {
        const role = (event.target["value"] === "0") ? 0 : event.target["value"];
        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            {
                startDate: this.state["startDate"].getTime() / 1000,
                endDate: this.state["endDate"].getTime() / 1000,
                team: this.state["team"],
                organization: this.state["organization"],
                role: role,
            }
        );
        this.setState({
            results: results,
            role: role
        });
    }

    // Render Methods

    /*
        Render the portfolio/course filters and the date filters
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderFilters() {
        const portfolioDropdown = (
            <PortfolioDropdown
                surveyEntries={this.props["surveyEntries"]}
                portfolioId={this.state["portfolioId"]}
                eventHandler={this.handlePortfolioChange}
            />
        );
        let courseDropdown;
        if (this.state["portfolioId"] !== 0) {
            courseDropdown = (
                <CourseDropdown
                    surveyEntries={this.props["surveyEntries"]}
                    portfolioId={this.state["portfolioId"]}
                    courseId={this.state["courseId"]}
                    eventHandler={this.handleCourseChange}
                />
            );
        }
        return (
            <Row className={"survey-filters"}>
                <Col xs={3}>
                    {portfolioDropdown}
                </Col>
                <Col xs={3}>
                    {courseDropdown}
                </Col>
                <Col xs={6}>
                    <ExtraSurveyFilters
                        surveyEntries={this.props["surveyEntries"]}
                        startDate={this.state["startDate"]}
                        endDate={this.state["endDate"]}
                        team={this.state["team"]}
                        organization={this.state["organization"]}
                        role={this.state["role"]}
                        startDateHandler={this.handleStartDateChange}
                        endDateHandler={this.handleEndDateChange}
                        teamHandler={this.handleTeamChange}
                        orgHandler={this.handleOrgChange}
                        roleHandler={this.handleRoleChange}
                    />
                </Col>
            </Row>
        );
    }

    /*
        Render the tabs to allow for switching between survey results and
        user demographics
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderTabs() {
        return (
            <Nav tabs className={"survey-tabs"}>
                <NavItem
                    className={(this.state["tab"] === "results") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"results"}
                >
                    Results
                </NavItem>
                <NavItem
                    className={(this.state["tab"] === "demographics") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"demographics"}
                >
                    Demographics
                </NavItem>
                <NavItem
                    className={(this.state["tab"] === "freeResponse") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"freeResponse"}
                >
                    Free Response
                </NavItem>
            </Nav>
        );
    }

    /*
        Render the main content which will be either the survey results as charts
        or the user demographics table
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderMainContent() {
        return (
            <TabContent activeTab={this.state["tab"]}>
                <TabPane tabId={"results"}>
                    <SurveyResults
                        results={this.state["results"]}
                        portfolioId={this.state["portfolioId"]}
                        courseId={this.state["courseId"]}
                    />
                </TabPane>
                <TabPane tabId={"demographics"}>
                    <UserDemographics
                        surveyEntries={this.props["surveyEntries"]}
                        portfolioId={this.state["portfolioId"]}
                        courseId={this.state["courseId"]}
                        filters={{
                            startDate: this.state["startDate"].getTime() / 1000,
                            endDate: this.state["endDate"].getTime() / 1000,
                            team: this.state["team"],
                            organization: this.state["organization"],
                            role: this.state["role"]
                        }}
                    />
                </TabPane>
                <TabPane tabId={"freeResponse"}>
                    <FreeResponse
                        results={this.state["results"]}
                        portfolioId={this.state["portfolioId"]}
                        courseId={this.state["courseId"]}
                        frqCategories={this.props["frqCategories"]}
                        frqResponses={this.props["frqResponses"]}
                    />
                </TabPane>
            </TabContent>
        );
    }

    render() {
        console.log(this.props["surveyEntries"]);
        console.log(this.state["results"]);
        if (this.props["loading"]) {
            return (
                <div className={"loading-overlay"}>
                    <Spinner className={"loading-spinner"}/>
                </div>
            );
        };

        return (
            <Container fluid={true}>
                {this.renderFilters()}
                <Row>
                    <Col>
                        {this.renderTabs()}
                    </Col>
                    <Col cs={"auto"}>
                        <ExportBtn
                            surveyEntries={this.props["surveyEntries"]}
                            portfolioId={this.state["portfolioId"]}
                            courseId={this.state["courseId"]}
                            filters={{
                                startDate: this.state["startDate"].getTime() / 1000,
                                endDate: this.state["endDate"].getTime() / 1000,
                                team: this.state["team"],
                                organization: this.state["organization"],
                                role: this.state["role"]
                            }}
                        />
                    </Col>
                </Row>
                {this.renderMainContent()}
            </Container>
        );
    }
}
export default Survey;
