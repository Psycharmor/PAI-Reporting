import React, {Component} from 'react';
import { AUTH_TOKEN } from '../../helper';
import ApiCaller from '../../items/ApiCaller';
import WPAPI from '../../service/wpClient';

import CourseTable from "./CourseTable";
import CourseUsersTable from "./CourseUsersTable";
import UserTable from "./UserTable";

class Table extends Component {

    constructor(props) {

        super(props);

        this.state = {
            users: {},
            courses: {},
            activities: {},
            group: {},
            table: "courseList",
            course: -1,
            user: -1
        };
    }

    componentDidMount() {
        this.setGroup(9376);
    }

    handleCourseClick(courseId) {
        this.setState({
            table: "courseUserList",
            course: courseId
        });
    }

    handleUserClick(userId) {
        this.setState({
            table: "userList",
            user: userId
        });
    }

    render() {
        let table;
        switch(this.state.table) {
            case "courseList":
                table =
                    <CourseTable
                        courses={this.state.courses}
                        activities={this.state.activities}
                        users={this.state.users}
                        handleClick={(e) => this.handleCourseClick(e)}>
                    </CourseTable>;
                break;
            case "courseUserList":
                table =
                    <CourseUsersTable
                        course={this.state.course}
                        activities={this.state.activities}
                        users={this.state.users}
                        handleClick={(e) => this.handleUserClick(e)}>
                    </CourseUsersTable>
                break;
            case "userList":
                table =
                    <UserTable
                        user={this.state.user}
                        courses={this.state.courses}
                        activities={this.state.activities}
                        users={this.state.users}
                        handleClick={(e) => this.handleCourseClick(e)}>
                    </UserTable>
                break;
            default:
        }
        return(
            <div className="dashboard-table">
                {table}
            </div>
        );
    }

    setGroup(groupId) {
        this.setGroupState(groupId, WPAPI.groupsEndpoint, "group");
        this.setGroupState(groupId, WPAPI.usersEndpoint, "users");
        this.setGroupState(groupId, WPAPI.coursesEndpoint, "courses");
        this.setGroupState(groupId, WPAPI.courseActivitiesEndpoint, "activities");
    }

    setGroupState(groupId, endpoint, stateKey) {
        const apiCaller = new ApiCaller();

        apiCaller.getActivityFromGroup(groupId, endpoint)
        .then((jsonData) => {
            this.setState({
                [stateKey]: jsonData
            });
            console.log(this.state[stateKey]);
        })
        .catch((err) => {
            console.log(err);
        });
    }
}
export default Table;
