import React from "react";

import LoadingOverlay from "react-loading-overlay";

import Table from "./table/Table";
import Summary from "./summary/Summary";

class Window extends React.Component {

    render() {

        return(
            <LoadingOverlay
                active={this.props.dashboardState.overlayActive}
                spinner
            >
            <Table
                dashboardState={this.props.dashboardState}
                handleCourseClick={this.props.handleCourseClick}
                handleUserClick={this.props.handleUserClick}
            />
            </LoadingOverlay>
        );
    }
}
export default Window;
