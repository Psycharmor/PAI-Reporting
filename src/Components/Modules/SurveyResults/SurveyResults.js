import React from "react";

import {Container, Row, Col, TabContent, TabPane} from "reactstrap";
import moment from "moment";

import FilterBtn from "./Filters/FilterBtn";
import SurveyTabs from "./SurveyTabs";
import SurveyExportBtn from "./SurveyExportBtn";
import YesNoChart from "./Charts/YesNoChart";
import FrqChart from "./Charts/FrqChart";
import RatingGroupMeansChart from "./Charts/RatingGroupMeansChart";
import RatingScoreMeansChart from "./Charts/RatingScoreMeansChart";
import Demographics from "./Demographics";
import FreeResponseCategories from "./FreeResponse/FreeResponseCategories";
import ApiHandler from "../../../Lib/ApiHandler";

export default class SurveyResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            activeTab: "results",
            portfolioId: 0,
            courseId: 0,
            startDate: moment("2019-09-01", "YYYY-MM-DD"),
            endDate: moment().endOf("day"),
            groupId: 0,
            org: "0",
            role: "0",
            frqCategories: {},
            frqResponses: {},
            frqCategoriesColors: []
        };
        this.state["frqCategoriesColors"] = getBgColors(this.state["frqCategories"]);

        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handlePortfolioChange = this.handlePortfolioChange.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleOrgChange = this.handleOrgChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.addNewCategory = this.addNewCategory.bind(this);
        this.linkResponse = this.linkResponse.bind(this);
        this.delinkResponse = this.delinkResponse.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
    }

    componentDidMount() {
        this.doFrqApiCalls();
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

    handleRoleChange(event) {
        this.setState({
            role: event.target["value"]
        });
    }

    async doFrqApiCalls() {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (user) {
            this.setState({
                loading: true,
            });
            const options = {
                headers: {
                    Authorization: "Bearer " + user["token"]
                }
            };

            const [categories, responses] = await Promise.all([
                ApiHandler.get(this.props["url"] + "/wp-json/pai/v2/frqs?what=categories", options),
                ApiHandler.get(this.props["url"] + "/wp-json/pai/v2/frqs?what=responses", options)
            ]);

            this.setState({
                loading: false,
                frqCategories: categories["data"],
                frqResponses: responses["data"],
                frqCategoriesColors: getBgColors(categories["data"])
            });
        }
    }

    async addNewCategory(category) {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (user) {
            this.setState({
                loading: true
            });
            const url = this.props["url"] + "/wp-json/pai/v2/frqs";
            const options = {
                headers: {
                    Authorization: "Bearer " + user["token"]
                }
            };
            const body = {
                what: "categories",
                action: "add",
                categories: [category]
            };
            const result = await ApiHandler.post(url, body, options);
            if (result["data"] > 0) {
                this.doFrqApiCalls();
            }
            else {
                this.setState({
                    loading: false
                });
            }
        }
    }

    async removeCategory(categoryKey) {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (user) {
            this.setState({
                loading: true
            });
            const url = this.props["url"] + "/wp-json/pai/v2/frqs";
            const options = {
                headers: {
                    Authorization: "Bearer " + user["token"]
                }
            };
            const body = {
                what: "categories",
                action: "remove",
                categories: [categoryKey]
            };

            const result = await ApiHandler.post(url, body, options);
            if (result["data"] > 0) {
                this.doFrqApiCalls();
            }
            else {
                this.setState({
                    loading: false
                });
            }
        }
    }

    async linkResponse(toApi, categoryKey) {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (user) {
            this.setState({
                loading: true
            });
            let responses = [];
            for (let i = 0; i < toApi.length; ++i) {
                responses.push({
                    surveyId: toApi[i]["surveyId"],
                    question: toApi[i]["question"],
                    categoryKey: categoryKey
                });
            }
            const url = this.props["url"] + "/wp-json/pai/v2/frqs";
            const options = {
                headers: {
                    Authorization: "Bearer " + user["token"]
                }
            };
            const body = {
                what: "responses",
                action: "add",
                responses: responses
            };
            const result = await ApiHandler.post(url, body, options);
            if (result["data"] > 0) {
                this.doFrqApiCalls();
            }
            else {
                this.setState({
                    loading: false
                });
            }
        }
    }

    async delinkResponse(toApi, categoryKey) {
        const user = JSON.parse(localStorage.getItem("USER"));
        if (user) {
            this.setState({
                loading: true
            });
            let responses = [];
            for (let i = 0; i < toApi.length; ++i) {
                responses.push({
                    surveyId: toApi[i]["surveyId"],
                    question: toApi[i]["question"],
                    categoryKey: categoryKey
                });
            }
            const url = this.props["url"] + "/wp-json/pai/v2/frqs";
            const options = {
                headers: {
                    Authorization: "Bearer " + user["token"]
                }
            };
            const body = {
                what: "responses",
                action: "remove",
                responses: responses
            };
            const result = await ApiHandler.post(url, body, options);
            if (result["data"] > 0) {
                this.doFrqApiCalls();
            }
            else {
                this.setState({
                    loading: false
                });
            }
        }
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
                            role={this.state["role"]}
                            portfolioChangeHandler={this.handlePortfolioChange}
                            courseChangeHandler={this.handleCourseChange}
                            startDateChangeHandler={this.handleStartDateChange}
                            endDateChangeHandler={this.handleEndDateChange}
                            groupChangeHandler={this.handleGroupChange}
                            orgChangeHandler={this.handleOrgChange}
                            roleChangeHandler={this.handleRoleChange}
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
                                <Row className={"margin-bot-30"}>
                                    <Col>
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
                                            role={this.state["role"]}
                                        />
                                    </Col>
                                </Row>
                                <Row className={"margin-bot-30"}>
                                    <Col sm={6}>
                                        <FrqChart
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
                                            role={this.state["role"]}
                                            categories={this.state["frqCategories"]}
                                            responses={this.state["frqResponses"]}
                                            question={"What aspects of the course did you find especially helpful"}
                                            colors={this.state["frqCategoriesColors"]}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <FrqChart
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
                                            role={this.state["role"]}
                                            categories={this.state["frqCategories"]}
                                            responses={this.state["frqResponses"]}
                                            question={"What aspects of the course would you like to see changed"}
                                            colors={this.state["frqCategoriesColors"]}
                                        />
                                    </Col>
                                </Row>
                                <Row className={"margin-bot-30"}>
                                    <Col sm={6}>
                                        <FrqChart
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
                                            role={this.state["role"]}
                                            categories={this.state["frqCategories"]}
                                            responses={this.state["frqResponses"]}
                                            question={"Application: We are interested in understanding how you applied the content"}
                                            colors={this.state["frqCategoriesColors"]}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <FrqChart
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
                                            role={this.state["role"]}
                                            categories={this.state["frqCategories"]}
                                            responses={this.state["frqResponses"]}
                                            question={"Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"}
                                            colors={this.state["frqCategoriesColors"]}
                                        />
                                    </Col>
                                </Row>
                                <Row className={"margin-bot-30"}>
                                    <Col sm={6}>
                                        <RatingGroupMeansChart
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
                                            role={this.state["role"]}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <RatingScoreMeansChart
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
                                            role={this.state["role"]}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId={"demographics"}>
                                <Demographics
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
                                    role={this.state["role"]}
                                />
                            </TabPane>
                            <TabPane tabId={"freeResponse"}>
                                <FreeResponseCategories
                                    loading={this.state["loading"]}
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
                                    role={this.state["role"]}
                                    categories={this.state["frqCategories"]}
                                    responses={this.state["frqResponses"]}
                                    newCategoryHandler={this.addNewCategory}
                                    removeCategoryHandler={this.removeCategory}
                                    linkResponseHandler={this.linkResponse}
                                    delinkResponseHandler={this.delinkResponse}
                                />
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </Container>
        );
    }
};

function getBgColors(categories) {
    let bgColors = [];
    for (let categoryKey in categories) {
        bgColors.push("rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")");
    }

    return bgColors;
}
