const fs = require("fs")
let original_raw = fs.readFileSync("chips/originalchips.json");

let original = JSON.parse(original_raw)

var Chips = Object.values(original)[0]
var UUIDS = Object.keys(Chips)
var Keys = Object.values(Chips)
var Out = {}

var key = Keys[0]
console.log(key["ReadonlyChipName"])

for(var k of Keys){
    Out[k["ReadonlyChipName"]] = {
        "Description": k["Description"],
        "IsBeta": k["IsBetaChip"],
        "IsTrollingRisk": k["IsTrollingRisk"],
        "DeprecationStage": k["DeprecationStage"],
        "NodeDescs": k["NodeDescs"]
    }
}
fs.writeFileSync("chips/chips.json", JSON.stringify(Out, null, 4))
/* JSON Structure:
{
    "Chip Name": {
        Description
        IsBeta
        IsTrollingRisk
        DeprecationStage
        NodeDescs (SHOULD CHANGE)
    }
}
*/