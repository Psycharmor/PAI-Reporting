import React, { Component } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class CourseTable extends Component {

    render() {
        let courses;
        if (Object.keys(this.props.courses).length > 0 && Object.keys(this.props.activities).length > 0 && Object.keys(this.props.users).length > 0) {
            courses = this.props.courses.result.map((item, key) => {
                const courseInfo = this.getCourseInfo(item.id, this.props.users.count);
                return (<TableRow key={key} onClick={() => this.props.handleClick(item.id)}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{courseInfo.notStarted}</TableCell>
                    <TableCell>{courseInfo.inProgress}</TableCell>
                    <TableCell>{courseInfo.completed}</TableCell>
                    <TableCell>{(courseInfo.completed / this.props.users.count) * 100}%</TableCell>
                </TableRow>);
            });
        }

        return(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Not Started</TableCell>
                        <TableCell>In Progress</TableCell>
                        <TableCell>Completed</TableCell>
                        <TableCell>% Complete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses}
                </TableBody>
            </Table>
        );
    }

    getCourseInfo(courseId, userCount) {
        let notStarted = userCount;
        let inProgress = 0;
        let completed = 0;
        for (let activityIndex in this.props.activities.result) {
            const activity = this.props.activities.result[activityIndex];
            if (activity["courseId"] === courseId) {
                --notStarted;
                if (activity["stepsCompleted"] < activity["stepsTotal"]) {
                    ++inProgress;
                }
                if (activity["status"] === 1) {
                    ++completed;
                }
            }
        }

        return {
            notStarted: notStarted,
            inProgress: inProgress,
            completed: completed
        };
    }
}
export default CourseTable;
