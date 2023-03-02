const { time } = require("console")
const { exit } = require("process")
const sortjson = require("sort-json")
const internal = require("stream")
const prompt = require("prompt-sync")({sigint: true})
var chips = require("fs").readFileSync("chips/chips.json")
const options = { ignoreCase: true, reverse: false, depth: 1}

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

const name = prompt("Enter the name of the chip - ")
const descr = prompt("Enter the official chip description - ")
var beta = prompt("Is this chip beta? (y) - ")
var troll = prompt("Is this chip a trolling risk? (y) - ")

if(beta.toLowerCase == "y") beta = true; else beta = false;
if(troll.toLowerCase == "y") troll = true; else troll = false;

const inputs_am = Number(prompt("Enter the amount of inputs - "))
const outputs_am = Number(prompt("Enter the amount of outputs - "))

var inputs = []
var outputs = []

var json = {}
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
        "Name": name,
        "Description": descr,
        "IsBeta": beta,
        "IsTrollingRisk": troll,
        "Inputs": inputs,
        "Outputs": outputs
    }
} else {
    console.log("Invalid #")
    exit(0)
}

console.log(inputs)
console.log(outputs)
/*
const formatted = JSON.parse(chips)
const sorted = sortjson(formatted, options)

console.log(sorted) */