import React from "react";

import {Paper} from "@material-ui/core";

class LabelValueBox extends React.Component {

    render() {
        return(
            <Paper>
                <h2>{this.props.boxContent.label}</h2>
                <h2>{this.props.boxContent.value}</h2>
            </Paper>
        );
    }
}
export default LabelValueBox;
