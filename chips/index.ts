const fs = require("fs")
let original_raw = fs.readFileSync("chips/originalchips.json");
let newobj_raw = fs.readFileSync("chips/chips.json")

let original = JSON.parse(original_raw)

var values: Object[] = Object.values(original)
var subvalues = Object.values(values[0])
console.log(subvalues.length)

var newarr = {}

for(var val in subvalues){
    val as Object
    newarr[val["ReadonlyChipName"]] = {
    "Description": val["Description"]
}
}
console.log(newarr)
/*
{
    "Chip Name": {
        Chip data
    }
}
*/