import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Pie} from "react-chartjs-2";

import Dropdown from "../../../Forms/Dropdown";
import SurveyResultsFunctions from "../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default class FrqChart extends React.Component {
    constructor(props) {
        super(props);

        this.questions = [
            "What aspects of the course did you find especially helpful",
            "What aspects of the course would you like to see changed",
            "Application: We are interested in understanding how you applied the content",
            "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"
        ];

        this.state = {
            question: "0"
        };

        this.handleQuestionChange = this.handleQuestionChange.bind(this);
    }

    handleQuestionChange(event) {
        this.setState({
            question: event.target["value"]
        });
    }

    render() {
        const labels = SurveyResultsFunctions.getFrqChartLabels(this.props["categories"]);
        const data = SurveyResultsFunctions.getFrqChartData(this.props, this.state["question"], this.questions, labels);
        const bgColors = getBgColors(data);
        return (
            <Card>
                <CardHeader>
                    <h3>{"Free Response Results"}</h3>
                    <p>{"Results of the Fill-in-the-blank questions grouped by categories"}</p>
                    <div className={"margin-top-15"}>
                        <Dropdown
                            value={this.props["question"]}
                            optionPairs={createQuestionOptions(this.questions)}
                            onChangeHandler={this.handleQuestionChange}
                        />
                    </div>
                </CardHeader>
                <CardBody className={"chart-card-body"}>
                    <Pie
                        height={null}
                        width={null}
                        data={{
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: bgColors
                            }]
                        }}
                        options={options}
                    />
                </CardBody>
            </Card>
        );
    }
};

function createQuestionOptions(questions) {
    let options = [{
        label: "All Questions",
        value: "0",
        key: "0"
    }];

    for (let i = 0; i < questions.length; ++i) {
        options.push({
            label: questions[i],
            value: questions[i],
            key: questions[i]
        });
    }

    return options;
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        position: "right",
        labels: {
            boxWidth: 10,
            fontFamily: "open sans, sans-serif"
        }
    },
    plugins: {
        datalabels: {
            display: false
        }
    }
};

function getBgColors(data) {
    let bgColors = [];
    for (let i = 0; i < data.length; ++i) {
        bgColors.push("rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")");
    }

    return bgColors;
}
