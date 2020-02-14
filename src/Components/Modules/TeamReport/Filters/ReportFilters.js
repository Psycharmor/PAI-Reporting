import React from "react";

import {Row, Col} from "reactstrap";
import Datetime from "react-datetime";

import Dropdown from "../../../Forms/Dropdown";
import UtilityFunctions from "../../../../Lib/UtilityFunctions";

export default function ReportFilters(props) {
    const groupOptions = getGroupOptions(props["groups"], props["groupIds"]);
    const subgroupOptions = getSubgroupOptions(props["groups"], props["groupId"], props["subgroupId"]);
    const subgroupDropdown = renderSubgroupDropdown(props["groups"], props["groupId"],
                                props["subgroupId"], subgroupOptions, props["subgroupChangeHandler"]);

    return (
        <Row className={"margin-bot-30"}>
            <Col sm={6} md={3}>
                <Dropdown
                    value={props["groupId"]}
                    optionPairs={groupOptions}
                    onChangeHandler={props["groupChangeHandler"]}
                />
            </Col>
            {subgroupDropdown}
            <Col sm={6} md={3}>
                <Datetime
                    inputProps={{
                        placeholder: "mm/dd/yyyy"
                    }}
                    className={"pai-date"}
                    value={props["startDate"]}
                    timeFormat={false}
                    isValidDate={(currentDate) => {
                        return currentDate.isBefore(props["endDate"]);
                    }}
                    onChange={props["startDateChangeHandler"]}
                />
            </Col>
            <Col sm={6} md={3}>
                <Datetime
                    inputProps={{
                        placeholder: "mm/dd/yyyy"
                    }}
                    className={"pai-date"}
                    value={props["endDate"]}
                    timeFormat={false}
                    isValidDate={(currentDate) => {
                        return currentDate.isAfter(props["startDate"]);
                    }}
                    onChange={props["endDateChangeHandler"]}
                />
            </Col>
        </Row>
    );
};

function getGroupOptions(groups, groupIds) {
    let groupOptions = [];
    for (let groupId in groups) {
        if (groupIds.includes(groupId)) {
            groupOptions.push({
                label: groups[groupId]["title"],
                value: groupId,
                key: groupId
            });
        }
    }

    return groupOptions.sort(comparator);
}

function renderSubgroupDropdown(groups, groupId, subgroupId, subgroupOptions, handler) {
    if ("subgroups" in groups[groupId] && !UtilityFunctions.isObjEmpty(groups[groupId]["subgroups"])) {
        return (
            <Col sm={6} md={3}>
                <Dropdown
                    value={subgroupId}
                    optionPairs={subgroupOptions}
                    onChangeHandler={handler}
                />
            </Col>
        );
    }
}

function getSubgroupOptions(groups, groupId, subgroupId) {
    let subgroupOptions = [];
    if ("subgroups" in groups[groupId]) {
        const subgroups = groups[groupId]["subgroups"];
        for (let subgroupId in subgroups) {
            subgroupOptions.push({
                label: subgroups[subgroupId]["title"],
                value: subgroupId,
                key: subgroupId
            });
        }
    }

    subgroupOptions.sort(comparator).unshift({
        label: "select subgroup",
        value: 0,
        key: 0
    });

    return subgroupOptions;
}

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
