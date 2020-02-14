import React from "react";

import {Container, Row, Col} from "reactstrap";
import GroupUploadDropzone from "./GroupUploadDropzone";

export default class GroupUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null
        };

        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleFileUpload(files) {
        this.setState({
            file: files[0]
        });
    }

    render() {
        console.log(this.state);
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={4}>
                        <GroupUploadDropzone
                            fileUploadHandler={this.handleFileUpload}
                            file={this.state["file"]}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
};
