import React from "react";

import {Pie} from "react-chartjs-2";
import {Typography} from "@material-ui/core";

const RatingResultPie = (props) => {
    if (Object.keys(props["answerRates"]).length !== 0) {
        let labels = ["1", "2", "3", "4", "5"];
        let data = [0, 0, 0, 0, 0];
        if (props["portfolio"] === -1) {
            if (props["courseId"] === -1) {
                for (let portfolioKey in props["entries"]) {
                    for (let courseKey in props["entries"][portfolioKey]["courses"]) {
                        const courseResult = props["answerRates"][courseKey][props["question"]][props["choice"]];
                        for (let i = 0; i < courseResult.length; ++i) {
                            data[i] += courseResult[i];
                        }
                    }
                }
            }
        }

        else {
            if (props["courseId"] === -1) {
                for (let courseKey in props["entries"][props["portfolio"]]["courses"]) {
                    const courseResult = props["answerRates"][courseKey][props["question"]][props["choice"]];
                    for (let i = 0; i < courseResult.length; ++i) {
                        data[i] += courseResult[i];
                    }
                }
            }
            else {
                const courseResult = props["answerRates"][props["courseId"]][props["question"]][props["choice"]];
                for (let i = 0; i < courseResult.length; ++i) {
                    data[i] += courseResult[i];
                }
            }
        }

        return (
            <div>
                <Typography align={"center"} variant="h6">{props["question"] + " - " + props["choice"]}</Typography>
                <Pie
                    data={{
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: [
                        		'#FF5522',
                        		'#0176DD',
                        		'#FF54BC',
                                "#FABE06",
                                "#AA66E1"
                    		],
                    		hoverBackgroundColor: [
                                '#FF5522',
                        		'#0176DD',
                        		'#FF54BC',
                                "#FABE06",
                                "#AA66E1"
                    		]
                        }],
                    }}
                />
            </div>
        );
    }

    return (
        <div></div>
    );
}
export default RatingResultPie;
