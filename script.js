let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

let canvas = d3.select('#canvas');
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
        let county = educationData.find((item) => {
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
        let county = educationData.find((item) => {
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
        let county = educationData.find((item) => {
            return item['fips'] === id
        })

        tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

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
          .style('visibility', 'hidden')

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

            d3.json(educationURL).then(
                (data, error) => {
                if(error){
                    console.log(log)
                }
                else{
                    educationData = data
                    console.log(educationData)
                    drawMap();
                }
            })
        }
    })