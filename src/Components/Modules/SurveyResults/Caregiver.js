import React from "react";

import {Row, Col} from "reactstrap";

import YesNoChart from "./Charts/Caregiver/YesNoChart";
import FrqChart from "./Charts/Caregiver/FrqChart";
import UtilityFunctions from "../../../Lib/UtilityFunctions";
import CaregiverMultiBarChart from "./Charts/Caregiver/MultiBarChart";
import CaregiverBarChart from "./Charts/Caregiver/BarChart";
import CaregiverAllResponses from "./Charts/Caregiver/AllResponses";

import RatingGroupMeansChart from "./Charts/RatingGroupMeansChart";
import RatingScoreMeansChart from "./Charts/RatingScoreMeansChart";
import RatingChart from "./Charts/RatingChart";

// import RatingGroupMeansChart from "./Charts/RatingGroupMeansChart";
// import RatingScoreMeansChart from "./Charts/RatingScoreMeansChart";
// import RatingChart from "./Charts/RatingChart";


const caregiverFreqLabels = [
    "Strongly Agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly Disagree",
];

export default class Caregiver extends React.Component {
    render() {
        const frqColors = UtilityFunctions.getBgColors(caregiverFreqLabels);
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
            <Row className='margin-bot-30'>
                <Col sm={6}>
                    <CaregiverMultiBarChart
                        {...this.props}
                        question='What is your relationship to the Service member or Veteran that you are caring for (select all that apply)?'
                        labels={['Spouse/Significant Other', 'Parent', 'Sibling', 'Child', 'Friend', 'Other', 'I am not a caregiver']}
                    />
                </Col>
                <Col sm={6}>
                    <CaregiverAllResponses {...this.props} question="Other: Enter your'e relationship"/>
                </Col>
            </Row>
            <Row className={"margin-bot-30"}>
                <Col sm={6}>
                    <FrqChart {...this.props} colors={frqColors} labels={caregiverFreqLabels} question={"I feel supported after taking PsychArmor courses."} />
                </Col>
                <Col sm={6}>
                    <FrqChart {...this.props} colors={frqColors} labels={caregiverFreqLabels} question={"I feel more confident after taking PsychArmor courses."} />
                </Col>
            </Row>
            <Row className={"margin-bot-30"}>
                <Col sm={6}>
                    <CaregiverAllResponses {...this.props} question='Why not?'/>
                </Col>
                <Col sm={6}>
                    <CaregiverBarChart {...this.props} question='What part of the binder have you found most useful?' labels={['Calendar', 'Notes pages', 'Important Documents list and sleeve', 'Tips and Takeaways sheets from PsychArmor courses', 'Resources']} />
                </Col>
            </Row>
            <Row className={"margin-bot-30"}>
                <Col sm={6}>
                    <FrqChart {...this.props} colors={frqColors} labels={caregiverFreqLabels} question={"I feel supported as a caregiver after receiving a Caregiver Experience binder."} />
                </Col>
                <Col sm={6}>
                    <FrqChart {...this.props} colors={frqColors} labels={caregiverFreqLabels} question={"I feel more confident in my role as a caregiver after receiving the Caregiver Experience binder."} />
                </Col>
            </Row>
            <Row className={"margin-bot-30"}>
                <Col sm={6}>
                    <CaregiverAllResponses {...this.props} question='Is there anything else you think we can add to the binders to make them more supportive to your need.'/>
                </Col>
                <Col sm={6}>
                    <CaregiverAllResponses {...this.props} question='Why would you encourage other Caregivers to earn this award?'/>
                </Col>
            </Row>
            <Row className='margin-bot-30'>
                <Col sm={6}>
                    <FrqChart {...this.props} colors={frqColors} labels={caregiverFreqLabels} question={"My experience with PsychArmor has helped me feel more connected to resources."} />
                </Col>
            </Row>
            </div>
        );
    }
};
