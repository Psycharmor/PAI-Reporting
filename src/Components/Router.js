import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginForm from "./Modules/Login/LoginForm";
import Controller from "./Controller";
import NotFound from "./NotFound";
import ProtectedRoute from "./ProtectedRoute";

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/"} component={LoginForm}/>
                <ProtectedRoute path={"/Dashboard"} component={Controller}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    );
}
export default Router;
