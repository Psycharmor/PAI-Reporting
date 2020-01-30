import React from "react";

import {Row, Col, Button, InputGroup, InputGroupAddon, Input} from "reactstrap";

import Dropdown from "./Dropdown";
import ApiHandler from "../../../../../Lib/ApiHandler";

class FrqFunctionality extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categoryToAdd: "",
            categoryToRemove: ""
        };

        this.handleAddTextInput = this.handleAddTextInput.bind(this);
        this.handleRemoveTextInput = this.handleRemoveTextInput.bind(this);
    }

    handleAddTextInput(event) {
        this.setState({
            categoryToAdd: event.target["value"]
        });
    }

    handleRemoveTextInput(event) {
        this.setState({
            categoryToRemove: event.target["value"]
        });
    }

    render() {
        return (
            <>
            <Row className={"frq-row"}>
                <Col sm={6}>
                    <Dropdown
                        value={this.props["question"]}
                        changeHandler={this.props["changeQuestionHandler"]}
                        options={[
                            "What aspects of the course did you find especially helpful",
                            "What aspects of the course would you like to see changed",
                            "Application: We are interested in understanding how you applied the content",
                            "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"
                        ]}
                    />
                </Col>
                <Col sm={6}>
                    <InputGroup>
                        <Input onChange={this.handleAddTextInput}/>
                        <InputGroupAddon addonType={"append"}>
                            <Button value={this.state["categoryToAdd"]} onClick={this.props["addNewCategoryHandler"]}>
                                {"Add new category"}
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
            </Row>
            <Row className={"frq-row"}>
                <Col sm={6}>
                    <Dropdown
                        value={this.props["question"]}
                        changeHandler={this.props["changeCategoryHandler"]}
                        options={[
                            "CAT 1",
                            "CAT 2",
                            "CAT 3",
                            "CAT 4"
                        ]}
                    />
                </Col>
                <Col sm={6}>
                    <InputGroup>
                        <Input onChange={this.handleRemoveTextInput}/>
                        <InputGroupAddon addonType={"append"}>
                            <Button value={this.state["categoryToRemove"]} onClick={this.props["removeCategoryFromListHandler"]}>
                                {"Remove category"}
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
            </Row>
            <Row className={"frq-row"}>
                <Col sm={2}>
                    <Button
                        color={"primary"}
                        className={"filter-btn frq-btn"}
                        onClick={this.props["addCategoryHandler"]}
                    >
                        {"Add Category"}
                    </Button>
                </Col>
                <Col sm={2}>
                    <Button
                        color={"primary"}
                        className={"filter-btn frq-btn"}
                        onClick={this.props["removeCategoryHandler"]}
                    >
                        {"Remove Category"}
                    </Button>
                </Col>
            </Row>
            </>
        );
    }
};
export default FrqFunctionality;
