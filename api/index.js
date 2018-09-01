const express = require("express");
const app = express();

app.get("/", (request, response) => {
    response.send("gestor-financeiro-2.0");
});

app.listen(3000, () => {
    console.log("Server is listening!");
});