

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const SCATTER_FRAME = d3.select('.chart')
                    .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

const SELECT_FRAME = d3.select('.selection')
                        .append("div")
                        .attr("class", "last-point");

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
    SCATTER_FRAME.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", (d) => {return (X_SCALE(parseInt(d.x)) + MARGINS.left)})
                .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(parseInt(d.y))))})
                .attr("r", 10)
                .attr("class", "scatter-point");

    SCATTER_FRAME.append("g")
        .attr("transform", "translate(" + MARGINS.top + "," + 
        (SCATTER_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(10))
            .attr("font-size", "15px");
    
    SCATTER_FRAME.append("g")
        .attr("transform", "translate(" + 
        (MARGINS.left) + "," + (MARGINS.top) + ")")
        .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr("font-size", "15px");



    function addPoint(event, d) {

        let new_x = d3.selectAll("#x-cord").node().value;
        let new_y =  d3.selectAll("#y-cord").node().value;

        SCATTER_FRAME.append("circle")
                        .attr("cx", (d) => {return (X_SCALE(parseInt(new_x)) + MARGINS.left)})
                        .attr("cy", (d) => {return (MARGINS.top + (Y_SCALE(parseInt(new_y))))})
                        .attr("r", 10)
                        .attr("class", "scatter-point")
                        .on("click", pointClickHandler);
    }
    

    const BUTTON = d3.selectAll(".add-point").on("click", addPoint);
    
    function pointText(pointReference) {
        console.log("hello1")
        let x_point = d3.select(pointReference).attr("cx");
        let y_point = d3.select(pointReference).attr("cy");
        
        x_point = Math.round(X_SCALE.invert(x_point - MARGINS.left));
        y_point = Math.round(Y_SCALE.invert(y_point - MARGINS.top));
        
        SELECT_FRAME.html("<br>Last Point Click: " + "(" + x_point + "," + y_point + ")")
        
        }

    function addBorder(pointReference) {
        console.log("hello2")
        d3.select(pointReference).classed("border-point", !(d3.select(pointReference).classed("border-point")));
        
    }

    function pointClickHandler() {
        addBorder(this)
        pointText(this)
    }

    const SCATTER_CLICK = d3.selectAll(".scatter-point");
    SCATTER_CLICK.on("click", pointClickHandler)
    
    
});


// create frame for bar chart
const FRAME2 = d3.select('.bar-chart')
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "bars");


// with scale function
const BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// read in bar chart data
d3.csv("data/bar-data.csv").then((data) => {

    console.log((data));

    const xScaleBar = d3.scaleBand().range([0, BAR_WIDTH]).padding(0.2);
    const yScaleBar = d3.scaleLinear().range([BAR_HEIGHT, 0]);

    xScaleBar.domain(data.map((d) => {
        return d.category
    }));
    yScaleBar.domain([0, d3.max(data, (d) => {
        return d.amount
    })])

    FRAME2.selectAll("bars")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d) => {
            return (xScaleBar(d.category) + MARGINS.left)
        })
        .attr("y", (d) => {
            return ( MARGINS.left + yScaleBar(d.amount))
        })
        .attr("width", xScaleBar.bandwidth())
        .attr("height", (d) => {
            return BAR_HEIGHT - yScaleBar(d.amount)
        });

    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.top + "," +
            (BAR_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(xScaleBar).ticks(11))
        .attr("font-size", "15px");

    FRAME2.append("g")
        .attr("transform", "translate(" +
            (MARGINS.left) + "," + (MARGINS.top) + ")")
        .call(d3.axisLeft(yScaleBar).ticks(11))
        .attr("font-size", "15px");

    const TOOLTIP2 = d3.select(".bar-chart")
        .append("div")
        .attr("class", "tooltip2")
        .style("opacity", 0);

    // mouse over
    function handleMouseOver(event, d){
        TOOLTIP2.style("opacity", 1);
    }

    // mouse move
    function handleMouseMove(event, d){
        TOOLTIP2.html("Category: " + d.category + "<br>Amount: " + d.amount)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px");
    }

    // mouse leave
    function handleMouseLeave(event, d){
        TOOLTIP2.style("opacity", 0);
    }

    // add event listeners
    FRAME2.selectAll(".bar")
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseleave", handleMouseLeave);


});