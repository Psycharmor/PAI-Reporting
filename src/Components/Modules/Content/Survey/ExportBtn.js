import React from "react";

import {CSVLink} from "react-csv";
import moment from "moment";

import SurveyFunctions from "../../../../Lib/Content/Survey/SurveyFunctions";

export default function ExportBtn(props) {
    const csvData = createCsvData(
        props["surveyEntries"], props["portfolioId"], props["courseId"], props["filters"]);

    return (
        <CSVLink
            className={"btn pa-btn"}
            data={csvData}
            filename={"pai-survey-report-" + Math.floor(Date.now() / 1000) + ".csv"}
            target={"_blank"}
            rel={"noopener noreferrer"}
        >
            {"Download Results"}
        </CSVLink>
    );
};

/*
    Create the data that will be given to the csv creator
    Params:
        surveyEntries -> (object) all the user entries obtained from the api
        pPortfolioId  -> (int) the portfolio id
        pCourseId     -> (int) the course id
        filters -> (object) all the additional filters
*/
function createCsvData(surveyEntries, pPortfolioId, pCourseId, filters) {
    let csvData = [
        ["Date Submitted",
         "First Name",
         "Last Name",
         "Email",
         "Team",
         "Organization",
         "Role With Veterans",
         "Courses Completed",
         "Referral Source",
         "I learned something new as a result of this training",
         "The information presented was relevant to my goals",
         "After taking this course, I will use what I learned",
         "I would recommend PsychArmor training to someone else",
         "Would you participate in more detailed evaluation",
         "Why did you take this course",
         "What aspects of the course did you find especially helpful",
         "What aspects of the course would you like to see changed",
         "Knowledge in this area - Before", "Knowledge in this area - Now",
         "Skills related to topic - Before", "Skills related to topic - Now",
         "Confidence with topic - Before", "Confidence with topic - Now",
         "Application: We are interested in understanding how you applied the content",
         "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions"
        ]
    ];
    if ((pPortfolioId === 0) && (pCourseId === 0)) {
        for (let portfolioId in surveyEntries) {
            for (let courseId in surveyEntries[portfolioId]["courses"]) {
                getData(csvData, surveyEntries[portfolioId]["courses"][courseId]["entries"], filters);
            }
        }
    }
    else {
        if (pCourseId === 0) {
            for (let courseId in surveyEntries[pPortfolioId]["courses"]) {
                getData(csvData, surveyEntries[pPortfolioId]["courses"][courseId]["entries"], filters);
            }
        }
        else {
            getData(csvData, surveyEntries[pPortfolioId]["courses"][pCourseId]["entries"], filters);
        }
    }

    return csvData;
}

/*
    Get the data from entries and give it to csvData
    Params:
        csvData  -> (array) the data that will be sent to the csv file
        entries  -> (array) all the survey submissions
        filters -> (object) all the additional filters
*/
function getData(csvData, entries, filters) {
    for (let i = 0; i < entries.length; ++i) {
        const entry = entries[i];
        if (SurveyFunctions.entryPassesFilters(entry, filters)) {
            csvData.push(createRow(entry));
        }
    }
}

/*
    Create a row for the csv which will contain the entry's user demographics
    and their results
    Params:
        entry -> (object) the survey result entry
    Return:
        array -> info that will serve as the row to be created
*/
function createRow(entry) {
    return [
        moment(new Date(entry["dateSubmitted"] * 1000)).format("MMM DD, YYYY"),
        entry["firstName"],
        entry["lastName"],
        entry["email"],
        entry["team"],
        entry["organization"],
        entry["roleWithVeterans"],
        entry["courseCompleteCount"],
        entry["refferalSource"],
        entry["results"]["I learned something new as a result of this training."],
        entry["results"]["The information presented was relevant to my goals."],
        entry["results"]["After taking this course, I will use what I learned."],
        entry["results"]["I would recommend PsychArmor training to someone else."],
        entry["results"]["I learned something new as a result of this training."],
        entry["results"]["Would you participate in more detailed evaluation?"] || "",
        entry["results"]["What aspects of the course did you find especially helpful"],
        entry["results"]["What aspects of the course would you like to see changed"],
        entry["results"]["Knowledge in this area"]["before"],
        entry["results"]["Knowledge in this area"]["now"],
        entry["results"]["Skills related to topic"]["before"],
        entry["results"]["Skills related to topic"]["now"],
        entry["results"]["Confidence with topic"]["before"],
        entry["results"]["Confidence with topic"]["now"],
        entry["results"]["Application: We are interested in understanding how you applied the content"],
        entry["results"]["Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"]
    ];
}
