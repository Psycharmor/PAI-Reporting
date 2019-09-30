import React, {Component} from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class UserTable extends Component {
    render() {
        let courses;
        if (Object.keys(this.props.activities).length > 0 && Object.keys(this.props.courses).length > 0 && Object.keys(this.props.users).length > 0) {
            courses = this.props.courses.result.map((item, key) => {
                const completionInfo = this.getCompletionInfo(item.id, this.props.user);
                return(
                    <TableRow key={key} onClick={() => this.props.handleClick(item.id)}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{completionInfo.percent}</TableCell>
                        <TableCell>{completionInfo.date}</TableCell>
                    </TableRow>
                );
            });
        }

        return(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>% Complete</TableCell>
                        <TableCell>Completion Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses}
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
        date = [date.getFullYear(), date.getMonth()+1, date.getDate()];
        return date.join("-");
    }
}
export default UserTable;
