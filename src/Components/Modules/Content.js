import React from "react";

import TeamReport from "./TeamReport/TeamReport";
import SurveyResults from "./SurveyResults/SurveyResults";

export default function Content(props) {
    const content = getContent(props);

    return (
        <div className={"view-content"}>
            {content}
        </div>
    );
};

function getContent(props) {
    switch (props["view"]) {
        case "teamReport":
            return (
                <TeamReport
                    groups={props["groups"]}
                    users={props["users"]}
                    courses={props["courses"]}
                    portfolios={props["portfolios"]}
                    activities={props["activities"]}
                />
            );
        case "surveyResults":
            return (
                <SurveyResults
                    groups={props["groups"]}
                    users={props["users"]}
                    courses={props["courses"]}
                    portfolios={props["portfolios"]}
                    activities={props["activities"]}
                    surveys={props["surveys"]}
                    url={props["url"]}
                />
            );
        default:
    }
}
