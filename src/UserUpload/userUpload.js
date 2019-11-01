import axios from "axios";

function uploadFileToClient(file) {
    let data = new FormData();
    data.append("file", file);
    axios.post("http://localhost:5000/uploads", data, {})
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });
}
export default uploadFileToClient;
