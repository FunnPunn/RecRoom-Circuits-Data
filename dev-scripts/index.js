const { json } = require("express")
const fs = require("fs")

let original_raw = fs.readFileSync("data/originalchips.json")
let prts = Object.keys(JSON.parse(fs.readFileSync("data/ports.json"))["Ports"])

let original = JSON.parse(original_raw)

var Chips = Object.values(original)[0]
var UUIDS = Object.keys(Chips)
var Keys = Object.values(Chips)
var Out = {}
var key = Keys[0]

let ShouldWrite = true

function RetrieveReadOnly(RTP){
  var returndict = {}
  for(var [RTP_KEY, RTP_VAL] of Object.entries(RTP)) {
    var tps = RTP_VAL.replace("(", "").toLowerCase().replace(")", "")
    var mlist = []
    for(var prt of prts){
      if (tps.includes(prt)) {
        mlist.push(prt)
      }
    } if (mlist.length == 1) {
      mlist = mlist[0]
    }
    returndict[RTP_KEY] = mlist
  }
  //console.log(returndict)
  return returndict;
}

var dict = {}
if(ShouldWrite) {
    for(var k of Keys){
      if(k["NodeDescs"][0] === undefined) {}
      else {
      for(var nodedesc in k["NodeDescs"]) {
      var ndscs_in = []
      var ndscs_out = []
      var Ports = k["NodeDescs"][0]
      let ReadonlyTypeParams = Ports["ReadonlyTypeParams"]
      if(ReadonlyTypeParams[0] !== null){
          const params = RetrieveReadOnly(ReadonlyTypeParams)
          for(var arr of Ports["Inputs"]){
            let isList = false
            if (arr["ReadonlyType"] in params) {
              arr["ReadonlyType"] = params[arr["ReadonlyType"]]
            } else if(arr["ReadonlyType"].replace("List<", "").replace(">", "") in params) {
              arr["ReadonlyType"] = params[arr["ReadonlyType"].replace("List<", "").replace(">", "")]
              isList = true
            } else if (arr["ReadonlyType"] == "(T0, T1)") {
              arr["ReadonlyType"] = "tuple"
            } if(arr["ReadonlyType"].includes("List<")) {
              arr["ReadonlyType"] = arr["ReadonlyType"].replace("List<", "").replace(">", "")
              isList = true
            }
            if(typeof(arr["ReadonlyType"]) == "string") arr["ReadonlyType"] = arr["ReadonlyType"].toLowerCase();
            arr["DataType"] = arr["ReadonlyType"]
            arr["IsList"] = isList
            delete arr["ReadonlyType"]
          }
          for(var arr of Ports["Outputs"]){
            let isList = false
            if (arr["ReadonlyType"] in params) {
              arr["ReadonlyType"] = params[arr["ReadonlyType"]]
            } else if(arr["ReadonlyType"].replace("List<", "").replace(">", "") in params) {
              arr["ReadonlyType"] = params[arr["ReadonlyType"].replace("List<", "").replace(">", "")]
              isList = true
            } else if (arr["ReadonlyType"] == "(T0, T1)") {
              arr["ReadonlyType"] = "tuple"
            } if(arr["ReadonlyType"].includes("List<")) {
              arr["ReadonlyType"] = arr["ReadonlyType"].replace("List<", "").replace(">", "")
              isList = true
            }
            if(typeof(arr["ReadonlyType"]) == "string") arr["ReadonlyType"] = arr["ReadonlyType"].toLowerCase();
            arr["DataType"] = arr["ReadonlyType"]
            arr["IsList"] = isList
            delete arr["ReadonlyType"]
          }
      } else {
        k["NodeDescs"][nodedesc]["Outputs"] = k["NodeDescs"][nodedesc]["Outputs"].toLowerCase()
        k["NodeDescs"][nodedesc]["Inputs"] = k["NodeDescs"][nodedesc]["Inputs"].toLowerCase() 
      }
        ndscs_in = k["NodeDescs"][nodedesc]["Inputs"]
        ndscs_out = k["NodeDescs"][nodedesc]["Outputs"]

        k["Functions"] = [{
          "Name": k["NodeDescs"][nodedesc]["Name"],
          "Inputs": ndscs_in,
          "Outputs": ndscs_out
        }]
      }
    }
      

      Out[k["ReadonlyPaletteName"]] = {
          "Description": k["Description"],
          "IsBeta": k["IsBetaChip"],
          "IsTrollingRisk": k["IsTrollingRisk"],
          "DeprecationStage": k["DeprecationStage"],
          "Functions": k["Functions"]
        }
    }
    
    fs.writeFileSync("data/chips.json", JSON.stringify(Out, null, 4))
}