import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Pie} from "react-chartjs-2";

import SurveyResultsFunctions from "../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default function FrqChart(props) {
    const labels = SurveyResultsFunctions.getFrqChartLabels(props["categories"]);
    const data = SurveyResultsFunctions.getFrqChartData(props, props["question"], labels);
    return (
        <Card>
            <CardHeader>
                <h3>{"Free Response Results"}</h3>
                <p>{props["question"]}</p>
            </CardHeader>
            <CardBody className={"chart-card-body"}>
                <Pie
                    height={null}
                    width={null}
                    data={{
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: props["colors"]
                        }]
                    }}
                    options={options}
                />
            </CardBody>
        </Card>
    );
};

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
