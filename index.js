const fs = require("fs")
let original_raw = fs.readFileSync("chips/originalchips.json");
let original = JSON.parse(original_raw)

var Chips = Object.values(original)[0]
var UUIDS = Object.keys(Chips)
var Keys = Object.values(Chips)
var Out = {}

var key = Keys[0]

let ShouldWrite = true

var dict = {}

if(ShouldWrite) {
    for(var k of Keys){
      if(k["NodeDescs"][0] === undefined) {console.error(k); break;}

      console.log(k["NodeDescs"][0])
      var Ports = k["NodeDescs"][0]
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
            arr["DataType"] = arr["ReadonlyType"]
            arr["ReadonlyType"] = null
          }
          for(var arr of Ports["Outputs"]){
            let type = arr["ReadonlyType"]
            if (type in dict){
              arr["ReadonlyType"] = dict[type]
            }
            arr["DataType"] = arr["ReadonlyType"]
            arr["ReadonlyType"] = null
          }
      }  

        Out[k["ReadonlyChipName"]] = {
            "Description": k["Description"],
            "IsBeta": k["IsBetaChip"],
            "IsTrollingRisk": k["IsTrollingRisk"],
            "DeprecationStage": k["DeprecationStage"],
            "Inputs": k["NodeDescs"][0]["Inputs"],
            "Outputs": k["NodeDescs"][0]["Outputs"]
        }
    }
    fs.writeFileSync("chips/chips.json", JSON.stringify(Out, null, 4))
}
/*
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
} else console.log("No valid TypeParams");
*/

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
