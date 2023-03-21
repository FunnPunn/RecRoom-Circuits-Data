const fs = require("fs")
const { exit } = require("process")
const sortjson = require("sort-json")
const prompt = require("prompt-sync")({sigint: true})

const SortOptions = { ignoreCase: true, reverse: false, depth: 1 }

function CreateUnion() {

}
function CreateChip() {
    let name = prompt("What's the name of the chip? \n")
    let desc = prompt("What's the description of the chip? \n")
    let IsBeta = prompt("Is this chip a beta chip? (y/n) \n").toLowerCase()
    if(IsBeta == "y") IsBeta = true; else IsBeta = false;
    console.log("IsBeta set to".concat(IsBeta))
    let IsTroll = prompt("Is this chip a trolling risk? (y/n) \n").toLowerCase()
    if(IsTroll == "y") IsTroll = true; else IsTroll = false;
    console.log("IsTrollingRisk set to".concat(IsTroll))

    let FunctionCount = Number(prompt("How many functions does this chip have?"))
    if(!(FunctionCount == NaN)) {
        
    }
    exit(0)
}