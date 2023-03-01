const fs = require("fs")
let original_raw = fs.readFileSync("chips/originalchips.json");
let original = JSON.parse(original_raw)

var Chips = Object.values(original)[0]
var UUIDS = Object.keys(Chips)
var Keys = Object.values(Chips)
var Out = {}

var key = Keys[0]

let ShouldWrite = false

var dict = {}

if(ShouldWrite) {
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
}

let PortsToChange = {
    "NodeDescs": [
        {
          "Name": "Absolute Value",
          "ReadonlyTypeParams": {
            "T": "(float | int | vector3)"
          },
          "Inputs": [
            {
              "Name": "Value",
              "ReadonlyType": "T",
              "Description": ""
            }
          ],
          "Outputs": [
            {
              "Name": "Result",
              "ReadonlyType": "T",
              "Description": ""
            }
          ]
        }
      ]
}
var Ports = PortsToChange["NodeDescs"][0]
let ReadonlyTypeParams = Ports["ReadonlyTypeParams"]
if(ReadonlyTypeParams[0] !== null){
    for(var [key, declar] of Object.entries(ReadonlyTypeParams)){
        var newtypes = declar.replace("(", "").replace(")", "").split(" ").filter((str) => str !== '' && str !== '|')
        dict[key]=newtypes
    }
    for(var arr of Ports["Inputs"]){
      let type = arr["ReadonlyType"]
      if (type in dict){
        arr["ReadonlyType"] = dict[type]
      }
    }
    for(var arr of Ports["Outputs"]){
      let type = arr["ReadonlyType"]
      if (type in dict){
        arr["ReadonlyType"] = dict[type]
      }
    }
    console.log(Ports)
} else console.log("no");

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
