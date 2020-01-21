import React from "react";

import {Route, Redirect} from "react-router-dom";


const ProtectedRoute = ({component: Component, ...rest}) => {
    const user = localStorage.getItem("USER");
    return (
        <Route
            {...rest}
            render={props => user ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                        state: {
                            from: props.location
                        }
                    }}
                />
            )}
        />
    );
}
export default ProtectedRoute;
