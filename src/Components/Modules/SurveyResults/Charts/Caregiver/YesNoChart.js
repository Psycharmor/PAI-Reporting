import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {HorizontalBar} from "react-chartjs-2";
import "chartjs-plugin-datalabels";

import SurveyResultsFunctions from "../../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default function YesNoChart(props) {


    const labels = getCaregiverLabels();

    const datasets = SurveyResultsFunctions.getYesNoData(props, labels);
    const chartMax = getChartMax(getMaxTotalData(datasets));
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontFamily: "open sans, sans-serif"
            }
        },
        scales: {
            xAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: "open sans, sans-serif",
                    suggestedMax: chartMax
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: "open sans, sans-serif"
                },
                gridLines: {
                    display: false
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
                display: function(content) {
                    const datasetIndex = content["datasetIndex"];
                    if (datasetIndex === 0) {
                        return !content["chart"].isDatasetVisible(1);
                    }

                    return content["chart"].isDatasetVisible(1);
                },
                formatter: function(value, context) {
                    const dataIndex = context["dataIndex"];
                    const yesValue = datasets[0]["data"][dataIndex];
                    const noValue = datasets[1]["data"][dataIndex];
                    const total = yesValue + noValue;
                    if (total === 0) {
                        return "0% / 0%";
                    }
                    const yesPercent = (+(yesValue / total * 100).toFixed(2)) + "%";
                    const noPercent = (+(noValue / total * 100).toFixed(2)) + "%";
                    return yesPercent + " / " + noPercent;
                }
            }
        }
    }
    return (
        <Card>
            <CardHeader>
                <h3>{"Yes & No Responses"}</h3>
                <p>{"Results of the questions that are answered Yes or No"}</p>
            </CardHeader>
            <CardBody className={"chart-card-body"}>
                <HorizontalBar
                    height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                    width={null}
                    data={{
                        labels: labels,
                        datasets: datasets
                    }}
                    options={options}
                />
            </CardBody>
        </Card>
    );
};


function getCaregiverLabels (){

  return [
      /// caregiver
      "Have you received our Caregiver Experience binder?",
      "Have you used your Caregiver Experience binder since receiving it?",
      "Have you printed or read any additional Tips & Takeaways?",
      "Have you received our Caregiver Recognition Award in partnership with Hidden Heroes?"
  ];

}


function getMaxTotalData(datasets) {
    let max = 0;
    const data = datasets[0]["data"];
    const otherData = datasets[1]["data"];
    for (let i = 0; i < data.length; ++i) {
        const dataMax = data[i] + otherData[i];
        if (dataMax > max) {
            max = dataMax;
        }
    }

    return max;
}

function getChartMax(dataMax) {
    let placeValue = 1;
    for (let i = 0; i < dataMax.toString().length - 1; ++i) {
        placeValue *= 10;
    }

    return Math.min(dataMax + 1000, Math.ceil(dataMax / placeValue) * placeValue + placeValue / 2);
}
