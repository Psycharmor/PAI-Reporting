import React from "react";

import {Row, Col, Card, CardHeader, Input} from "reactstrap";

export default function UserFilters(props) {
    const userFilters = getUserFilters(props);

    return(
        <>
            <Row>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Team"}</h5>
                        </CardHeader>
                        {userFilters["team"]}
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Organization"}</h5>
                        </CardHeader>
                        {userFilters["organization"]}
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Role with Veterans"}</h5>
                        </CardHeader>
                        {userFilters["role"]}
                    </Card>
                </Col>
            </Row>
        </>
    )
};

/*
    Get the rendered JSX for each of the user filters
    Params:
        props -> (object) all props passed to the component
    Return:
        object -> all the jsx separated by filter
*/
function getUserFilters(props) {
    let userFilters = {
        team: [],
        organization: [],
        role: []
    };

    const surveyEntries = props["surveyEntries"];
    for (let portfolioId in surveyEntries) {
        for (let courseId in surveyEntries[portfolioId]["courses"]) {
            const entries = surveyEntries[portfolioId]["courses"][courseId]["entries"];
            for (let i = 0; i < entries.length; ++i) {
                const entry = entries[i];
                addToRender(userFilters["team"], entry["team"]);
                addToRender(userFilters["organization"], entry["organization"]);
                addToRender(userFilters["role"], entry["roleWithVeterans"]);
            }
        }
    }
    userFilters = {
        team: userFilters["team"].sort(),
        organization: userFilters["organization"].sort(),
        role: userFilters["role"].sort(),
    }
    return getRenderedOptions(userFilters, props);
}

/*
    Add the option to options if option doesn't exist in options // say it 3 times fast
    Params:
        options -> the list of options for a filter
        option  -> the option to be possibly added to options
    Return:
        undefined
*/
function addToRender(options, option) {
    if (!options.includes(option)) {
        options.push(option);
    }
}

/*
    Get the filters as select options
    Params:
        userFilters  -> all the possible options for each filter
        props -> (object) all props passed to the component
    Return:
        object -> all the jsx separated by filter
*/
function getRenderedOptions(userFilters, props) {
    let renderedOptions = {
        team: [<option key={0} value={0}>{"All Teams"}</option>],
        organization: [<option key={0} value={0}>{"All Organizations"}</option>],
        role: [<option key={0} value={0}>{"All Roles with Veterans"}</option>]
    };

    for (let filter in userFilters) {
        for (let i = 0; i < userFilters[filter].length; ++i) {
            const option = userFilters[filter][i];
            if (option) {
                renderedOptions[filter].push(
                    <option key={option} value={option}>{option}</option>
                );
            }
            else if (!option.trim()) {
                renderedOptions[filter].push(
                    <option key={""} value={""}>{"No " + filter}</option>
                );
            }
        }
    }

    return {
        team: (
            <Input type={"select"} value={props["team"]} onChange={props["teamHandler"]}>
                {renderedOptions["team"]}
            </Input>
        ),
        organization: (
            <Input type={"select"} value={props["organization"]} onChange={props["orgHandler"]}>
                {renderedOptions["organization"]}
            </Input>
        ),
        role: (
            <Input type={"select"} value={props["role"]} onChange={props["roleHandler"]}>
                {renderedOptions["role"]}
            </Input>
        )
    };
}
