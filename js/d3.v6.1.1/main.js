

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const FRAME1 = d3.select('.chart')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");


// with scale function
const SCATTER_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const SCATTER_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Reading from file
d3.csv("data/scatter-data.csv").then((data) => {

    const MAX_X = 1 + d3.max(data, (d) => 
                                {return parseInt(d.x)});
    
    const MAX_Y = 1 + d3.max(data, (d) => 
                                {return parseInt(d.y)});
    
    const X_SCALE = d3.scaleLinear()
                            .domain([0, (MAX_X)])
                            .range([0, SCATTER_WIDTH]);
    

    const Y_SCALE = d3.scaleLinear()
                        .domain([0, (MAX_Y)])
                        .range([SCATTER_HEIGHT, 0]);


    // plot
    FRAME1.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(parseInt(d.x)) + MARGINS.left)})
                .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(parseInt(d.y))))})
                .attr("r", 10)
                .attr("class", "scatter-point");

    FRAME1.append("g")
        .attr("transform", "translate(" + MARGINS.top + "," + 
        (SCATTER_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(10))
            .attr("font-size", "15px");
    
    FRAME1.append("g")
        .attr("transform", "translate(" + 
        (MARGINS.left) + "," + (MARGINS.top) + ")")
        .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr("font-size", "15px");

    const TOOLTIP = d3.selectAll(".scatter-point")
    .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
                
    function handleMouseover(event, d) {
        TOOLTIP.style("opacity", 1)
    }

    function handleMousemove(event, d) {
        TOOLTIP.html('<Hi>')
                .style("left", (event.pageX + MARGINS.left) + "px")
                .style("top", (event.pageY - MARGINS.top + "px"))
    }

    function handleMouseLeave(event, d) {
        TOOLTIP.style("opacity", 0)
    }

    FRAME1.selectAll(".scatter-point")
                .on("mouseover", handleMouseover)
                .on("mousemove", handleMousemove)
                .on("mouseleave", handleMouseLeave)

});