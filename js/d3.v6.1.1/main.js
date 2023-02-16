

const FRAME_HEIGHT = 200;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


// with scale function
const SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const FRAME1 = d3.select('.scatter')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame")

// Reading from file
d3.csv("data/scatter-data.csv").then((data) => {


    // plot
    FRAME1.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return parseInt(d.x) + MARGINS.left})
                .attr("cy", (d) => {return parseInt(d.y) + MARGINS.top})
                .attr("r", 10);


});