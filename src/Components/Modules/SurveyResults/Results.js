import React from "react";

import {Row, Col} from "reactstrap";

import YesNoChart from "./Charts/YesNoChart";
import FrqChart from "./Charts/FrqChart";
import RatingGroupMeansChart from "./Charts/RatingGroupMeansChart";
import RatingScoreMeansChart from "./Charts/RatingScoreMeansChart";
import RatingChart from "./Charts/RatingChart";

export default class Results extends React.Component {
    render() {
        return (
            <div>
            <Row className={"margin-bot-30"}>
                <Col>
                    <YesNoChart
                        surveys={this.props["surveys"]}
                        portfolios={this.props["portfolios"]}
                        courses={this.props["courses"]}
                        groups={this.props["groups"]}
                        users={this.props["users"]}
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
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
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                        categories={this.props["frqCategories"]}
                        responses={this.props["frqResponses"]}
                        question={"What aspects of the course did you find especially helpful"}
                        colors={this.props["frqCategoriesColors"]}
                    />
                </Col>
                <Col sm={6}>
                    <FrqChart
                        surveys={this.props["surveys"]}
                        portfolios={this.props["portfolios"]}
                        courses={this.props["courses"]}
                        groups={this.props["groups"]}
                        users={this.props["users"]}
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                        categories={this.props["frqCategories"]}
                        responses={this.props["frqResponses"]}
                        question={"What aspects of the course would you like to see changed"}
                        colors={this.props["frqCategoriesColors"]}
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
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                        categories={this.props["frqCategories"]}
                        responses={this.props["frqResponses"]}
                        question={"Application: We are interested in understanding how you applied the content"}
                        colors={this.props["frqCategoriesColors"]}
                    />
                </Col>
                <Col sm={6}>
                    <FrqChart
                        surveys={this.props["surveys"]}
                        portfolios={this.props["portfolios"]}
                        courses={this.props["courses"]}
                        groups={this.props["groups"]}
                        users={this.props["users"]}
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                        categories={this.props["frqCategories"]}
                        responses={this.props["frqResponses"]}
                        question={"Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"}
                        colors={this.props["frqCategoriesColors"]}
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
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                    />
                </Col>
                <Col sm={6}>
                    <RatingScoreMeansChart
                        surveys={this.props["surveys"]}
                        portfolios={this.props["portfolios"]}
                        courses={this.props["courses"]}
                        groups={this.props["groups"]}
                        users={this.props["users"]}
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                    />
                </Col>
            </Row>
            <Row className={"margin-bot-30"}>
                <Col sm={4}>
                    <RatingChart
                        question={"Knowledge in this area"}
                        surveys={this.props["surveys"]}
                        portfolios={this.props["portfolios"]}
                        courses={this.props["courses"]}
                        groups={this.props["groups"]}
                        users={this.props["users"]}
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                    />
                </Col>
                <Col sm={4}>
                    <RatingChart
                        question={"Skills related to topic"}
                        surveys={this.props["surveys"]}
                        portfolios={this.props["portfolios"]}
                        courses={this.props["courses"]}
                        groups={this.props["groups"]}
                        users={this.props["users"]}
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                    />
                </Col>
                <Col sm={4}>
                    <RatingChart
                        question={"Confidence with topic"}
                        surveys={this.props["surveys"]}
                        portfolios={this.props["portfolios"]}
                        courses={this.props["courses"]}
                        groups={this.props["groups"]}
                        users={this.props["users"]}
                        portfolioId={this.props["portfolioId"]}
                        courseId={this.props["courseId"]}
                        startDate={this.props["startDate"]}
                        endDate={this.props["endDate"]}
                        groupId={this.props["groupId"]}
                        org={this.props["org"]}
                        role={this.props["role"]}
                    />
                </Col>
            </Row>
            </div>
        );
    }
};
