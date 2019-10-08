import React from "react";

import GroupSummary from "./GroupSummary";
import CourseSummary from "./CourseSummary";
import UserSummary from "./UserSummary";

class Summary extends React.Component {
    render() {
        let summary = this.renderSummary();

        return(
            <div className="summary">
                {summary}
            </div>
        );
    }

    renderSummary() {
        switch(this.props.dashboardState.currentWindow) {
            case "groupSummary":
                return <GroupSummary
                            groupInfo={this.props.dashboardState.groupInfo}
                            courses={this.props.dashboardState.groupCourses}
                            activities={this.props.dashboardState.groupCourseActivities}
                        />;
            case "courseSummary":
                return <CourseSummary
                            course={this.props.dashboardState.courseWindow}
                            users={this.props.dashboardState.groupUsers}
                            activities={this.props.dashboardState.groupCourseActivities}
                        />;
            case "userSummary":
                return <UserSummary
                            user={this.props.dashboardState.userWindow}
                            courses={this.props.dashboardState.groupCourses}
                            activities={this.props.dashboardState.groupCourseActivities}
                        />
            default:
        }
    }
}
export default Summary;
