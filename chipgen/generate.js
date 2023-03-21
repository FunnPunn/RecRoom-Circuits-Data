var jsdom = require("jsdom")
const { JSDOM } = jsdom;

const fs = require("fs")
const dom = new JSDOM("<!DOCTYPE html><body></body>")

const TestChip = {
    "Absolute Value": {
        "Description": "Outputs the magnitude of the number. Is always positive.",
        "IsBeta": false,
        "IsTrollingRisk": false,
        "DeprecationStage": "Active",
        "Inputs": [
            {
                "Name": "Value",
                "Description": "",
                "DataType": [
                    "float",
                    "int"
                ],
                "IsList": false
            },
            {
                "Name": "A very long value",
                "Description": "",
                "DataType": [
                    "float",
                    "int"
                ],
                "IsList": false
            }
        ],
        "Outputs": [
            {
                "Name": "Result",
                "Description": "",
                "DataType": [
                    "float",
                    "int"
                ],
                "IsList": false
            }
        ]
    }
}

const fontsize = "18%"
const fontfamily = "ubuntu"

const defaultwidth = 111
const portverticalspacing = 4
const porthorizontalspacing = 2
const topheight = 41
const portstoppadding = 8
const portsbottompadding = 20
const border_radius = 10

const topcolor = "#525152"
const bottomcolor = "#818081"

var AddedPorts = 0
var GreatestSize = 0

async function run() {
    const d3 = await import("d3")
    let body = d3.select(dom.window.document.querySelector("body"))
    let svg = body.append("svg").attr("width", 210).attr("height", 140)
    
    let top = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", defaultwidth)
        .attr("height", topheight)
        .attr("fill", topcolor)
    let chipbody = svg.append("rect")
        .attr("x", 0)
        .attr("y", topheight)
        .attr("width", defaultwidth)
        .attr("height", portstoppadding+portsbottompadding)
        .attr("fill", bottomcolor)

    for (var prt of TestChip["Absolute Value"]["Inputs"]){
        let text = svg.append("text")
        .text(prt["Name"])
        .style("font-size", 18)
        .attr("x", 0)
        .attr("y", topheight+portstoppadding+(portverticalspacing*AddedPorts));
        AddedPorts++
    }
    console.log()
    chipbody
    .attr("width", defaultwidth)
    .attr("height", portstoppadding+portsbottompadding+(portverticalspacing*AddedPorts));
    fs.writeFileSync("chipgen/out.svg", body.html())
}


run();