import React from "react";

import GroupSummary from "./GroupSummary";
import CourseSummary from "./CourseSummary";
import UserSummary from "./UserSummary";

class Summary extends React.Component {
    render() {
        let summary;
        switch(this.props.dashboardState.currentWindow) {
            case "groupSummary":
                summary = <GroupSummary groupInfo={this.props.dashboardState.groupInfo}/>;
                break;
            case "courseSummary":
                summary = <CourseSummary courseInfo={this.props.dashboardState.courseWindow}/>
                break;
            case "userSummary":
                summary = <UserSummary userInfo={this.props.dashboardState.userWindow}/>
                break;
            default:
        }

        return(
            <div className="summary">
                {summary}
            </div>
        );
    }
}
export default Summary;
