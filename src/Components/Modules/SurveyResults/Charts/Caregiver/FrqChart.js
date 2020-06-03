import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Pie} from "react-chartjs-2";

import SurveyResultsFunctions from "../../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

const getTotals = (data) => {
    let totalScore = 0, totalRespondents = 0;
    data.forEach((score, index) => {
        totalRespondents += score;
        totalScore += score * (5 - index);
    });
    const average = (totalScore / totalRespondents).toFixed(2);
    return { average, respondents: totalRespondents };
}

export default function FrqChart(props) {
    const data = SurveyResultsFunctions.getCaregiverFrqChartData(props);
    const { average, respondents } = getTotals(data);
    return (
        <Card className='padding-bot-50'>
            <CardHeader>
                <h3>{"Multi Response Results"}</h3>
                <p>{props["question"]}</p>
            </CardHeader>
            <CardBody className={"chart-card-body"}>
                <Pie
                    height={null}
                    width={null}
                    data={{
                        labels: props.labels,
                        datasets: [{
                            data: data,
                            backgroundColor: props.colors,
                        }]
                    }}
                    options={options}
                />
                <div>Average Score: {average}</div>
                <div>Total Respondents: {respondents}</div>
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
