import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import Dropzone from "react-dropzone";

export default function GroupUploadDropzone(props) {
    const label = (props["file"]) ? props["file"]["name"] : "Upload Users";

    return (
        <Card className={"height-100-percent"}>
            <CardHeader className={"pai-card-header"}>
                <h3>{"File Upload"}</h3>
                <h5>{"Upload file of the users"}</h5>
            </CardHeader>
            <CardBody className={"pai-card-body"}>
                <Dropzone
                    onDrop={props["fileUploadHandler"]}
                    multiple={false}
                >
                    {({getRootProps, getInputProps}) => (
                        <div>
                            <div {...getRootProps()} className={"pai-dropzone"}>
                                <input {...getInputProps()}/>
                                <p>{label}</p>
                            </div>
                        </div>
                    )}
                </Dropzone>
            </CardBody>
        </Card>
    );
};
