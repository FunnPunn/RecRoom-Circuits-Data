const fs = require("fs")
const { exit } = require("process")
const sortjson = require("sort-json")
const prompt = require("prompt-sync")({sigint: true})

const chipjson = fs.readFileSync("data/ports.json")
const PossibleTypes = JSON.parse(chipjson)["Ports"]

var namer = ""
const infomessage = `
Funn's
Chip
Creator
`

var chips = JSON.parse(fs.readFileSync("data/chips.json"))
const options = { ignoreCase: true, reverse: false, depth: 1}
var json = {}
var outjson = {}
/*
const PossibleTypes = [
    "exec",
    "bool",
    "float",
    "int",
    "quaternion",
    "string",
    "vector3",
    "rec room object",
    "player",
    
    "color",
    "audio",
    "collision data",
    "hud element",
    "consumable",
    "destination room",
    "player world ui",
    "room key",
    "tuple",

    "any",
    
    "background objects",
    "fog",
    "skydome",
    "sun",
    
    "audio player",
    "beacon",
    "button",
    "costume",
    "die",
    "light",
    "emitter",
    "explosion emitter",
    "ground vehicle",
    "interaction volume",
    "invisible collision",
    "piston",
    "player spawn point",
    "projectile launcher",
    "rotator",
    "room door",
    "seat",
    "sfx",
    "text",
    "text screen",
    "toggle button",
    "trigger handle",
    "trigger volume",
    "vector component",
    "welcome mat",
    "ai",
    "gun handle",
    "laser pointer",
    "patrol point",
    "sun direction",
    ]
    */
    //Thanks, HaulMiner!
function List(){
    console.log("========== List Creator ==========")
    let datatypes = PossibleTypes
    datatypes.splice(datatypes.indexOf("exec") ,1)
    let ltype = prompt("Enter the list type - ")
    if(datatypes.includes(ltype)) {
        return("list<".concat(ltype, ">"))
    }
}
function Union(){
    console.log("========== Union Creator ==========")
    const unionallowedvalues_am = Number(prompt("Enter the amount of union types - "))
    let unionallowedvalues = []
    for(var x = 0; x < unionallowedvalues_am; x++){
        let message = "Union Port "
        let uniontype = prompt(message.concat("type - ")).toLowerCase()
        if(PossibleTypes.includes(uniontype)){
            unionallowedvalues.push(uniontype)
        } else {
            if(uniontype == "list") {
                unionallowedvalues.push(List())
            } else{
            unionallowedvalues.push("err")}
        }
    }
    return unionallowedvalues
}

function CreateChip(){
namer = prompt("Enter the name of the chip - ")
const descr = prompt("Enter the official chip description - ")
const depr = prompt("Deprecation stage of the chip (Active|Deprecated|Removed)- ").toLowerCase()
if(!["active", "deprecated", "removed"].includes(depr)) depr = "active";
var beta = prompt("Is this chip beta? (y) - ")
var troll = prompt("Is this chip a trolling risk? (y) - ")

if(beta.toLowerCase == "y") beta = true; else beta = false;
if(troll.toLowerCase == "y") troll = true; else troll = false;

const inputs_am = Number(prompt("Enter the amount of inputs - "))
const outputs_am = Number(prompt("Enter the amount of outputs - "))

var inputs = []
var outputs = []
if(inputs_am != NaN && Math.abs(inputs_am) != Infinity && outputs_am != NaN && Math.abs(outputs_am) != Infinity){
    console.log("========== Inputs ==========")
    for(var i = 0; i<inputs_am; i++){
        let message = "Input Port "
        let portname = prompt(message.concat("name - "))
        let porttype = prompt(message.concat("type - ")).toLowerCase()
        let portdesc = prompt(message.concat("description (optional) - "))
        if(porttype == "union"){
            porttype = Union()
        } else {
        if(porttype == "list"){
            porttype = List()
        }
        else{
            if(!PossibleTypes.includes(porttype)){
            porttype = "err"
        }}
        }
        if(porttype != ""){
            const data = {
                "Name": portname,
                "DataType": porttype,
                "Description": portdesc
            }
            inputs.push(data)
            console.log(data)
        } else i--;
        console.log("*")
    }
    console.log("========== Outputs ==========")
    for(var i = 0; i<outputs_am; i++){
        let message = ("Output Port ")
        let portname = prompt(message.concat("name - "))
        let porttype = prompt(message.concat("type - ")).toLowerCase()
        let portdesc = prompt(message.concat("description (optional) - "))

        if(porttype == "union"){
            porttype = Union()
        } else {
        if(porttype == "list"){
            porttype = List()
        }
        else{
            if(!PossibleTypes.includes(porttype)){
            porttype = "err"
        }}
        }

        if(porttype != ""){
            const data = {
                "Name": portname,
                "DataType": porttype,
                "Description": portdesc
            }
            outputs.push(data)
            console.log(data)
        } else i--;
        console.log("*")
    }
    
    json = {
        "Description": descr,
        "IsBeta": beta,
        "IsTrollingRisk": troll,
        "Inputs": inputs,
        "Outputs": outputs
    }
    return namer;
} else {
    console.log("Invalid #")
    exit(0)
}

console.log(inputs)
console.log(outputs)
}

function runConsole(){
    var cmd = prompt("Enter command. 'help' for a list of commands. - ")
    switch (cmd) {
        case "help":
            console.log(`Options are: 
            create - Creates a chip and adds it to the merge list
            merge - Merge the created chip with the JSON file
            remove - Remove a chip from the JSON file
            `)
            break;
        case "create":
            CreateChip()
            break;
        case "merge":
            console.log(json)
            var response = prompt("Do you want to merge the above chip with the JSON file? (y) - ")
            if(response.toLowerCase() == "y"){
                chips[namer] = json
                outjson = sortjson(chips, options)
                fs.writeFileSync("data/chips.json", JSON.stringify(outjson, null , 4))
            }
            break;
        case "remove":
            const jsonremove = prompt("Which key would you like to remove? (visit the json for reference) - ")
            if(chips[jsonremove]){
                delete chips[jsonremove]
                console.log("Deleted.")
                fs.writeFileSync("data/chips.json", JSON.stringify(chips, null, 4))
            } else {
                console.log("Key doesn't exist.")
            }
            break;
        default:
            break;
    }
    runConsole()
}
console.log(infomessage)
runConsole()