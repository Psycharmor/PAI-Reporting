import React from "react";

import {Container, Row, Col, TabContent, TabPane} from "reactstrap";
import moment from "moment";

import FilterBtn from "./Filters/FilterBtn";
import SurveyTabs from "./SurveyTabs";
import YesNoChart from "./Charts/YesNoChart";
import Demographics from "./Demographics";

export default class SurveyResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: "results",
            portfolioId: 0,
            courseId: 0,
            startDate: moment("2019-09-01", "YYYY-MM-DD"),
            endDate: moment().endOf("day"),
            groupId: 0,
            org: "0"
        };

        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handlePortfolioChange = this.handlePortfolioChange.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleOrgChange = this.handleOrgChange.bind(this);
    }

    handleActiveTabChange(event) {
        this.setState({
            activeTab: event.target.getAttribute("value")
        });
    }

    handlePortfolioChange(event) {
        this.setState({
            portfolioId: parseInt(event.target["value"]),
            courseId: 0
        });
    }

    handleCourseChange(event) {
        this.setState({
            courseId: parseInt(event.target["value"])
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

    handleGroupChange(event) {
        this.setState({
            groupId: parseInt(event.target["value"])
        });
    }

    handleOrgChange(event) {
        this.setState({
            org: event.target["value"]
        });
    }

    render() {
        console.log(this.props);
        return (
            <Container fluid={true}>
                <Row className={"margin-bot-30"}>
                    <Col>
                        <FilterBtn
                            portfolios={this.props["portfolios"]}
                            courses={this.props["courses"]}
                            groups={this.props["groups"]}
                            users={this.props["users"]}
                            portfolioId={this.state["portfolioId"]}
                            courseId={this.state["courseId"]}
                            startDate={this.state["startDate"]}
                            endDate={this.state["endDate"]}
                            groupId={this.state["groupId"]}
                            org={this.state["org"]}
                            portfolioChangeHandler={this.handlePortfolioChange}
                            courseChangeHandler={this.handleCourseChange}
                            startDateChangeHandler={this.handleStartDateChange}
                            endDateChangeHandler={this.handleEndDateChange}
                            groupChangeHandler={this.handleGroupChange}
                            orgChangeHandler={this.handleOrgChange}
                        />
                    </Col>
                </Row>
                <Row className={"margin-bot-10"}>
                    <Col>
                        <SurveyTabs
                            activeTab={this.state["activeTab"]}
                            activeTabChangeHandler={this.handleActiveTabChange}
                        />
                    </Col>
                </Row>
                <Row className={"margin-bot-30"}>
                    <Col>
                        <TabContent activeTab={this.state["activeTab"]}>
                            <TabPane tabId={"results"}>
                                <YesNoChart
                                    surveys={this.props["surveys"]}
                                    portfolios={this.props["portfolios"]}
                                    courses={this.props["courses"]}
                                    groups={this.props["groups"]}
                                    users={this.props["users"]}
                                    portfolioId={this.state["portfolioId"]}
                                    courseId={this.state["courseId"]}
                                    startDate={this.state["startDate"]}
                                    endDate={this.state["endDate"]}
                                    groupId={this.state["groupId"]}
                                    org={this.state["org"]}
                                />
                            </TabPane>
                            <TabPane tabId={"demographics"}>
                                <Demographics
                                    surveys={this.props["surveys"]}
                                    groups={this.props["groups"]}
                                    portfolios={this.props["portfolios"]}
                                    activities={this.props["activities"]}
                                    users={this.props["users"]}
                                />
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </Container>
        );
    }
};
