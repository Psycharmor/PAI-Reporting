import React from "react";

import {Pie} from "react-chartjs-2";
import {Typography, Hidden} from "@material-ui/core";

const CheckboxPie = (props) => {
    if (Object.keys(props["answerRates"]).length !== 0) {
        const labels = [
            "Interested in topic",
            "To improve performance",
            "Directed to take this course",
            "To earn Continuing Education Credit or Equiv",
            "Other"
        ];
        let resultCount = {
            "Interested in topic": 0,
            "To improve performance": 0,
            "Directed to take this course": 0,
            "To earn Continuing Education Credit or Equiv": 0,
            "Other": 0
        };
        if (props["portfolio"] === -1) {
            if (props["courseId"] === -1) {
                for (let portfolioKey in props["entries"]) {
                    for (let courseKey in props["entries"][portfolioKey]["courses"]) {
                        let questionResult = props["answerRates"][courseKey][props["question"]];
                        for (let question in questionResult) {
                            resultCount[question] += questionResult[question];
                        }
                    }
                }
            }
        }

        else {
            if (props["courseId"] === -1) {
                for (let courseKey in props["entries"][props["portfolio"]]["courses"]) {
                    let questionResult = props["answerRates"][courseKey][props["question"]];
                    for (let question in questionResult) {
                        resultCount[question] += questionResult[question];
                    }
                }
            }

            else {
                let questionResult = props["answerRates"][props["courseId"]][props["question"]];
                for (let question in questionResult) {
                    resultCount[question] += questionResult[question];
                }
            }
        }

        const data = {
            labels: labels,
            datasets: [{
                data: Object.values(resultCount),
                backgroundColor: [
                    '#FFDD00',
                    '#AA33CB',
                    '#FF9923',
                    "#44DDFF",
                    "#006599"
                ],
                hoverBackgroundColor: [
                    '#FFDD00',
                    '#AA33CB',
                    '#FF9923',
                    "#44DDFF",
                    "#006599"
                ]
            }]
        };

        return (
            <div>
                <Hidden smUp implementation="css">
                    <Typography align={"center"} variant="subtitle2">{props["question"]}</Typography>
                    <Pie
                        height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                        width={null}
                        data={data}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            aspectRatio: 1,
                            legend: {
                                align: "start",
                                labels: {
                                    boxWidth: 10
                                }
                            }
                        }}
                    />
                </Hidden>
                <Hidden only={["xs", "lg", "xl"]} implementation="css">
                    <Typography align={"center"} variant="subtitle2">{props["question"]}</Typography>
                    <Pie
                        height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                        width={null}
                        data={data}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            aspectRatio: 1
                        }}
                    />
                </Hidden>
                <Hidden mdDown implementation="css">
                    <Typography align={"center"} variant="subtitle2">{props["question"]}</Typography>
                    <Pie
                        height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                        width={null}
                        data={data}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            aspectRatio: 2,
                            legend: {
                                position: "right"
                            }
                        }}
                    />
                </Hidden>
            </div>
        );
    }

    return (
        <div></div>
    );
}
export default CheckboxPie;
