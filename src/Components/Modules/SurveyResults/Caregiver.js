import React from "react";

import {Row, Col} from "reactstrap";

import YesNoChart from "./Charts/Caregiver/YesNoChart";
import FrqChart from "./Charts/Caregiver/FrqChart";
// import RatingGroupMeansChart from "./Charts/RatingGroupMeansChart";
// import RatingScoreMeansChart from "./Charts/RatingScoreMeansChart";
// import RatingChart from "./Charts/RatingChart";

export default class Caregiver extends React.Component {
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

                        question={"I feel supported after taking PsychArmor courses."}
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

                        question={"I feel more confident after taking PsychArmor courses"}
                        colors={this.props["frqCategoriesColors"]}
                    />
                </Col>
            </Row>
            </div>
        );
    }
};
