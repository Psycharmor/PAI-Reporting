import React from "react";

import {CSVLink} from "react-csv";
import {FaFileDownload} from "react-icons/fa";

import SurveyResultsFunctions from "../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default function ReportExportBtn(props) {
    const data = SurveyResultsFunctions.createExportData(props);
    return (
        <CSVLink
            className={"btn pai-btn survey-action-btn"}
            data={data}
            filename={"psycharmor-survey-report-" + Math.floor(Date.now() / 1000) + ".csv"}
            target={"_blank"}
            rel={"noopener noreferrer"}
        >
            <FaFileDownload/>
        </CSVLink>
    );
}
