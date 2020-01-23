import React from "react";

import {TabPane, Row, Col} from "reactstrap";

import YesNoBarGraph from "./Charts/YesNoBarGraph";
import MultChoicePieChart from "./Charts/MultChoicePieChart";
import BeforeNowBarGraph from "./Charts/BeforeNowBarGraph";
import FrqPieChart from "./Charts/FrqPieChart";

/*
    Component renders the survey results content
*/
export default function SurveyResults(props) {
    if (Object.keys(props["results"]).length > 0) {
        return (
            <TabPane tabId={"results"}>
                {renderYesNoGraph(props["results"], props["portfolioId"], props["courseId"])}
            </TabPane>
        );
        // return (
        //     <TabPane tabId={"results"}>
        //         {renderYesNoGraph(props["results"], props["portfolioId"], props["courseId"])}
        //         {renderMultScaleGraphs(props["results"], props["portfolioId"], props["courseId"])}
        //         {renderFrqCharts(props["results"], props["portfolioId"], props["courseId"])}
        //     </TabPane>
        // );
    }

    return (<div></div>);
};

/*
    Render the Yes/No Graph section of the survey results view
    Params:
        results     -> (object) all the survey results with question as keys
        portfolioId -> (int) the id of the school/portfolio
        courseId    -> (int) the id of the course
    Return:
        JSX -> The elements to render onto the browser
*/
function renderYesNoGraph(results, portfolioId, courseId) {
    return (
        <Row className={"survey-row-margin"}>
            <Col>
                <YesNoBarGraph
                    questions={[
                        "I learned something new as a result of this training.",
                        "The information presented was relevant to my goals.",
                        "After taking this course, I will use what I learned.",
                        "I would recommend PsychArmor training to someone else.",
                        "Would you participate in more detailed evaluation?"
                    ]}
                    results={results}
                    portfolioId={portfolioId}
                    courseId={courseId}
                />
            </Col>
        </Row>
    );
}

/*
    Render the multiple choice pie chart and the 1-5 scale bar graph on the
    same row
    Params:
        results     -> (object) all the survey results with question as keys
        portfolioId -> (int) the id of the school/portfolio
        courseId    -> (int) the id of the course
    Return:
        JSX -> The elements to render onto the browser
*/
function renderMultScaleGraphs(results, portfolioId, courseId) {
    return (
        <Row className={"survey-row-margin"}>
            <Col xs={12} xl={6}>
                <MultChoicePieChart
                    question={"Why did you take this course?"}
                    results={results}
                    portfolioId={portfolioId}
                    courseId={courseId}
                />
            </Col>
            <Col xs={12} xl={6}>
                <BeforeNowBarGraph
                    questions={[
                        "Knowledge in this area",
                        "Skills related to topic",
                        "Confidence with topic"
                    ]}
                    results={results}
                    portfolioId={portfolioId}
                    courseId={courseId}
                />
            </Col>
        </Row>
    );
}

/*
    Render the Free Response Graphs 2 per row
    same row
    Params:
        results     -> (object) all the survey results with question as keys
        portfolioId -> (int) the id of the school/portfolio
        courseId    -> (int) the id of the course
    Return:
        JSX -> The elements to render onto the browser
*/
function renderFrqCharts(results, portfolioId, courseId) {
    return (
        <>
            <Row className={"survey-row-margin"}>
                <Col xs={12} xl={6}>
                    <FrqPieChart
                        question={"What aspects of the course did you find especially helpful"}
                        results={results}
                        portfolioId={portfolioId}
                        courseId={courseId}
                    />
                </Col>
                <Col xs={12} xl={6}>
                    <FrqPieChart
                        question={"What aspects of the course would you like to see changed"}
                        results={results}
                        portfolioId={portfolioId}
                        courseId={courseId}
                    />
                </Col>
            </Row>
            <Row className={"survey-row-margin"}>
                <Col xs={12} xl={6}>
                    <FrqPieChart
                        question={"Application: We are interested in understanding how you applied the content"}
                        results={results}
                        portfolioId={portfolioId}
                        courseId={courseId}
                    />
                </Col>
                <Col xs={12} xl={6}>
                    <FrqPieChart
                        question={"Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"}
                        results={results}
                        portfolioId={portfolioId}
                        courseId={courseId}
                    />
                </Col>
            </Row>
        </>
    );
}
