let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let gpaURL = "https://api.npoint.io/d9dca4bd09576c55acaf";

let countyData;
let educationData;
let gpaData;

width = 950;
height = 600;

let canvas = d3.select('#canvas').call(d3.zoom().on("zoom", function () {
    canvas.attr("transform", d3.event.transform)
 }))
let tooltip = d3.select('#tooltip');

let drawMap = () => {


    canvas.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = gpaData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        if(percentage <= 15) return '#ffbf00'            
        if(percentage <= 30) return 'darkorange'
        if(percentage <= 45) return '#E33725'
        if(percentage > 45) return '#A01000'      
    })
    .attr('data-fips', (countyDataItem) => {
        return countyDataItem['id']
    })
    .attr('data-education', (countyDataItem) => {
        let id = countyDataItem['id']
        let county = gpaData.find((item) => {
            return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        return percentage
    })

    .on('mouseover', (countyDataItem) => {
        var tip = "<h3>" + "d.properties.name" + "</h3>";
        tooltip.html(tip)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .style('visibility', 'visible')

        let id = countyDataItem['id']
        let county = gpaData.find((item) => {
            return item['fips'] === id
        })

        tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%' + ", GPA: " + county['GPA'])

        tooltip.attr('data-education', county['e'])
        tooltip.transition()
                .duration(1)
                .style("opacity", .7);

    })

    .on('mouseout', (countyDataItem) => {
        tooltip.transition()
              .duration(1)
              .style("opacity", 0);
              d3.selectAll('path')
                            .style({
                                'fill-opacity':.7
          })
          

    })

}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log);
        }
        else{
            countyData = topojson.feature(data, data.objects.counties).features

            console.log(countyData)

            d3.json(gpaURL).then(
                (data, error) => {
                if(error){
                    console.log(log)
                }
                else{
                    gpaData = data
                    console.log(gpaData)
                    drawMap();
                }
            })
        }
    })