import React from "react";

import ContentDashboard from "./ContentDashboard";
import ContentUpdate from "./ContentUpdate";

const Content = (props) => {

    const classes = props["styles"];
    const tableData = props["menus"][props["view"]];

    let content = [];
    switch(props["view"]) {
        case "dashboard":
            content = (
                <ContentDashboard
                    tableData={tableData}
                    groupChangeHandler={props["groupChangeHandler"]}
                    groupId={props["groupId"]}
                />
            );
            break;
        case "update":
            content = (
                <ContentUpdate
                    userUploadHandler={props["userUploadHandler"]}
                    batchProgress={props["batchProgress"]}
                    groupInfo={props["groupInfo"]}
                    loading={props["loading"]}
                    doneSoFar={props["doneSoFar"]}
                    totalNeeded={props["totalNeeded"]}
                />
            );
            break;
        default:
    }

    return (
        <main className={classes["content"]}>
            <div className={classes["toolbar"]}/>
            {content}
        </main>
    );
};
export default Content;
