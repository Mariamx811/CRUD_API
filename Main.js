const express = require("express");
const teamsPath = require("./routes/teams");
const app = express();

app.use("/teams",teamsPath);


app.listen(5000,"localhost",()=>{
    console.log("You are listening on port 5000");
});