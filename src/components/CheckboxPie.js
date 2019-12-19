import React from "react";

import {Pie} from "react-chartjs-2";
import {Typography} from "@material-ui/core";

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

        return (
            <div>
                <Typography align={"center"} variant="h6">{props["question"]}</Typography>
                <Pie
                    data={{
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
                    }}
                />
            </div>
        );
    }

    return (
        <div></div>
    );
}
export default CheckboxPie;
