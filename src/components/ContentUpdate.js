import React, {useState} from "react";

import {Container, Input, Button, LinearProgress,
        FormControl, InputLabel, Select, MenuItem,
        ListItemText, Checkbox, Chip, CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    bar: {
        height: "10px",
        marginBottom: "20px"
    },
    input: {
        display: "block",
        marginBottom: "20px"
    },
    button: {
        marginRight: "10px"
    },
    formControl: {
        display: "block",
        marginBottom: "20px",
        minWidth: 100,
        maxWidth: 300
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    selectInput: {
        minWidth: 100
    },
    box: {
        display: "flex",
        marginBottom: "20px"
    }
}));

const ContentUpdate = (props) => {

    const [file, setFile] = useState(undefined);
    const [courses, setCourses] = useState([]);
    const classes = useStyles();

    let progress;
    if (props["batchProgress"] !== -1) {
        progress = <LinearProgress className={classes["bar"]} variant="determinate" value={props["batchProgress"]}/>;
        console.log(props["doneSoFar"], props["totalNeeded"]);
    }

    let availableCourses = [];
    if (props["groupInfo"] && Object.keys(props["groupInfo"]).length > 0) {
        for (let courseId in props["groupInfo"]["courses"]) {
            const title = props["groupInfo"]["courses"][courseId]["title"];
            availableCourses.push(
                <MenuItem key={courseId} value={courseId}>
                    <Checkbox checked={courses.includes(courseId)}/>
                    <ListItemText primary={title}/>
                </MenuItem>
            );
        }
    }

    let waiting;
    if (props["loading"]) {
        waiting = <CircularProgress />;
    }

    const handleChange = e => {
        setCourses(e.target["value"]);
    };

    return (
        <Container>
            <Input className={classes["input"]} type="file" onChange={(e) => setFile(e.target["files"][0])}/>
            <FormControl className={classes["formControl"]}>
                <InputLabel htmlFor="course-select">Courses</InputLabel>
                <Select
                    multiple
                    value={courses}
                    onChange={handleChange}
                    input={<Input className={classes["selectInput"]} id="course-select"/>}
                    renderValue={selected => (
                        <div className={classes["chips"]}>
                            {selected.map(value => (
                                <Chip key={value} label={props["groupInfo"]["courses"][value]["title"]}/>
                            ))}
                        </div>
                    )}
                >
                    {availableCourses}
                </Select>
            </FormControl>
            <div className={classes["box"]}>
                <Button className={classes["button"]} variant="contained" onClick={() => props["userUploadHandler"](file, courses)}>
                    Upload
                </Button>
                {waiting}
            </div>
            {progress}
        </Container>
    );
};
export default ContentUpdate;
