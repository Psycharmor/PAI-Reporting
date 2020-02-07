import React from "react";

import TeamReport from "./TeamReport/TeamReport";

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
        default:
    }
}
