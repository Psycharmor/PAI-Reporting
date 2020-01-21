import React from "react";

import {Card, CardHeader} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

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

export default function UserDemographicsTable(props) {
    const columns = [
        {text: "First Name", dataField: "firstName", sort: true, headerStyle: headerStyle, style: cellStyle},
        {text: "Last Name", dataField: "lastName", sort: true, headerStyle: headerStyle, style: cellStyle},
        {text: "Email", dataField: "email", sort: true, headerStyle: headerStyle, style: cellStyle},
        {text: "Team", dataField: "team", sort: true, headerStyle: headerStyle, style: cellStyle},
        {text: "Organization", dataField: "organization", sort: true, headerStyle: headerStyle, style: cellStyle},
        {text: "Role With Veterans", dataField: "roleWithVeterans", sort: true, headerStyle: headerStyle, style: cellStyle},
        {text: "Courses Completed", dataField: "courseCompleteCount", sort: true, headerStyle: headerStyle, style: cellStyle},
        {text: "Referral Source", dataField: "refferalSource", sort: true, headerStyle: headerStyle, style: cellStyle}
    ];
    const data = getTableData(
        props["surveyEntries"], props["portfolioId"], props["courseId"], props["startDate"], props["endDate"]);

    return (
        <Card className={"table-card"}>
            <CardHeader>
                <h3>{"User Demographics"}</h3>
                <p>{"All users who have done a survey"}</p>
            </CardHeader>
            <BootstrapTable
                bootstrap4={true}
                wrapperClasses={"table-responsive"}
                keyField={"email"}
                columns={columns}
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

/*
    Get the data that will be sent to the user demographics table
    Params:
        entries      -> (object) the survey entries
        pPortfolioId -> (int) the portfolio id
        pCourseId    -> (int) the course id
        startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
    Return:
        object -> a list of table data that contains user demographics
*/
function getTableData(entries, pPortfolioId, pCourseId, startDate, endDate) {
    let data = {};
    if ((pPortfolioId === 0) && (pCourseId === 0)) {
        for (let portfolioId in entries) {
            for (let courseId in entries[portfolioId]["courses"]) {
                getResultsData(data, entries, portfolioId, courseId, startDate, endDate);
            }
        }
    }
    else {
        if (pCourseId === 0) {
            for (let courseId in entries[pPortfolioId]["courses"]) {
                getResultsData(data, entries, pPortfolioId, courseId, startDate, endDate);
            }
        }
        else {
            getResultsData(data, entries, pPortfolioId, pCourseId, startDate, endDate);
        }
    }

    return Object.values(data);
}

/*
    Get all the users' demographics given the course id
    Params:
        startDate     -> (int) the timestamp in seconds to start filtering for entries (inclusive)
        endDate       -> (int) the timestamp in seconds to stop filtering for entries (inclusive)
    Return:
        undefined
*/
function getResultsData(data, entries, portfolioId, courseId, startDate, endDate) {
    const courseEntry = entries[portfolioId]["courses"][courseId]["entries"];
    for (let i = 0; i < courseEntry.length; ++i) {
        const entry = courseEntry[i];
        const submitted = entry["dateSubmitted"];
        if ((submitted >= startDate) && (submitted <= endDate)) {
            if (!(entry["userId"] in data)) {
                data[entry["userId"]] = {
                    email: entry["email"],
                    firstName: entry["firstName"],
                    lastName: entry["lastName"],
                    organization: entry["organization"],
                    roleWithVeterans: entry["roleWithVeterans"],
                    refferalSource: entry["refferalSource"],
                    courseCompleteCount: entry["courseCompleteCount"],
                    team: entry["team"]
                };
            }
        }
    }
}
