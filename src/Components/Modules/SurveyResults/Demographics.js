import React from "react";

import {Card, CardHeader} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import SurveyResultsFunctions from "../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default function Demographics(props) {
    const headers = getHeaders();
    const data = SurveyResultsFunctions.getDemographicsData(props);

    return (
        <Card className={"table-card"}>
            <CardHeader>
                <h3>{"User Demographics"}</h3>
                <p>{"All users who have submitted a survey response"}</p>
            </CardHeader>
            <BootstrapTable
                bootstrap4={true}
                wrapperClasses={"table-responsive"}
                keyField={"email"}
                columns={headers}
                data={data}
                bordered={false}
                pagination={paginationFactory({
                    showTotal: true,
                    alwaysShowAllBtns: true,
                    sizePerPageList: [10, 50, 100, 200, 500]
                })}
            />
        </Card>
    );
};

const headerStyle = {
    padding: "0.75rem 1.5rem",
    borderBottom: "1px solid #E9ECEF",
    verticalAlign: "top",
    backgroundColor: "#F6F9FC",
    color: "#292A2B",
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    width: 210
};
const cellStyle = {
    padding: "1rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    verticalAlign: "top",
    fontSize: "0.8125rem",
    borderTop: "1px solid #E9ECEF",
    backgroundColor: "#FFFFFF",
    color: "#525F7F"
};

function getHeaders() {
    let headers = [
        {text: "First Name", dataField: "firstName"},
        {text: "Last Name", dataField: "lastName"},
        {text: "Email", dataField: "email"},
        {text: "Team", dataField: "team"},
        {text: "Organization", dataField: "organization"},
        {text: "Role With Veterans", dataField: "roleWithVeterans"},
        {text: "Courses Completed", dataField: "courseCompletionCount"},
        {text: "Referral Source", dataField: "referralSource"}
    ];
    for (let i = 0; i < headers.length; ++i) {
        headers[i]["sort"] = true;
        headers[i]["headerStyle"] = headerStyle;
        headers[i]["style"] = cellStyle;
    }

    return headers;
}
