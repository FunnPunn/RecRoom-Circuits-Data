const { json } = require("express")
const fs = require("fs")
let original_raw = fs.readFileSync("data/originalchips.json")
let prts = JSON.parse(fs.readFileSync("data/ports.json"))["Ports"]

let original = JSON.parse(original_raw)

var Chips = Object.values(original)[0]
var UUIDS = Object.keys(Chips)
var Keys = Object.values(Chips)
var Out = {}

var key = Keys[0]

let ShouldWrite = true

var dict = {}
var n = 0
if(ShouldWrite) {
  var ndscs_in = []
  var ndscs_out = []
    for(var k of Keys){
      if(k["NodeDescs"][0] === undefined) {}
      else {
      var Ports = k["NodeDescs"][0]
      let ReadonlyTypeParams = Ports["ReadonlyTypeParams"]
      if(ReadonlyTypeParams[0] !== null){
          for(var [key, declar] of Object.entries(ReadonlyTypeParams)){
              var oldtypes = declar.replace("(", "").toLowerCase().replace(")", "")
              var newtypes = []
              for(var prt of prts) {
                if(oldtypes.includes(prt)) {
                  newtypes.push(prt)
                  oldtypes = oldtypes.replace(prt, "")
                }
              }
              if(newtypes.length == 1) {
                newtypes = newtypes[0]
              }
              dict[key]=newtypes
          }
          for(var arr of Ports["Inputs"]){
            let IsList = false
            let type = arr["ReadonlyType"]
            if (type in dict || type.replace("List<", "").replace(">", "") in dict){
              arr["ReadonlyType"] = dict[type]
            } if (type.includes("List<") && type.replace("List<", "").replace(">", "") in dict) {
              IsList = true
            } if (type == "(T0, T1)") arr["ReadonlyType"] = "tuple";
            arr["DataType"] = arr["ReadonlyType"]
            arr["IsList"] = IsList
            delete arr["ReadonlyType"]
          }
          for(var arr of Ports["Outputs"]){
            let IsList = false
            let type = arr["ReadonlyType"]
            if (type in dict || type.replace("List<", "").replace(">", "") in dict){
              arr["ReadonlyType"] = dict[type]
            } if (type.includes("List<") && type.replace("List<", "").replace(">", "") in dict) {
              IsList = true
            } if (type == "(T0, T1)") arr["ReadonlyType"] = "tuple";
            arr["DataType"] = arr["ReadonlyType"]
            arr["IsList"] = IsList
            delete arr["ReadonlyType"]
          }
      } else{
        k["NodeDescs"][0]["Outputs"] = k["NodeDescs"][0]["Outputs"].toLowerCase()
        k["NodeDescs"][0]["Inputs"] = k["NodeDescs"][0]["Inputs"].toLowerCase() 
      }
        ndscs_in = k["NodeDescs"][0]["Inputs"]
        ndscs_out = k["NodeDescs"][0]["Outputs"]
      }
      

      Out[k["ReadonlyChipName"]] = {
          "Description": k["Description"],
          "IsBeta": k["IsBetaChip"],
          "IsTrollingRisk": k["IsTrollingRisk"],
          "DeprecationStage": k["DeprecationStage"],
          "Inputs": ndscs_in,
          "Outputs": ndscs_out
        }
    }
    fs.writeFileSync("data/chips.json", JSON.stringify(Out, null, 4))
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
