import React from "react";

import {Card, CardHeader} from "reactstrap";

import LoadingOverlay from "../../../LoadingOverlay";
import FrqTable from "./FrqTable";
import FrqOptions from "./FrqOptions";
import UtilityFunctions from "../../../../Lib/UtilityFunctions";

export default class FreeResponseCategories extends React.Component {
    constructor(props) {
        super(props);

        this.questions = [
            "What aspects of the course did you find especially helpful",
            "What aspects of the course would you like to see changed",
            "Application: We are interested in understanding how you applied the content",
            "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"
        ];

        this.state = {
            question: "0",
            category: "0",
            selected: [],
            toApi: []
        };

        this.handlePagingChange = this.handlePagingChange.bind(this);
        this.handleSingleRowSelect = this.handleSingleRowSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.linkCategoryResponses = this.linkCategoryResponses.bind(this);
        this.manageCategories = this.manageCategories.bind(this);
    }

    componentDidMount() {
        this.setState({
            category: this.getFirstCategory()
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props["loading"] !== prevProps["loading"]) {
            this.setState({
                category: this.getFirstCategory()
            });
        }
    }

    handlePagingChange(event) {
        this.setState({
            selected: [],
            toApi: []
        });
    }

    handleSingleRowSelect(row, isSelect, rowIndex, event) {
        let selected = this.state["selected"];
        let toApi = this.state["toApi"];
        if (isSelect) {
            selected.push(row["index"]);
            toApi.push({
                surveyId: row["surveyId"],
                question: row["question"]
            });
        }
        else {
            let index = selected.indexOf(row["index"]);
            selected.splice(index, 1);
            for (let i = 0; i < toApi.length; ++i) {
                const response = toApi[i];
                if (row["surveyId"] === response["surveyId"] &&
                        row["question"] === response["question"]) {
                    toApi.splice(i, 1);
                    break;
                }
            }
        }

        this.setState({
            selected: selected,
            toApi: toApi
        });

        return false;
    }

    handleSelectAll(isSelect, rows, event) {
        let selected = [];
        let toApi = [];
        if (isSelect) {
            for (let i = 0; i < rows.length; ++i) {
                selected.push(rows[i]["index"]);
                toApi.push({
                    surveyId: rows[i]["surveyId"],
                    question: rows[i]["question"]
                });
            }
        }

        this.setState({
            selected: selected,
            toApi: toApi
        });
    }

    handleQuestionChange(event) {
        this.setState({
            question: event.target["value"],
            selected: [],
            toApi: []
        });
    }

    handleCategoryChange(event) {
        this.setState({
            category: event.target["value"]
        });
    }

    linkCategoryResponses(action) {
        // api call to link categories and responses
        // api call to refetch responses table
        if (this.state["toApi"].length > 0) {
            switch (action) {
                case "add":
                    this.props["linkResponseHandler"](this.state["toApi"], this.state["category"]);
                    break;
                case "remove":
                    this.props["delinkResponseHandler"](this.state["toApi"], this.state["category"]);
                    break;
                default:
            }
        }
        this.setState({
            selected: [],
            toApi: []
        });
    }

    manageCategories(action, category) {
        // api call to add/remove categories from table
        // api call to refetch categories table
        switch (action) {
            case "add":
                this.props["newCategoryHandler"](category);
                break;
            case "remove":
                this.props["removeCategoryHandler"](category);
                break;
            default:
        }

        this.setState({
            selected: [],
            toApi: []
        });
    }

    getFirstCategory() {
        if (UtilityFunctions.isObjEmpty(this.props["categories"])) {
            return "0";
        }
        return Object.keys(this.props["categories"])[0];
    }

    render() {
        return (
            <>
            {this.props["loading"] && <LoadingOverlay/>}
            <Card>
                <CardHeader>
                    <h3>{"Free Response Question Results"}</h3>
                    <p>{"View & categorize comments from Fill-in-the-blank questions"}</p>
                    {!this.props["loading"] &&
                    <FrqOptions
                        questions={this.questions}
                        categories={this.props["categories"]}
                        question={this.state["question"]}
                        category={this.state["category"]}
                        questionChangeHandler={this.handleQuestionChange}
                        categoryChangeHandler={this.handleCategoryChange}
                        categoryResponseLinkHandler={this.linkCategoryResponses}
                        categoryManagementHandler={this.manageCategories}
                    />}
                </CardHeader>
                {!this.props["loading"] &&
                <FrqTable
                    surveys={this.props["surveys"]}
                    portfolios={this.props["portfolios"]}
                    courses={this.props["courses"]}
                    groups={this.props["groups"]}
                    users={this.props["users"]}
                    portfolioId={this.props["portfolioId"]}
                    courseId={this.props["courseId"]}
                    startDate={this.props["startDate"]}
                    endDate={this.props["endDate"]}
                    groupId={this.props["groupId"]}
                    org={this.props["org"]}
                    role={this.props["role"]}
                    questions={this.questions}
                    question={this.state["question"]}
                    selected={this.state["selected"]}
                    responses={this.props["responses"]}
                    categories={this.props["categories"]}
                    pagingHandler={this.handlePagingChange}
                    singleRowSelectHandler={this.handleSingleRowSelect}
                    selectAllHandler={this.handleSelectAll}
                />}
            </Card>
            </>
        );
    }
};
