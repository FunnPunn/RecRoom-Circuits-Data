const { time } = require("console")
const { exit } = require("process")
const sortjson = require("sort-json")
const internal = require("stream")
const prompt = require("prompt-sync")({sigint: true})
var chips = require("fs").readFileSync("chips/chips.json")
const options = { ignoreCase: true, reverse: false, depth: 1}

const PossibleTypes = [
    "exec",
    "rec room object",
    "player",
    "int",
    "float",
    "string",
    "bool",
    "color",

    "vector3",
    "quaternion",
    /* Object types */
    "piston",
    "rotator",
    "seat",
    "ground vehicle",
    /* Constant types */
    "hud",
    "world ui",
    "room destination"
]

function Union(){
    const unionallowedvalues_am = Number(prompt("Enter the amount of union types"))
    let unionallowedvalues = []
    for(var x = 0; x < unionallowedvalues_am; x++){
        let message = "Union Port "
        let uniontype = prompt(message.concat("type - ")).toLowerCase()
        if(PossibleTypes.includes(uniontype)){
            unionallowedvalues.push(uniontype)
        } else {
            unionallowedvalues.push("err")
        }
    }
    return unionallowedvalues
}

const name = prompt("Enter the name of the chip - ")
const descr = prompt("Enter the official chip description - ")
const inputs_am = Number(prompt("Enter the amount of inputs - "))
const outputs_am = Number(prompt("Enter the amount of outputs - "))

var inputs = []
var outputs = []

if(inputs_am != NaN && Math.abs(inputs_am) != Infinity && outputs_am != NaN && Math.abs(outputs_am) != Infinity){
    console.log("===== Inputs =====")
    for(var i = 0; i<inputs_am; i++){
        let message = "Input Port "
        let portname = prompt(message.concat("name - "))
        let porttype = prompt(message.concat("type - ")).toLowerCase()
        let portdesc = prompt(message.concat("description (optional) - "))
        if(porttype == "union"){
            porttype = Union();
        } else console.log("no ".concat(porttype))
        if(portname != "" && porttype != ""){
            inputs.push({
                "Name": portname,
                "DataType": porttype,
                "Description": portdesc
            })
        }
        console.log("=================================")
    }
    console.log("===== Outputs =====")
    for(var i = 0; i<outputs_am; i++){
        let message = toString(i).concat(" Output Port ")
        let portname = prompt(message.concat("name - "))
        let porttype = prompt(message.concat("type - ")).toLowerCase()
        let portdesc = prompt(message.concat("description (optional) - "))

        if(portname != "" && porttype != ""){
            outputs.push({
                "Name": portname,
                "DataType": porttype,
                "Description": portdesc
            })
        }
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