const { json } = require("d3")
const fs = require("fs")
const { exit } = require("process")
const sortjson = require("sort-json")
const prompt = require("prompt-sync")({sigint: true})
const Ports_Unparsed = fs.readFileSync("data/ports.json")
const Ports = Object.keys(JSON.parse(Ports_Unparsed)["Ports"])
const SortOptions = { ignoreCase: true, reverse: false, depth: 1 }

const exportfile = "data/chips_test.json"

const filetomerge = JSON.parse(fs.readFileSync(exportfile))

function CreateUnion() {
    let thing = Number(prompt("How many union values? - "))
    if(thing != NaN) {
        var returnvalues = []
        for(var i = 0; i < thing; i++) {
            let union = prompt("Union Type: ").toLowerCase()
            if(Ports.includes(union) || union == "exec") {
                union = "any"
            };
            console.log("Added ".concat(union, "."))
            returnvalues.push(union)
        }
        return returnvalues;
    } else return "any";
}
function CreateChip() {
    let OutChip = {}
    let name = prompt("What's the name of the chip? - ")
    let desc = prompt("What's the description of the chip? - ")
    let IsBeta = prompt("Is this chip a beta chip? (y/n) - ").toLowerCase()
    if(IsBeta == "y") IsBeta = true; else IsBeta = false;
    console.log("IsBeta set to ".concat(IsBeta))
    let IsTroll = prompt("Is this chip a trolling risk? (y/n) - ").toLowerCase()
    if(IsTroll == "y") IsTroll = true; else IsTroll = false;
    console.log("IsTrollingRisk set to ".concat(IsTroll))
    OutChip["Description"] = desc
    OutChip["IsBeta"] = IsBeta
    OutChip["IsTrollingRisk"] = IsTroll
    OutChip["Functions"] = []
    let FunctionCount = Number(prompt("How many functions does this chip have? - "))
    if(FunctionCount != NaN) {
        for(var i = 0; i<FunctionCount; i++) {
            console.log("==========".concat(" Function " , String(i+1), "/", String(FunctionCount, " ")))
            
            let Inputs = []
            let Outputs = []

            let InCount = Number(prompt("How many inputs does this function have? - "))
            if(InCount != NaN) {
                console.log("Accepted!")
            } else {
                InCount = 0
                console.log("Invalid, using 0.")
            }
            let OutCount = Number(prompt("How many outputs does this function have? - "))
            if(OutCount != NaN) {
                console.log("Accepted!")
            } else {
                OutCount = 0
                console.log("Invalid, using 0.")
            }

            console.log("========== Inputs ==========")
            for(var n = 0; n < InCount; n++){
                console.log("==========".concat(" Port " , String(i+1), "/", String(InCount, " ")))
                const portname = prompt("Port Name: - ")
                const portdesc = prompt("Port Description: - ")
                let porttype = prompt("Data Type: - ").toLowerCase()
                let IsList = false

                if(!Ports.includes(porttype)) {
                    if(porttype == "union") {
                        porttype = CreateUnion()
                    }
                    else if(porttype == "list") {
                        IsList = true
                        let ListType = prompt("List Data Type: ").toLowerCase()
                        if(!Ports.includes(ListType) && ListType != "exec") {
                            ListType = "any"
                            console.log("Invalid Data Type... Using 'Any'.")
                        }
                        if(ListType == "union") {
                            ListType = CreateUnion()
                        }
                        porttype = ListType
                    }
                    else {
                    porttype = "any"
                    console.log("Invalid Data Type... Using 'Any'.")}
                }
                Inputs.push(
                    {
                        "Name": portname,
                        "Description": portdesc,
                        "DataType": porttype,
                        "IsList": IsList
                    }
                )
            }
            console.log("========== Outputs ==========")
            for(var n = 0; n < OutCount; n++){
                console.log("==========".concat(" Port " , String(i+1), "/", String(OutCount, " ")))
                const portname = prompt("Port Name: ")
                const portdesc = prompt("Port Description: ")
                let porttype = prompt("Data Type: ").toLowerCase()
                let IsList = false

                if(!Ports.includes(porttype)) {
                    if(porttype == "union") {
                        porttype = CreateUnion()
                    }
                    else if(porttype == "list") {
                        IsList = true
                        let ListType = prompt("List Data Type: ").toLowerCase()
                        if(!Ports.includes(ListType)) {
                            ListType = "any"
                            console.log("Invalid Data Type... Using 'Any'.")
                        }
                        porttype = ListType
                    }
                    else {
                    porttype = "any"
                    console.log("Invalid Data Type... Using 'Any'.")}
                }
                Outputs.push(
                    {
                        "Name": portname,
                        "Description": portdesc,
                        "DataType": porttype,
                        "IsList": IsList
                    }
                )
            }
            OutChip["Functions"].push({
                "Inputs": Inputs,
                "Outputs": Outputs
            })
        }
    }
    return [name, OutChip];
}

function cmd() {
    const response = prompt("Enter command. 'Help' for help. - ").toLowerCase()
    switch (response) {
        case "help":
            console.log("'Help' for help \n 'set' to set an existing chip or create a new one")
            break;
        case "set":
            const [chipname, chipdata] = CreateChip()
            prompt("Ready to merge? Cancel this script for 'no'.")
            filetomerge[chipname] = chipdata
            fs.writeFileSync(exportfile, JSON.stringify(sortjson(filetomerge, SortOptions), null, 4))
            break;
        default:
            break;
    }
    cmd()
}

console.log(CreateChip())