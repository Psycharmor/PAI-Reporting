import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Bar} from "react-chartjs-2";

import SurveyResultsFunctions from "../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default function RatingChart(props) {
    const labels = getLabels();
    const data = SurveyResultsFunctions.getRatingData(props);

    return (
        <Card>
            <CardHeader>
                <h3>{props["question"]}</h3>
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
                                "#11cdef",
                                "#11cdef"
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
        "Pre",
        "Post"
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
                return +(value.toFixed(2));
            }
        }
    }
};
