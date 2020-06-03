import React from 'react';
import { Card, CardHeader, CardBody, Table } from "reactstrap";
import SurveyResultsFunctions from "../../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

const CaregiverAllResponses = props => {
  const { question } = props;
  const responses = SurveyResultsFunctions.getAllCaregiverResponses(props);
  return (
  <Card>
    <CardHeader>
      <h3>All Responses</h3>
      <p>{question}</p>
    </CardHeader>
    <CardBody style={{ overflowY: 'scroll' }} className={"chart-card-body"}>
      <Table>
        <tbody>
          {responses.length === 0 && 'No responses for this question.'}
          {responses.map((response, index) => <tr key={index}><td>{response}</td></tr>)}
        </tbody>
      </Table>
    </CardBody>
  </Card>
  );
};

export default CaregiverAllResponses;