import React from "react";

import {Spinner} from "reactstrap";

export default function LoadingOverlay(props) {
    return (
        <div className={"loading-overlay"}>
            <Spinner className={"loading-spinner"}/>
        </div>
    );
};
