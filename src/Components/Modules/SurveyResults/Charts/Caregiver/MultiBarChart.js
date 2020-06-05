import React from 'react';
import { Card, CardHeader, CardBody } from "reactstrap";
import { HorizontalBar } from "react-chartjs-2";
import UtilityFunctions from '../../../../../Lib/UtilityFunctions';
import SurveyResultsFunctions from "../../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

const CaregiverMultiBarChart = (props) => {
  const { question, labels } = props;
  const data = SurveyResultsFunctions.getCaregiverMultiBarChartData(props);
  return (
    <Card>
      <CardHeader>
        <h3>Bar Chart</h3>
        <p>{question}</p>
      </CardHeader>
      <CardBody className={"chart-card-body"}>
        <HorizontalBar
          height={null}
          width={null}
          data={{
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: UtilityFunctions.getBgColors(labels)
            }]
          }}
          options={options}
        />
      </CardBody>
    </Card>
  )
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: false,
  tooltips: {
      enabled: true,
      // callbacks: {
      //     afterLabel: (tooltipItem, tableData) => {
      //         const index = tooltipItem["index"];

      //         return [
      //             "Total Users: " + data[index]["userCount"]
      //         ];
      //     }
      // }
  },
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

export default CaregiverMultiBarChart;