import React from "react";

import {Box, Grid, Select, MenuItem, Collapse, AppBar, Toolbar, Switch, Paper, Typography, Tabs, Tab} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers";

import {AUTH_TOKEN} from "../helper";
import WPAPI from "../service/wpClient";
import UserDemographics from "./UserDemographics";
import FrqResultPie from "./FrqResultPie";
import CheckboxPie from "./CheckboxPie";
import BeforeAfterBarGraph from "./BeforeAfterBarGraph";
import YesNoBarGraph from "./YesNoBarGraph";

class ContentSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
        this.entries = {};
        this.state = {
            portfolio: -1,
            courseId: -1,
            answerRates: {},
            tab: 0,
            checkbox: true,
            frq: true,
            before: true,
            now: true,
            startDate: new Date("2010/01/01"),
            endDate: new Date((new Date()).setHours(23,59,59,999))
        };

        this.handlePortfolioChange.bind(this);
        this.handleTabChange.bind(this);
        this.handleCourseChange.bind(this);
        this.handleDropDown.bind(this);
        this.handleDateChange.bind(this);
    }

    componentDidMount() {
        this.getApiEntries(1000, 0);
    }

    handleTabChange(e, newTab) {
        this.setState({
            tab: newTab
        });
    }

    handlePortfolioChange(portfolio) {
        this.setState({
            portfolio: portfolio,
            courseId: -1
        });
    }

    handleCourseChange(course) {
        this.setState({
            courseId: course
        });
    }

    handleDropDown(dropDown) {
        this.setState({
            [dropDown]: !this.state[dropDown]
        });
    }

    handleDateChange(date, property) {
        if (!isNaN(date)) {
            if (property === "startDate") {
                this.getQuestionRates(date, this.state["endDate"]);
            }
            else if (property === "endDate") {
                this.getQuestionRates(this.state["startDate"], date);
            }
        }
    }

    render() {
        let portfolioOptions = [
            <MenuItem key={-1} value={-1} selected={(this.state["portfolio"] === -1) ? "selected" : ""}>{"All Portfolios"}</MenuItem>
        ];
        for (let portfolioKey in this.entries) {
            const selected = (portfolioKey === this.state["portfolio"]) ? "selected" : "";
            portfolioOptions.push(
                <MenuItem key={portfolioKey} value={portfolioKey} selected={selected}>{this.entries[portfolioKey]["name"]}</MenuItem>
            );
        }

        let courseDropdown;
        if (this.state["portfolio"] !== -1) {
            let courseOptions = [
                <MenuItem key={-1} value={-1} selected={(this.state["portfolio"] === -1) ? "selected" : ""}>{"All Courses"}</MenuItem>
            ];
            for (let courseId in this.entries[this.state["portfolio"]]["courses"]) {
                const selected = (courseId === this.state["courseId"]) ? "selected" : "";
                courseOptions.push(
                    <MenuItem key={courseId} value={courseId} selected={selected}>{this.entries[this.state["portfolio"]]["courses"][courseId]["name"]}</MenuItem>
                );
            }

            courseDropdown = (
                <Select
                    className={"select-margin"}
                    value={this.state["courseId"]}
                    onChange={(e) => this.handleCourseChange(e.target["value"])}
                >
                    {courseOptions}
                </Select>
            );
        }

        const filters = this.renderFilters();
        const yesNo = this.renderYesNoGraph();
        const firstFrq = this.renderFrq();
        const checkbox = this.renderCheckboxGraphs();
        return(
            <div>
                <Box display="flex">
                    <Select
                        className={"select-margin"}
                        value={this.state["portfolio"]}
                        onChange={(e) => this.handlePortfolioChange(e.target["value"])}
                    >
                        {portfolioOptions}
                    </Select>
                    {courseDropdown}
                    {filters}
                </Box>
                <AppBar position="static">
                    <Tabs value={this.state["tab"]} onChange={(e, value) => {this.handleTabChange(e, value);}} aria-label={"tabs"}>
                        <Tab label={"Tab 1"} id={"tab-0"} aria-controls={"tabpanel-0"}/>
                        <Tab label={"Tab 2"} id={"tab-1"} aria-controls={"tabpanel-1"}/>
                    </Tabs>
                </AppBar>
                <Box role={"tabpanel"} hidden={this.state["tab"] !== 0} id={"tabpanel-0"} aria-labelledby={"tab-0"}>
                    {yesNo}
                    {checkbox}
                    {firstFrq}
                </Box>
                <Box role={"tabpanel"} hidden={this.state["tab"] !== 1} id={"tabpanel-1"} aria-labelledby={"tab-1"}>
                    <UserDemographics
                        answerRates={this.state["answerRates"]}
                        entries={this.entries}
                        question={"Would you participate in more detailed evaluation?"}
                        portfolio={this.state["portfolio"]}
                        courseId={this.state["courseId"]}
                        startDate={this.state["startDate"]}
                        endDate={this.state["endDate"]}
                    />
                </Box>
            </div>
        );
    }

    renderFilters() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant={"inline"}
                    format={"yyyy/MM/dd"}
                    margin={"normal"}
                    id={"start-date"}
                    value={this.state["startDate"]}
                    maxDate={this.state["endDate"]}
                    onChange={(e) => this.handleDateChange(e, "startDate")}
                />
                <KeyboardDatePicker
                    disableToolbar
                    variant={"inline"}
                    format={"yyyy/MM/dd"}
                    margin={"normal"}
                    id={"end-date"}
                    value={this.state["endDate"]}
                    minDate={this.state["startDate"]}
                    onChange={(e) => this.handleDateChange(e, "endDate")}
                />
            </MuiPickersUtilsProvider>
        )
    }

    renderYesNoGraph() {
        if (Object.keys(this.state["answerRates"]).length !== 0) {
            return (
                <Grid container justify={"center"} alignItems={"center"} spacing={3}>
                    <Grid item xs>
                        <Paper>
                            <YesNoBarGraph
                                answerRates={this.state["answerRates"]}
                                entries={this.entries}
                                questions={["I learned something new as a result of this training.",
                                            "The information presented was relevant to my goals.",
                                            "After taking this course, I will use what I learned.",
                                            "I would recommend PsychArmor training to someone else.",
                                            "Would you participate in more detailed evaluation?"]
                            }
                                portfolio={this.state["portfolio"]}
                                courseId={this.state["courseId"]}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            )
        }
    }

    renderCheckboxGraphs() {
        if (Object.keys(this.state["answerRates"]).length !== 0) {
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Paper className={"height-100"}>
                            <CheckboxPie
                                answerRates={this.state["answerRates"]}
                                entries={this.entries}
                                question={"Why did you take this course?"}
                                portfolio={this.state["portfolio"]}
                                courseId={this.state["courseId"]}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={"height-100"}>
                            <BeforeAfterBarGraph
                                answerRates={this.state["answerRates"]}
                                entries={this.entries}
                                questions={["Knowledge in this area", "Skills related to topic", "Confidence with topic"]}
                                portfolio={this.state["portfolio"]}
                                courseId={this.state["courseId"]}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            );
        }
    }

    renderFrq() {
        if (Object.keys(this.state["answerRates"]).length !== 0) {
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Paper className={"height-100"}>
                            <FrqResultPie
                                answerRates={this.state["answerRates"]}
                                entries={this.entries}
                                question={"What aspects of the course did you find especially helpful"}
                                portfolio={this.state["portfolio"]}
                                courseId={this.state["courseId"]}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Paper className={"height-100"}>
                            <FrqResultPie
                                answerRates={this.state["answerRates"]}
                                entries={this.entries}
                                question={"What aspects of the course would you like to see changed"}
                                portfolio={this.state["portfolio"]}
                                courseId={this.state["courseId"]}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Paper className={"height-100"}>
                            <FrqResultPie
                                answerRates={this.state["answerRates"]}
                                entries={this.entries}
                                question={"Application: We are interested in understanding how you applied the content"}
                                portfolio={this.state["portfolio"]}
                                courseId={this.state["courseId"]}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Paper className={"height-100"}>
                            <FrqResultPie
                                answerRates={this.state["answerRates"]}
                                entries={this.entries}
                                question={"Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"}
                                portfolio={this.state["portfolio"]}
                                courseId={this.state["courseId"]}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            );
        }
    }

    renderBeforeGraphs() {
        if (Object.keys(this.state["answerRates"]).length !== 0) {
            return (
                <Paper>
                    <AppBar position={"static"}>
                        <Toolbar>
                            <Switch
                                checked={this.state["before"]}
                                onChange={(e) => this.handleDropDown("before")}
                                value={"before"}
                            />
                            <Typography variant="h6">
                                {"Before and Now Results"}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Collapse in={this.state["before"]}>
                        <Grid container justify={"center"} alignItems={"center"} spacing={3}>
                            <Grid item xs={6}>
                                <BeforeAfterBarGraph
                                    answerRates={this.state["answerRates"]}
                                    entries={this.entries}
                                    questions={["Knowledge in this area", "Skills related to topic", "Confidence with topic"]}
                                    portfolio={this.state["portfolio"]}
                                    courseId={this.state["courseId"]}
                                />
                            </Grid>
                        </Grid>
                    </Collapse>
                </Paper>
            );
        }
    }

    getApiEntries(limit, offset) {
        const url = WPAPI.surveyEndpoint + "?limit=" + limit + "&offset=" + offset;
        const requestOptions = {
            method: "GET",
            headers: {Authorization: "Bearer " + this.user.token},
            mode: "cors"
        };

        const request = new Request(url, requestOptions);
        fetch(request)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("getApiEntries: Bad Response");
            }
        })
        .then((jsonData) => {
            this.setEntries(jsonData, limit, offset);
        })
        .catch((err) => {
            console.log("getApiEntries", err);
        });
    }

    setEntries(newEntries, limit, offset) {
        let count = 0;
        for (let portfolioKey in newEntries) {
            if (!(portfolioKey in this.entries)) {
                this.entries[portfolioKey] = {
                    name: newEntries[portfolioKey]["name"],
                    courses: {}
                };
            }
            for (let courseKey in newEntries[portfolioKey]["courses"]) {
                if (!(courseKey in this.entries[portfolioKey]["courses"])) {
                    this.entries[portfolioKey]["courses"][courseKey] = {
                        name: newEntries[portfolioKey]["courses"][courseKey]["name"],
                        entries: []
                    };
                }
                for (let i = 0; i < newEntries[portfolioKey]["courses"][courseKey]["entries"].length; ++i) {
                    const entry = newEntries[portfolioKey]["courses"][courseKey]["entries"][i];
                    this.entries[portfolioKey]["courses"][courseKey]["entries"].push(entry);
                    ++count;
                }
            }
        }

        if (count >= limit) {
            this.getApiEntries(limit, offset + count);
        }
        else {
            this.getQuestionRates(this.state["startDate"], this.state["endDate"]);
        }
    }

    getQuestionRates(startDate, endDate) {
        console.log(this.entries);
        let answerRates = {};
        for (let portfolioKey in this.entries) {
            for (let courseKey in this.entries[portfolioKey]["courses"]) {
                answerRates[courseKey] = {
                    "I learned something new as a result of this training.": {yes: 0, no: 0},
                    "The information presented was relevant to my goals.": {yes: 0, no: 0},
                    "After taking this course, I will use what I learned.": {yes: 0, no: 0},
                    "I would recommend PsychArmor training to someone else.": {yes: 0, no: 0},
                    "Would you participate in more detailed evaluation?": {yes: 0, no: 0},
                    "Why did you take this course?": {
                        "Interested in topic": 0,
                        "To improve performance": 0,
                        "Directed to take this course": 0,
                        "To earn Continuing Education Credit or Equiv": 0,
                        "Other": 0
                    },
                    "What aspects of the course did you find especially helpful": {},
                    "What aspects of the course would you like to see changed": {},
                    "Knowledge in this area": {before: [0, 0, 0, 0, 0], now: [0, 0, 0, 0, 0]},
                    "Skills related to topic": {before: [0, 0, 0, 0, 0], now: [0, 0, 0, 0, 0]},
                    "Confidence with topic": {before: [0, 0, 0, 0, 0], now: [0, 0, 0, 0, 0]},
                    "Application: We are interested in understanding how you applied the content": {},
                    "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?": {}
                };
                for (let i = 0; i < this.entries[portfolioKey]["courses"][courseKey]["entries"].length; ++i) {
                    const submitted = parseInt(this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["dateSubmitted"]);
                    if (submitted >= (startDate.getTime() / 1000) && submitted <= (endDate.getTime() / 1000)) {
                        const results = this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["results"];
                        this.getIntialQuestionsResults(answerRates, results, courseKey);
                    }
                }
            }
        }
        this.getFreeResponseResults(answerRates, startDate, endDate);
        this.getRatingResults(answerRates, startDate, endDate);
        this.getCheckboxResults(answerRates, startDate, endDate);

        console.log(answerRates);
        this.setState({
            answerRates: answerRates,
            startDate: startDate,
            endDate: endDate
        });
    }

    getIntialQuestionsResults(answerRates, results, courseKey) {
        const initialQuestions = [
            "I learned something new as a result of this training.",
            "The information presented was relevant to my goals.",
            "After taking this course, I will use what I learned.",
            "I would recommend PsychArmor training to someone else.",
            "Would you participate in more detailed evaluation?"
        ];
        for (let j = 0; j < initialQuestions.length; ++j) {
            const question = initialQuestions[j];
            if (results[question] === "Yes") {
                ++answerRates[courseKey][question]["yes"];
            }
            else {
                ++answerRates[courseKey][question]["no"];
            }
        }
    }

    getFreeResponseResults(answerRates, startDate, endDate) {
        const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't", 'n'];
        const questions = [
            "What aspects of the course did you find especially helpful",
            "What aspects of the course would you like to see changed",
            "Application: We are interested in understanding how you applied the content",
            "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"
        ];
        const natural = require("natural");
        const tokenizer = new natural.AggressiveTokenizer();

        for (let portfolioKey in this.entries) {
            for (let courseKey in this.entries[portfolioKey]["courses"]) {
                let tokenCount = {
                    "What aspects of the course did you find especially helpful": {},
                    "What aspects of the course would you like to see changed": {},
                    "Application: We are interested in understanding how you applied the content": {},
                    "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?": {}
                };

                for (let i = 0; i < this.entries[portfolioKey]["courses"][courseKey]["entries"].length; ++i) {
                    const submitted = parseInt(this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["dateSubmitted"]);
                    if (submitted >= (startDate.getTime() / 1000) && submitted <= (endDate.getTime() / 1000)) {
                        const results = this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["results"];
                        for (let j = 0; j < questions.length; ++j) {
                            const question = questions[j];
                            const tokens = tokenizer.tokenize(results[question].toLowerCase()) || []; // match all non whitespace that are >= 1
                            for (let k = 0; k < tokens.length; ++k) {
                                if(stopwords.indexOf(tokens[k]) === -1) {
                                    if (!(tokens[k] in tokenCount[question])) {
                                        tokenCount[question][tokens[k]] = 0;
                                    }
                                    ++tokenCount[question][tokens[k]];
                                }
                            }
                        }
                    }
                }
                for (let i = 0; i < questions.length; ++i) {
                    // this.getMostUsedTokens(answerRates, courseKey, tokenCount, questions[i]);
                    answerRates[courseKey][questions[i]] = tokenCount[questions[i]];
                }
            }
        }
    }

    getRatingResults(answerRates, startDate, endDate) {
        const questions = [
            "Knowledge in this area",
            "Skills related to topic",
            "Confidence with topic"
        ];

        for (let portfolioKey in this.entries) {
            for (let courseKey in this.entries[portfolioKey]["courses"]) {
                for (let i = 0; i < this.entries[portfolioKey]["courses"][courseKey]["entries"].length; ++i) {
                    const submitted = parseInt(this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["dateSubmitted"]);
                    if (submitted >= (startDate.getTime() / 1000) && submitted <= (endDate.getTime() / 1000)) {
                        const results = this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["results"];
                        for (let j = 0; j < questions.length; ++j) {
                            const question = questions[j];
                            if (results[question]["before"] !== "") {
                                ++answerRates[courseKey][question]["before"][parseInt(results[question]["before"]) - 1];
                            }
                            if (results[question]["now"] !== "") {
                                ++answerRates[courseKey][question]["now"][parseInt(results[question]["now"]) - 1];
                            }
                        }
                    }
                }
            }
        }
    }

    getCheckboxResults(answerRates, startDate, endDate) {
        for (let portfolioKey in this.entries) {
            for (let courseKey in this.entries[portfolioKey]["courses"]) {
                for (let i = 0; i < this.entries[portfolioKey]["courses"][courseKey]["entries"].length; ++i) {
                    const submitted = parseInt(this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["dateSubmitted"]);
                    if (submitted >= (startDate.getTime() / 1000) && submitted <= (endDate.getTime() / 1000)) {
                        const results = this.entries[portfolioKey]["courses"][courseKey]["entries"][i]["results"];
                        const question = "Why did you take this course?";
                        for (let j = 0; j < results[question].length; ++j) {
                            ++answerRates[courseKey][question][results[question][j]];
                        }
                    }
                }
            }
        }
    }
}
export default ContentSurvey;
