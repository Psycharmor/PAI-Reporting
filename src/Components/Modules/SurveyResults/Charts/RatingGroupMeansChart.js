import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Bar} from "react-chartjs-2";

import SurveyResultsFunctions from "../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default function RatingGroupMeansChart(props) {
    const labels = getLabels();
    const data = SurveyResultsFunctions.getRatingGroupMeansData(props, labels);

    return (
        <Card>
            <CardHeader>
                <h3>{"Pre and Post Ratings"}</h3>
                <p>{"Difference between group means"}</p>
            </CardHeader>
            <CardBody className={"chart-card-body"}>
                <Bar
                    height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                    width={null}
                    data={{
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: [
                                "#5e72e4",
                                "#11cdef",
                                "#2dce89"
                            ]
                        }]
                    }}
                    options={options}
                />
            </CardBody>
        </Card>
    );
};

function getLabels() {
    return [
        "Knowledge in this area",
        "Skills related to topic",
        "Confidence with topic"
    ];
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: false,
    scales: {
        xAxes: [{
            ticks: {
                fontFamily: "open sans, sans-serif"
            },
            gridLines: {
                display: false
            }
        }],
        yAxes: [{
            ticks: {
                fontFamily: "open sans, sans-serif",
                min: 0
            }
        }]
    },
    plugins: {
        datalabels: {
            color: "#000000",
            font: {
                family: "open sans, sans-serif",
                weight: 600
            },
            anchor: "end",
            align: "end",
            formatter: function(value, context) {
                return (+(value * 100).toFixed(2)) + "%";
            }
        }
    }
};
