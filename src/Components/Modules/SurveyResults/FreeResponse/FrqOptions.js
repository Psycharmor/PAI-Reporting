import React from "react";

import {Button, Row, Col, Input} from "reactstrap";

import Dropdown from "../../../Forms/Dropdown";
import UtilityFunctions from "../../../../Lib/UtilityFunctions";

export default class FrqOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: "",
            linkAction: "0",
            manageCategoryKey: this.getFirstCategoryKey(),
            showManageAdd: false,
            showManageRemove: false
        };

        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleLinkAction = this.handleLinkAction.bind(this);
        this.handleManageCatChange = this.handleManageCatChange.bind(this);
        this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleShowManageAdd = this.handleShowManageAdd.bind(this);
        this.handleShowManageRemove = this.handleShowManageRemove.bind(this);
    }

    getFirstCategoryKey() {
        if (UtilityFunctions.isObjEmpty(this.props["categories"])) {
            return "0";
        }
        return Object.keys(this.props["categories"])[0];
    }

    handleLinkChange(event) {
        this.setState({
            linkAction: event.target["value"]
        });
    }

    handleManageCatChange(event) {
        this.setState({
            manageCategoryKey: event.target["value"]
        });
    }

    handleLinkAction() {
        switch(this.state["linkAction"]) {
            case "add":
                this.props["categoryResponseLinkHandler"]("add");
                break;
            case "remove":
                this.props["categoryResponseLinkHandler"]("remove");
                break;
            default:
        }
    }

    handleRemoveCategory() {
        this.props["categoryManagementHandler"]("remove", this.state["manageCategoryKey"]);
    }

    handleAddCategory() {
        this.props["categoryManagementHandler"]("add", this.state["input"]);
    }

    handleTextInput(event) {
        this.setState({
            input: event.target["value"]
        });
    }

    handleShowManageAdd(event) {
        this.setState({
            showManageAdd: !this.state["showManageAdd"]
        });
    }

    handleShowManageRemove(event) {
        this.setState({
            showManageRemove: !this.state["showManageRemove"]
        })
    }

    render() {
        return (
            <>
            <Row className={"margin-top-15"}>
                <Col sm={8}>
                </Col>
                <Col>
                    <Button
                        color={"primary"}
                        className={"btn pai-btn"}
                        value={this.state["input"]}
                        onClick={this.handleShowManageAdd}
                    >
                        {"Add Category"}
                    </Button>
                </Col>
                <Col>
                    <Button
                        color={"primary"}
                        className={"btn pai-btn"}
                        value={this.state["input"]}
                        onClick={this.handleShowManageRemove}
                    >
                        {"Remove Category"}
                    </Button>
                </Col>
            </Row>
            <Row className={"margin-top-15 margin-bot-10"}>
                <Col sm={4}>
                    <Dropdown
                        value={this.props["question"]}
                        optionPairs={createQuestionOptions(this.props["questions"])}
                        onChangeHandler={this.props["questionChangeHandler"]}
                    />
                </Col>
                <Col sm={2}>
                </Col>
                {this.state["showManageAdd"] && <Col sm={6} className={"frq-options"}>
                    <Input onChange={this.handleTextInput} placeholder={"Create new category"}/>
                    <Button
                        color={"primary"}
                        className={"btn pai-btn"}
                        value={this.state["input"]}
                        onClick={this.handleAddCategory}
                    >
                        {"Create"}
                    </Button>
                </Col>}
            </Row>
            <Row>
                <Col sm={5} className={"frq-options"}>
                    <Dropdown
                        value={this.state["linkAction"]}
                        optionPairs={createLinkOptions()}
                        onChangeHandler={this.handleLinkChange}
                    />
                    {this.state["linkAction"] !== "0" && <Dropdown
                        value={this.props["category"]}
                        optionPairs={createCategoryOpions(this.props["categories"])}
                        onChangeHandler={this.props["categoryChangeHandler"]}
                    />}
                    {this.state["linkAction"] !== "0" && <Button
                        color={"primary"}
                        className={"btn pai-btn"}
                        onClick={this.handleLinkAction}
                    >
                        {"Apply"}
                    </Button>}
                </Col>
                <Col sm={1}>
                </Col>
                {this.state["showManageRemove"] && <Col sm={6} className={"frq-options frq-options-right"}>
                    <Dropdown
                        value={this.state["manageCategoryKey"]}
                        optionPairs={createCategoryOpions(this.props["categories"])}
                        onChangeHandler={this.handleManageCatChange}
                    />
                    <Button
                        color={"primary"}
                        className={"btn pai-btn"}
                        onClick={this.handleRemoveCategory}
                    >
                        {"Delete"}
                    </Button>
                </Col>}
            </Row>
            </>
        );
    }
};

function createQuestionOptions(questions) {
    let options = [{
        label: "All Questions",
        value: "0",
        key: "0"
    }];

    for (let i = 0; i < questions.length; ++i) {
        options.push({
            label: questions[i],
            value: questions[i],
            key: questions[i]
        });
    }

    return options;
}

function createCategoryOpions(categories) {
    if (categories.length === 0) {
        return [{
            label: "No Categories",
            value: "0",
            key: "0"
        }];
    }

    let options = [];

    for (let categoryKey in categories) {
        options.push({
            label: categories[categoryKey],
            value: categoryKey,
            key: categoryKey
        });
    }

    return options;
}

function createLinkOptions() {
    return [
        {
            label: "Select Action",
            value: "0",
            key: "0"
        },
        {
            label: "Add Category",
            value: "add",
            key: "add"
        },
        {
            label: "Remove Category",
            value: "remove",
            key: "remove"
        },
    ];
}
