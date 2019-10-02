import React, { Component } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class CourseTable extends Component {

    render() {

        const tableLabels = this.renderTableLabels();
        const tableBody = this.renderTableBody();

        return(
            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            {tableLabels}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableBody}
                    </TableBody>
                </Table>
            </div>
        );
    }

    renderTableLabels() {
        let labels = [
            {label: "Course", orderBy: "title"},
            {label: "Not Started", orderBy: "notStarted"},
            {label: "In Progress", orderBy: "inProgress"},
            {label: "Completed", orderBy: "completed"},
            {label: "% Completed", orderBy: "completed"}
        ];
        labels = labels.map((item, key) => {
            return(
                <TableCell key={key}>
                    <TableSortLabel
                        active={this.props.tableState.orderBy === item.orderBy}
                        direction={this.props.tableState.order}
                        onClick={() => this.props.changeSorting(item.orderBy)}
                    >
                    {item.label}
                    </TableSortLabel>
                </TableCell>
            );
        });

        return labels;
    }

    renderTableBody() {
        if (Object.keys(this.props.courses).length === 0 && Object.keys(this.props.activities).length === 0 && Object.keys(this.props.users).length === 0) {
            return [];
        }

        return this.props.sorting(this.combineCoursesAndActivities(this.props.courses, this.props.users))
        .slice(this.props.tableState.page * this.props.tableState.rowsPerPage, this.props.tableState.page * this.props.tableState.rowsPerPage + this.props.tableState.rowsPerPage)
        .map((item, key) => {
            return (<TableRow key={key} onClick={() => this.props.handleClick(item.course)}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.notStarted}</TableCell>
                <TableCell>{item.inProgress}</TableCell>
                <TableCell>{item.completed}</TableCell>
                <TableCell>{+((item.completed / this.props.users.count) * 100).toFixed(2)}%</TableCell>
            </TableRow>);
        });
    }

    combineCoursesAndActivities(courses, users) {

        let coursesAndActivitiesCombined = [];
        for (let i in courses.result) {
            let courseEntry = {
                course: courses.result[i],
                title: courses.result[i].title
            }
            const courseInfo = this.getCourseInfo(courses.result[i].id, users.count);
            for (let key in courseInfo) {
                courseEntry[key] = courseInfo[key];
            }

            coursesAndActivitiesCombined.push(courseEntry);
        }

        return coursesAndActivitiesCombined;
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
