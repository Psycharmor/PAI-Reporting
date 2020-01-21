import React, {Component} from "react";

import {Label, Button, Alert} from "reactstrap";
import {AvForm, AvGroup, AvField} from "availity-reactstrap-validation";

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.axios = require("axios").default;
        this.siteUrl = "http://staging.psycharmor.org/";
        this.api = {
            wp: "wp-json/",
            jwt: "jwt-auth/v1/",
        };
        this.endpoint = "token/";
        this.state = {
            loading: false,
            username: "",
            password: "",
            error: ""
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    handleLogin(event) {
        const { username, password } = this.state;
        this.setState({
            loading: true,
            error: ""
        });
        this.axios.post("http://staging.psycharmor.org/" + this.api["wp"] + this.api["jwt"] + this.endpoint, {
            username,
            password
        })
        .then((user) => {
            if (user.data["user_role"].includes("administrator") || user.data["user_role"].includes("group_leader")) {
                console.log(user.data["user_role"]);
                this.handleLoginSuccess(user.data);
            }
            else {
                throw new Error("Sorry, You don't have permission to access PsychArmor Reporting");
            }
        })
        .catch((error) =>
            this.handleLoginFail(error)
        )
    }

    handleLoginSuccess(user) {
        localStorage.setItem("USER", JSON.stringify(user));
        this.setState({
            loading: false,
            username: '',
            password: '',
            error: ''
        });
        this.props.history.push('/Dashboard');
    }

    handleLoginFail(error) {
        this.setState({
            loading: false,
            error: 'Invalid username / password'
        });
    }

    handleUsername(event) {
        const username = event.target["value"];
        this.setState({
            username: username
        });
    }

    handlePassword(event) {
        const password = event.target["value"];
        this.setState({
            password: password
        });
    }

    renderError() {
        if (this.state["error"]) {
            return (
                <Alert color={"danger"}>{this.state.error}</Alert>
            );
        }
        else if (this.state["loading"]) {
            return (
                <Alert color={"primary"}>{"Loading..."}</Alert>
            );
        }
    }

    render() {
        return (
            <div className={"login"}>
                <h1>
                    <a href={"https://psycharmor.org"} target={"_blank"} rel={"noopener noreferrer"}>
                        <img alt={"psycharmor"} src={"https://s3-us-west-1.amazonaws.com/psycharmor/wp-content/uploads/2019/06/13093821/pai-for-wordpress.png"}/>
                    </a>
                </h1>
                <AvForm
                    onSubmit={this.handleLogin}
                >
                    <AvGroup>
                        <Label for={"loginUsername"}>Username</Label>
                        <AvField
                            name={"loginUsername"}
                            type={"text"}
                            errorMessage={"Username cannot be empty!"}
                            onChange={this.handleUsername}
                            validate={{
                                required: {value: true}
                            }}
                        />
                    </AvGroup>
                    <AvGroup>
                        <Label for={"loginPassword"}>Password</Label>
                        <AvField
                            name={"loginPassword"}
                            type={"password"}
                            errorMessage={"Password cannot be empty!"}
                            onChange={this.handlePassword}
                            validate={{
                                required: {value: true}
                            }}
                        />
                    </AvGroup>
                    <Button color={"primary"}>Login</Button>
                </AvForm>
            </div>
        );
    }
}
export default LoginForm;
