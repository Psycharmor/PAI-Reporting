import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class UserTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tableData: [],
            orderBy: "",
            order: "asc"
        };

        this.currentData = {
            courses: {},
            user: {},
            activities: {}
        };
    }

    componentDidMount() {
        this.currentData = {
            courses: this.props.courses,
            user: this.props.user,
            activities: this.props.activities
        };
        this.setState({
            tableData: this.getTableData(this.currentData.user, this.currentData.courses, this.currentData.activities)
        });
    }

    componentDidUpdate(prevProps) {
        if (this.groupChanged(prevProps)) {
            this.currentData = {
                courses: this.props.courses,
                user: this.props.user,
                activities: this.props.activities
            };
            this.setState({
                tableData: this.getTableData(this.currentData.user, this.currentData.courses, this.currentData.activities),
                orderBy: "",
                order: "asc"
            });
        }
    }

    handleSortingOrderChange(column) {
        if (column === this.state.orderBy) {
            this.setState({
                order: (this.state.order === "desc" ? "asc" : "desc")
            });
        }
        else {
            this.setState({
                orderBy: column,
                order: "asc"
            })
        }
    }


    render() {
        const tableLabels = this.renderTableLabels(this.currentData.courses);
        const tableBody = this.renderTableBody(this.state.tableData, this.currentData.courses);

        return(
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

        );
    }

    /* Render Functions */
    renderTableLabels(courses) {
        if (Object.keys(courses).length === 0) {
            return [];
        }
        courses = courses.result;
        const labels = [
            {label: "Course", orderBy: "title"},
            {label: "Progress %", orderBy: "percent"},
            {label: "Started", orderBy: "startedDate"},
            {label: "Completed", orderBy: "completedDate"}
        ];

        return labels.map((item, key) => {
            return(
                <TableCell key={key}>
                    <TableSortLabel
                        active={this.state.orderBy === item.orderBy}
                        direction={this.state.order}
                        onClick={() => this.handleSortingOrderChange(item.orderBy)}
                    >
                        {item.label}
                    </TableSortLabel>
                </TableCell>
            );
        });
    }

    renderTableBody(tableData, courses) {
        if (tableData.length === 0) {
            return [];
        }

        return this.sortTable(tableData)
               .slice(this.props.tableState.page * this.props.tableState.rowsPerPage, this.props.tableState.page * this.props.tableState.rowsPerPage + this.props.tableState.rowsPerPage)
               .map((item, key) => {
                   const percent = (item["courseCompletions"].percent).toFixed(2);
                   const started = (item["courseCompletions"].startedDate === -1 ? "not recorded" : this.convertUnixTimestampToFormattedDate(item["courseCompletions"].startedDate));
                   const completed = (item["courseCompletions"].completedDate === -1 ? "not recorded" : this.convertUnixTimestampToFormattedDate(item["courseCompletions"].completedDate));

                   return(
                       <TableRow key={key} onClick={() => this.props.handleClick(item.course)}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{+percent}%</TableCell>
                            <TableCell>{started}</TableCell>
                            <TableCell>{completed}</TableCell>
                       </TableRow>
                   );
               });
    }

    /* Utility Functions */
    groupChanged(prevProps) {
        return (prevProps.courses !== this.currentData.courses ||
            prevProps.activities !== this.currentData.activities);
    }

    getTableData(user, courses, activities) {
        if (Object.keys(courses).length === 0 && Object.keys(activities).length === 0) {
            return [];
        }

        courses = courses.result;
        activities = activities.result;

        let tableData = [];
        for (let i in courses) {
            tableData[courses[i].id] = {
                course: courses[i],
                title: courses[i].title,
                courseCompletions: {
                    percent: 0,
                    startedDate: -1,
                    completedDate: -1
                }
            };
        }
        for (let i in activities) {
            const activity = activities[i];
            if (activity["userId"] == user.id) {
                tableData[activity["courseId"]]["courseCompletions"]["percent"] = activity["stepsCompleted"] / activity["stepsTotal"] * 100;
                tableData[activity["courseId"]]["courseCompletions"]["startedDate"] = activity["started"];
                tableData[activity["courseId"]]["courseCompletions"]["CompletedDate"] = activity["completed"];
            }
        }

        return Object.values(tableData);

    }

    sortTable(tableData) {
        let field = this.state.orderBy;
        if (!field) {
            return tableData;
        }

        function sortMethod(a, b) {
            // need to check for string to do case-insensitive sorts
            let aField = a[field];
            let bField = b[field];

            if (!(field in a) && !(field in b)) {
                aField = a["courseCompletions"][field];
                bField = b["courseCompletions"][field];
            }

            if (typeof aField === "string") {
                aField = aField.toUpperCase();
            }
            if (typeof bField === "string") {
                bField = bField.toUpperCase();
            }

            if (aField === bField) {
                return 0;
            }
            else if (aField < bField) {
                return -1;
            }
            else { // aField > bField
                return 1;
            }
        }
        return (this.state.order === "asc" ? tableData.sort(function(a,b) {return sortMethod(a,b)}) : tableData.sort(function(a,b) {return -sortMethod(a,b)}) );

    }

    convertUnixTimestampToFormattedDate(timestamp) {
        const date = new Date(timestamp * 1000); // need to convert secs -> milisecs
        const dateOptions = {
            month: "short",
            day: "2-digit",
            year: "numeric"
        };

        return date.toLocaleDateString("en-us", dateOptions);
    }


}
export default UserTable;
