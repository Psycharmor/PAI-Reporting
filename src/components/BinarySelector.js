import React from "react";

import {Select} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

class BinarySelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: this.props["options"],
            selected: this.props["selected"],
            valueOptions: [],
            valueSelected: []
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.setState({
                options: this.props["options"],
                selected: this.props["selected"],
                valueOptions: [],
                valueSelected: []
            });
        }
    }

    handleOptionsChanged(options, selectedChanged) {
        let stateToChange = "valueOptions";
        if (selectedChanged) {
            stateToChange = "valueSelected";
        }
        let newValues = [];
        for (let i = 0; i < options.length; ++i) {
            if (options[i].selected) {
                newValues.push(options[i].value);
            }
        }
        this.setState({
            [stateToChange]: newValues
        });
    }

    render() {
        const options = this.renderOptions(false);
        const selected = this.renderOptions(true);

        return (
            <div>
                <Select
                    multiple
                    native
                    value={this.state["valueOptions"]}
                    onChange={(e) => this.handleOptionsChanged(e.target, false)}
                >
                    {options}
                </Select>
                <ArrowForwardIosIcon
                    onClick={() => {this.props["handler"](this.state["valueOptions"], false)}}
                />
                <ArrowBackIosIcon
                    onClick={() => {this.props["handler"](this.state["valueSelected"], true)}}
                />
                <Select
                    multiple
                    native
                    value={this.state["valueSelected"]}
                    onChange={(e) => this.handleOptionsChanged(e.target, true)}
                >
                    {selected}
                </Select>
            </div>
        );
    }

    renderOptions(renderSelected) {
        let options = [];
        let list = this.state["options"];
        if (renderSelected) {
            list = this.state["selected"];
        }
        let orderedKeys = Object.keys(list).sort((a, b) => {
            const titleA = list[a]["title"].toUpperCase();
            const titleB = list[b]["title"].toUpperCase();
            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }

            return 0;
        });
        for (let i = 0; i < orderedKeys.length; ++i) {
            const courseId = orderedKeys[i];
            options.push(
                <option key={courseId} value={courseId}>{list[courseId]["title"]}</option>
            );
        }

        return options;
    }
}
export default BinarySelector;
