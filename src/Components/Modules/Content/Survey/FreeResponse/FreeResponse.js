import React from "react";

import {Card, CardHeader} from "reactstrap";

import FrqTable from "./FrqTable";
import FrqFunctionality from "./FrqFunctionality";

/*
    Component for the free response questions table and categorization
*/
class FreeResponse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: "What aspects of the course did you find especially helpful", // frq responses to display
            category: "CAT 1", // what category to (un)assign the selected comments to
            selectedRows: [], // the table row keys that are selected for categorization
            selectedComments: [] // the objects that will be sent to the server table via API
        };

        this.handleActiveQuestionChange = this.handleActiveQuestionChange.bind(this);
        this.handleActiveCategoryChange = this.handleActiveCategoryChange.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
        this.handleRemoveCategory = this.handleRemoveCategory.bind(this);
        this.handleAddNewCategory = this.handleAddNewCategory.bind(this);
        this.handleRemoveCategoryFromList = this.handleRemoveCategoryFromList.bind(this);
        this.handleSingleRowSelect = this.handleSingleRowSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleTablePageAndSizeChange = this.handleTablePageAndSizeChange.bind(this);
    }

    // Event Handlers

    /*
        Change which question to show responses for
        Params:
            event -> (Event) The event that was triggered
        Return:
            undefined
    */
    handleActiveQuestionChange(event) {
        this.setState({
            question: event.target["value"]
        });
    }

    /*
        Change which category to assign/unassign responses to
        Params:
            event -> (Event) The event that was triggered
        Return:
            undefined
    */
    handleActiveCategoryChange(event) {
        this.setState({
            category: event.target["value"]
        });
    }

    /*
        Change which rows will be shown as selected on the table and also
        what will be sent to the server
        Params:
            row       -> (object) the table row
            isSelect  -> (bool) are we selecting or de-selecting
            rowIndex  -> (int) the index of the row relative to the table
            event     -> (Event) the event that was triggered
        Return:
            bool -> whether the table will select the row or not
    */
    handleSingleRowSelect(row, isSelect, rowIndex, event) {
        let selectedRows = this.state["selectedRows"];
        let selectedComments = this.state["selectedComments"];
        if (isSelect) {
            selectedRows.push(row["index"]);
            selectedComments.push({
                userId: row["userId"],
                response: row["response"],
                dateSubmitted: row["dateSubmitted"]
            });
        }
        else {
            let index = selectedRows.indexOf(row["index"]);
            selectedRows.splice(index, 1);
            for (let i = 0; i < selectedComments.length; ++i) {
                const selectedComment = selectedComments[i];
                if (row["userId"] === selectedComment["userId"] &&
                        row["response"] === selectedComment["response"] &&
                        row["dateSubmitted"] && selectedComment["dateSubmitted"]) {
                    selectedComments.splice(i, 1);
                    break;
                }
            }
        }
        this.setState({
            selectedRows: selectedRows,
            selectedComments: selectedComments
        });

        return false; // prevent table from doing its own selection
    }

    /*
        Select all the rows on the page or de-select all
        Params:
            isSelect -> (bool) are we selecting or de-selecting
            rows     -> (array) all the rows on the page
            event    -> (Event) the event that was triggered
        Return:
            array -> what the table will set the selected rows to
    */
    handleSelectAll(isSelect, rows, event) {
        let selectedRows = [];
        let selectedComments = [];
        if (isSelect) {
            for (let i = 0; i < rows.length; ++i) {
                selectedRows.push(rows[i]["index"]);
                selectedComments.push({
                    userId: rows[i]["userId"],
                    response: rows[i]["response"],
                    dateSubmitted: rows[i]["dateSubmitted"]
                });
            }
        }
        this.setState({
            loading: false,
            selectedRows: selectedRows,
            selectedComments: selectedComments
        });

        return [];
    }

    /*
        Reset the selected rows on page change and page size change
        Params:
            page        -> (int) current page
            sizePerPage -> (int) how many rows to display per page
        Return:
            undefined
    */
    handleTablePageAndSizeChange(page, sizePerPage) {
        this.setState({
            selectedRows: [],
            selectedComments: []
        });
    }

    /*
        Send an API call to the server that adds the selected category into
        the selected comments
        Params:
            none
        Return:
            undefined
    */
    handleAddCategory() {
        console.log("Add", this.state["category"], this.state["selectedComments"]);
    }

    /*
        Send an API call to the server that removes the selected category into
        the selected comments
        Params:
            none
        Return:
            undefined
    */
    handleRemoveCategory() {
        console.log("Remove", this.state["category"], this.state["selectedComments"]);
    }

    /*
        Add a new category for the list
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleAddNewCategory(event) {
        const newCategory = event.target["value"];
        if (newCategory && newCategory.trim()) {
            console.log("Add new", newCategory);
            // api call to add new category to server
            //      add to category table
            // api call to refetch categories
        }
    }

    /*
        Remove a category for the list
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleRemoveCategoryFromList(event) {
        const category = event.target["value"];
        if (category && category.trim()) {
            console.log("Add new", category);
            // api call to remove new category from server
            //      remove from category table
            //      remove all rows that contain category from entries table
            // api call to refetch entries and categories
        }
    }

    render() {
        console.log(this.state["selectedRows"], this.state["selectedComments"]);
        return (
            <Card className={"table-card frq"}>
                <CardHeader>
                    <h3>{"Free Response Results"}</h3>
                    <p>{"View & categorize comments from FreeForm questions"}</p>
                    <FrqFunctionality
                        question={this.state["question"]}
                        category={this.state["category"]}
                        changeQuestionHandler={this.handleActiveQuestionChange}
                        changeCategoryHandler={this.handleActiveCategoryChange}
                        addCategoryHandler={this.handleAddCategory}
                        removeCategoryHandler={this.handleRemoveCategory}
                        addNewCategoryHandler={this.handleAddNewCategory}
                        removeCategoryFromListHandler={this.handleRemoveCategoryFromList}
                    />
                </CardHeader>
                <FrqTable
                    results={this.props["results"]}
                    portfolioId={this.props["portfolioId"]}
                    courseId={this.props["courseId"]}
                    question={this.state["question"]}
                    selectedRows={this.state["selectedRows"]}
                    singleRowSelectHandler={this.handleSingleRowSelect}
                    selectAllHandler={this.handleSelectAll}
                    pageAndSizeChangeHandler={this.handleTablePageAndSizeChange}
                />
            </Card>
        );
    }
}
export default FreeResponse;
