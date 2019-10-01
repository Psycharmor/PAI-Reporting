import React from 'react';

import CourseTable from "./CourseTable";
import CourseUsersTable from "./CourseUsersTable";
import UserTable from "./UserTable";

class Table extends React.Component {

    render() {
        let table;
        switch(this.props.dashboardState.currentWindow) {
            case "groupSummary":
                return(
                    <CourseTable
                        courses={this.props.dashboardState.groupCourses}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        handleClick={this.props.handleCourseClick}>
                    </CourseTable>
                );
            case "courseSummary":
                return(
                    <CourseUsersTable
                        course={this.props.dashboardState.courseWindow}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        handleClick={this.props.handleUserClick}>
                    </CourseUsersTable>
                );
            case "userSummary":
                return(
                    <UserTable
                        user={this.props.dashboardState.userWindow}
                        courses={this.props.dashboardState.groupCourses}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        handleClick={this.props.handleCourseClick}>
                    </UserTable>
                );
            default:
        }

    }
}
export default Table;
