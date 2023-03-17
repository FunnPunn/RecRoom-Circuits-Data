const fs = require("fs")
const Chips_Raw = fs.readFileSync("data/chips.json")
const Chips = JSON.parse(Chips_Raw)

console.log(Chips["Absolute Value"]["Description"])