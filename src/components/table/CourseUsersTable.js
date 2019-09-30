import React, { Component } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class CourseUsersTable extends Component {
    render() {
        let users;
        if (Object.keys(this.props.activities).length > 0 && Object.keys(this.props.users).length > 0) {
            users = this.props.users.result.map((item, key) => {
                const completionInfo = this.getCompletionInfo(this.props.course, item.id);
                return(
                    <TableRow key={key} onClick={() => this.props.handleClick(item.id)}>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{completionInfo.percent}%</TableCell>
                        <TableCell>{completionInfo.date}</TableCell>
                    </TableRow>
                );
            });
        }

        return(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Display Name</TableCell>
                        <TableCell>Email Address</TableCell>
                        <TableCell>% Complete</TableCell>
                        <TableCell>Completion Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users}
                </TableBody>
            </Table>
        );
    }

    getCompletionInfo(courseId, userId) {
        let percentComplete = 0;
        let dateComplete = "";

        for (let activityIndex in this.props.activities.result) {
            const activity = this.props.activities.result[activityIndex];
            if (activity["courseId"] === courseId && activity["userId"] === userId) {
                if (activity["status"] === 1) {
                    if (!activity["completed"]) {
                        dateComplete = "not recorded";
                    }
                    else {
                        dateComplete = this.getFormattedDate(activity["completed"]);
                    }
                }

                percentComplete = activity["stepsCompleted"] / activity["stepsTotal"] * 100;
            }
        }

        return {
            percent: percentComplete,
            date: dateComplete
        };
    }

    getFormattedDate(unixTimeStamp) {
        let date = new Date(unixTimeStamp * 1000);
        date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        return date.join("-");
    }
}
export default CourseUsersTable;
