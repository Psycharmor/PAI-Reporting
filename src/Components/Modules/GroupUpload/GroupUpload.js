import React from "react";

import {Container, Row, Col, Button, Spinner} from "reactstrap";
import Papa from "papaparse"; // i like it when you call me big poppa

import Dropdown from "../../Forms/Dropdown";
import GroupUploadDropzone from "./GroupUploadDropzone";
import GroupUploadCourses from "./GroupUploadCourses";
import GroupUploadProgress from "./GroupUploadProgress";
import GroupUploadExampleBtn from "./GroupUploadExampleBtn";
import ApiHandler from "../../../Lib/ApiHandler";

export default class GroupUpload extends React.Component {
    constructor(props) {
        super(props);

        this.groupIds = this.getGroupIds();

        this.state = {
            groupId: this.getInitGroup(),
            courseIds: [],
            file: null,
            uploading: false,
            progress: 0
        };

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleCoursesChange = this.handleCoursesChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.doUpload = this.doUpload.bind(this);
    }

    handleFileUpload(files) {
        this.setState({
            file: files[0]
        });
    }

    handleGroupChange(e) {
        this.setState({
            groupId: e.target["value"]
        });
    }

    handleCoursesChange(e) {
        const options = e.target["options"];
        let courseIds = [];
        for (let i = 0; i < options.length; ++i) {
            if (options[i]["selected"]) {
                courseIds.push(options[i]["value"]);
            }
        }

        this.setState({
            courseIds: courseIds
        });
    }

    handleUpload() {
        Papa.parse(this.state["file"], {
            complete: this.doUpload,
            skipEmptyLines: true,
            header: true
        });
    }

    doUpload(results) {
        this.setState({
            progress: 0,
            uploading: true
        });
        this.doBatchUpload(results["data"], 1000);
    }

    async doBatchUpload(data, limit) {


        let count = 0;
        let offset = 0;
        do {
            const user = JSON.parse(sessionStorage.getItem("USER"));
            if (user) {
                const users = data.slice(offset, offset + limit);

                const url = this.props["url"] + "/wp-json/pai/v3/upload";
                const options = {
                    headers: {
                        Authorization: "Bearer " + user["token"]
                    }
                };
                const body = {
                    users: users,
                    courseIds: this.state["courseIds"],
                    groupId: this.state["groupId"]
                };

                try {
                    const result = await ApiHandler.post(url, body, options);
                    console.log(result);
                    count = result["data"]["count"];
                    offset += count;
                    this.setState({
                        progress: Math.floor(offset / data.length * 100)
                    });
                }
                catch (err) {
                    // sessionStorage.removeItem("USER");
                    // window.location.reload();
                }
            }
        }
        while (count >= limit);

        this.setState({
            uploading: false
        });
    }

    getGroupIds() {
        const user = JSON.parse(sessionStorage.getItem("USER"));
        if (user["user_role"].includes("administrator")) {
            return Object.keys(this.props["groups"]);
        }

        let groupIds = [];
        for (let i = 0; i < user["group"].length; ++i) {
            const groupId = user["group"][i]["id"];
            groupIds.push(groupId.toString());
        }

        return groupIds;
    }

    getInitGroup() {
        let groups = [];
        for (let groupId in this.props["groups"]) {
            if (this.groupIds.includes(groupId)) {
                groups.push({groupId: groupId, name: this.props["groups"][groupId]["title"]});
            }
        }
        groups.sort(function(a, b) {
            const aName = a["name"];
            const bName = b["name"];

            if (aName < bName) {
                return -1;
            }
            if (aName > bName) {
                return 1;
            }

            return 0;
        });

        return groups[0]["groupId"];
    }

    getGroupOptions() {
        let groupOptions = [];
        for (let groupId in this.props["groups"]) {
            if (this.groupIds.includes(groupId)) {
                groupOptions.push({
                    label: this.props["groups"][groupId]["title"],
                    value: groupId,
                    key: groupId
                });
            }
        }

        return groupOptions.sort(comparator);
    }

    getCourseOptions() {
        let courseOptions = [];
        const group = this.props["groups"][this.state["groupId"]];
        for (let i = 0; i < group["courseIds"].length; ++i) {
            const courseId = group["courseIds"][i];
            const course = this.props["courses"][courseId];
            courseOptions.push({
                label: course["title"],
                value: courseId,
                key: courseId
            });
        }

        return courseOptions.sort(comparator);
    }

    render() {
        // console.log(this.state);
        return (
            <>
            {this.state["uploading"] && <div className={"loading-overlay"}></div>}
            <Container fluid={true}>
                <Row className={"margin-bot-30"}>
                    <Col sm={6} md={3}>
                        <Dropdown
                            value={this.state["groupId"]}
                            optionPairs={this.getGroupOptions()}
                            onChangeHandler={this.handleGroupChange}
                        />
                    </Col>
                </Row>
                <Row className={"margin-bot-30"}>
                    <Col>
                        <GroupUploadExampleBtn/>
                    </Col>
                </Row>
                <Row className={"margin-bot-30"}>
                    <Col sm={4}>
                        <GroupUploadDropzone
                            fileUploadHandler={this.handleFileUpload}
                            file={this.state["file"]}
                        />
                    </Col>
                    <Col sm={8}>
                        <GroupUploadCourses
                            values={this.state["courseIds"]}
                            courseOptions={this.getCourseOptions()}
                            coursesChangeHandler={this.handleCoursesChange}
                        />
                    </Col>
                </Row>
                <Row className={"margin-bot-30"}>
                    <Col>
                        {this.state["uploading"] && <Spinner color={"primary"}/>}
                    </Col>
                    <Col>
                        {!this.state["uploading"] && <Button
                            color={"primary"}
                            className={"btn pai-btn blue-btn upload-btn"}
                            onClick={this.handleUpload}
                            disabled={!(this.state["file"] && this.state["courseIds"].length > 0)}
                        >
                            {"Upload"}
                        </Button>}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {(this.state["uploading"] || this.state["progress"] > 0) &&
                        <GroupUploadProgress
                            progress={this.state["progress"]}
                        />}
                    </Col>
                </Row>
            </Container>
            </>
        );
    }
};

function comparator(a, b) {
    const aName = a["label"].toLowerCase();
    const bName = b["label"].toLowerCase();

    if (aName < bName) {
        return -1;
    }

    else if (aName > bName) {
        return 1;
    }

    return 0;
}
