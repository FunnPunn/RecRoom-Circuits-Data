const sort_json = require("sort-json")
const options = { ignoreCase: true, reverse: false, depth: 1}
const fs = require("fs")

const converted = JSON.parse(fs.readFileSync("data/events.json"))

fs.writeFileSync("data/events.json", JSON.stringify(sort_json(converted, options), null, 4))