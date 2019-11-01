import React, {forwardRef} from "react";

import {AddBox, ArrowUpward, Check, ChevronLeft, ChevronRight,
        Clear, DeleteOutline, Edit, FilterList, FirstPage,
        LastPage, Remove, SaveAlt, Search, ViewColumn
        } from "@material-ui/icons";

import MaterialTable from "material-table";
import {Container, Grid, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import ContentBox from "./ContentBox";
import GroupSelect from "./GroupSelect";

const useStyles = makeStyles(theme => ({
    box: {
        marginBottom: "40px"
    }
}));

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const ContentDashboard = (props) => {
    const classes = useStyles();
    const tableData = props["tableData"];

    let headers = [];
    if (tableData["group"] && tableData["group"]["headers"]) {
        headers = tableData["group"]["headers"];
    }

    let data = [];
    if (tableData["group"] && tableData["group"]["data"]) {
        data = tableData["group"]["data"];
    }

    // setup total users box
    const usersBox = {
        label: "Total Users",
        value: (tableData["group"] && tableData["group"]["data"] ? tableData["group"]["data"].length : 0)
    };

    // setup total course completions box
    let courseCompletions = 0;
    for (let i = 0; i < data.length; ++i) {
        for (let courseId in data[i]) {
            let progress = data[i][courseId];
            progress = progress.substring(0, progress.length - 1);
            if (parseFloat(progress) >= 100) {
                ++courseCompletions;
            }
        }
    }
    const completionsBox = {
        label: "Course Completions",
        value: courseCompletions
    };

    return (
        <Container>
            <Box className={classes["box"]}>
                <GroupSelect
                    groupId={props["groupId"]}
                    groupChangeHandler={props["groupChangeHandler"]}
                />
            </Box>
            <Box className={classes["box"]}>
                <Grid container justify="flex-start" alignItems="center" spacing={2}>
                    <Grid item xs={12} md={6} lg={3}>
                        <ContentBox
                            label={usersBox["label"]}
                            value={usersBox["value"]}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <ContentBox
                            label={completionsBox["label"]}
                            value={completionsBox["value"]}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box className={classes["box"]}>
                <MaterialTable
                    icons={tableIcons}
                    columns={headers}
                    data={data}
                    options={{
                        sorting: true,
                        pageSize: 10,
                        showTitle: false,
                        doubleHorizontalScroll: true,
                        draggable: false
                    }}
                />
            </Box>
        </Container>
    );
};
export default ContentDashboard;
