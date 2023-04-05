const express = require("express");
const router = express.Router();
const fs = require('fs');

router.use(express.json());

router.get("/",(req,res) =>{
    try
    {
        const teams = readData_ToJSON("./teamsData.json");
        if(teams == '0' || teams.length == 0)
        {
            res.send("No Teams yet");
        }
        else
            res.send(teams);
    }
    catch
    {
        res.status(502).send("Error in retrieving data");
    }
});

router.post("/",(req,res)=>{
    let ID;
    let entries = [];
    let tmp;
    let newObj;
    let teams;
    //Reading the data to check for the max ID 
    try
    {
        teams = readData_ToJSON("./teamsData.json");
        if(teams == '0' || teams.length == 0)
        {
            ID = 0;
            teams = []; 
        }
        else
        {
            entries = Object.values(teams); 
            tmp = entries[entries.length -1];
            ID = tmp["id"] + 1;
        }
    }
    catch(err)
    {
        res.status(502).send("Error in retrieving data");
    }
    newObj = {
        "id" : ID,
        "name" : req.body.name,
        "trophies" :  req.body.trophies,
        "points" : req.body.points
    }
    teams.push(newObj);
    
    try
    {
        writeData_ToString("./teamsData.json",teams);
        res.send(teams);
    }
    catch
    {
        res.status(502).send("Message adding failed");
    }
});

router.patch("/:id",(req,res)=>{
    let ID = req.query["id"];
    let teams;
    let entries = [];
    let entry;
    let found = false;

    let Name = req.body["name"];
    let Trophies = req.body["trophies"];
    let Points = req.body["points"];
    try
    {
        teams = readData_ToJSON("./teamsData.json");
        if(teams == '0' || teams.length == 0)
        {
            res.status(402).send("No Data to update");
        }
        else
        {
            entries = Object.values(teams); 
            for(let i = 0;i <entries.length;i++)
            {
                entry = entries[i];
                if(ID == entry["id"])
                {
                    found = true;
                    if(Name == undefined)
                        Name = entry["name"];
                    if(Trophies == undefined)
                        Trophies = entry["trophies"];
                    if(Points == undefined)
                        Points = entry["points"];

                    entry["name"] = Name;
                    entry["trophies"] = Trophies;
                    entry["points"] = Points;

                    break;
                }
            }
            if(found)
            {
                writeData_ToString("./teamsData.json",teams);
                res.send(teams);
            }
            else res.status(403).send("ID Doesn't exist");
            found =false;
        }
    }
    catch
    {
        res.status(501).send("Updating Data Failed");
    }
});

router.delete("/:id",(req,res) => {
    let ID = req.query["id"];
    let entries = [];
    let entry;
    let found = true;
    try
    {
        teams = readData_ToJSON("./teamsData.json");
        if(teams == '0' || teams.length == 0)
        {
            res.status(402).send("No Data to update");
        }
        else
        {
            entries = Object.values(teams); 
            for(let i = 0;i <entries.length;i++)
            {
                entry = entries[i];
                if(ID == entry["id"])
                {
                    found = true;
                    entries.splice(i,1);
                    teams = entries;
                    break;
                }
            }
            if(found)
            {
                writeData_ToString("./teamsData.json",teams);
                res.send(teams);
            }
            else res.status(403).send("ID Doesn't exist");
            found =false;
        }
    }
    catch(error)
    {
        console.log(error)
        res.status(501).send("Data deletion failed");
    }

});

function readData_ToJSON (path)
{   
    try{
    const teamsData_String = fs.readFileSync(path,"utf-8");
    
    if(teamsData_String.length == 0)
        return 0

    const teams = JSON.parse(teamsData_String);
    return teams;
    }
    catch(err)
    {
        throw new Error("Error in retrieving data");
    }
}

function writeData_ToString(path,data)
{
    try{
        fs.writeFileSync(path,JSON.stringify(data));

        }
        catch(err)
        {
            throw new Error("Message adding failed");
        }
}

module.exports = router;