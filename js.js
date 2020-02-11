let map;
let crimeData;
let mapStartDate = "1/22/2020"
let mapEndDate = "1/31/2020"
let chart;

$(document).ready(function() {
  //Date Picker
  $(function() {
    $("#datetimepicker4").datetimepicker({
      useCurrent: false,
      format: "L",
      minDate: "1/1/2019",
      maxDate: "1/31/2020",
      defaultDate: mapStartDate
    });
    $("#datetimepicker8").datetimepicker({
      useCurrent: false,
      format: "L",
      maxDate: "1/31/2020",
      defaultDate: mapEndDate
    });
    $("#datetimepicker4").on("change.datetimepicker", function(e) {
      $("#datetimepicker8").datetimepicker("minDate", e.date);
    });
    $("#datetimepicker8").on("change.datetimepicker", function(e) {
      $("#datetimepicker4").datetimepicker("maxDate", e.date);
    });
  });


  //Home location
  // Fill in an appropriate lat/long
  let home = [];

  // map = L.map("map", {
  //   zoomControl: false
  // }).setView([42.33804978112808, -83.05174858235452], 14);

  map = L.map("map", {
    zoomControl: false
  }).setView([42.33513214181834, -83.05493701900036], 17);


  L.control
    .zoom({
      position: "topright"
    })
    .addTo(map);

  var CartoDB_PositronNoLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }
  ).addTo(map);


  //Function to get colors for point feature on the map - this will work with the Leaflet API
  let getColor = feature => {
    switch (feature.properties.Type) {
      case "HOMICIDE":
        return { color: "#b10026" };
      case "SEXUAL ASSAULT":
        return { color: "#e31a1c" };
      case "SEX OFFENSES":
        return { color: "#fc4e2a" };
      case "ROBBERY":
        return { color: "#fd8d3c" };
      case "ASSAULT":
        return { color: "#feb24c" };
      case "AGGRAVATED ASSAULT":
        return { color: "#fed976" };
      case "JUSTIFIABLE HOMICIDE":
        return { color: "#ffffb2" };
      case "ARSON":
        return { color: "#0c2c84" };
      case "EXTORTION":
        return { color: "#225ea8" };
      case "BURGLARY":
        return { color: "#1d91c0" };
      case "LARCENY":
        return { color: "#41b6c4" };
      case "STOLEN VEHICLE":
        return { color: "#7fcdbb" };
      case "STOLEN PROPERTY":
        return { color: "#c7e9b4" };
      case "DAMAGE TO PROPERTY":
        return { color: "#0c2c84" }; 
      case "KIDNAPPING":
        return { color: "#d8daeb" };
      case "FORGERY":
        return { color: "#b2abd2" };
      case "FRAUD":
        return { color: "#8073ac" };
      case "DANGEROUS DRUGS":
        return { color: "#542788" };
      case "SEX OFFENSES":
        return { color: "#2d004b" };
      case "FAMILY OFFENSE":
        return { color: "#80cdc1" };
      case "GAMBLING":
        return { color: "#35978f" };
      case "LIQUOR":
        return { color: "#01665e" };
      case "OBSTRUCTING THE POLICE":
        return { color: "#003c30" };
      case "OBSTRUCTING JUDICIARY":
        return { color: "#006837" };
      case "DISORDERLY CONDUCT":
        return { color: "#1a9850" };
      case "OUIL":
        return { color: "#66bd63" };
      case "OTHER":
        return { color: "#fb8072" };
      case "RUNAWAY":
        return { color: "#80b1d3" };
      case "MISCELLANEOUS":
        return { color: "#bc80bd" };
      case "SOLICITATION":
        return { color: "#ccebc5" };        
    }
  }

  //Function to get colors for chart features and the legend
  let getLegendColor = legend => {
    switch(legend){
      case "HOMICIDE":
          return "#b10026"
        case "SEXUAL ASSAULT":
          return "#e31a1c"
        case "SEX OFFENSES":
          return "#fc4e2a"
        case "ROBBERY":
          return "#fd8d3c"
        case "ASSAULT":
          return "#feb24c"
        case "AGGRAVATED ASSAULT":
          return "#fed976"
        case "JUSTIFIABLE HOMICIDE":
          return "#ffffb2" 
        case "ARSON":
          return "#0c2c84"
        case "EXTORTION":
          return "#225ea8"
        case "BURGLARY":
          return "#1d91c0"
        case "LARCENY":
          return "#41b6c4"
        case "STOLEN VEHICLE":
          return "#7fcdbb"
        case "STOLEN PROPERTY":
          return "#c7e9b4"
        case "DAMAGE TO PROPERTY":
          return "#0c2c84"
        case "KIDNAPPING":
          return "#d8daeb";
        case "FORGERY":
          return "#b2abd2";
        case "FRAUD":
          return "#8073ac";
        case "DANGEROUS DRUGS":
          return "#542788";
        case "SEX OFFENSES":
          return "#2d004b";
        case "FAMILY OFFENSE":
          return "#80cdc1";
        case "GAMBLING":
          return "#35978f";
        case "LIQUOR":
          return "#01665e";
        case "OBSTRUCTING THE POLICE":
          return "#003c30";
        case "OBSTRUCTING JUDICIARY":
          return "#006837";
        case "DISORDERLY CONDUCT":
          return "#1a9850";
        case "OUIL":
          return "#66bd63";
        case "OTHER":
          return "#fb8072";
        case "RUNAWAY":
          return "#80b1d3";
        case "MISCELLANEOUS":
          return "#bc80bd"
        case "SOLICITATION":
          return "#ccebc5";     
    }
  }

  //This function will populate the 'Crime Overview Panel' when a user clicks a point
  let attributeDataPopulate = e => {
    $('#crimeContents').empty()
          $('#crimeContents').append(`
          <div class="row">
            <div class="col text-center my-2">
                <h4 class="text-primary"><i class="fas fa-user-shield text-warning"></i>  Crime Overview</h4>
                <!-- <div class="row text-left"> -->
                    <div class="input-group my-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Crime Type:</span>
                          </div>
                        <span class="form-control">${e.target.feature.properties.Type}</span>
                    </div>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Crime Date:</span>
                          </div>
                        <span class="form-control">${new Date(e.target.feature.properties.Date).getUTCMonth() + 1}/${new Date(e.target.feature.properties.Date).getUTCDate()}/${new Date(e.target.feature.properties.Date).getUTCFullYear()}</span>
                    </div>
                    <div class="input-group my-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Neighborhood:</span>
                          </div>
                        <span class="form-control">${e.target.feature.properties.NeighborHood}</span>
                    </div>
                    <div class="input-group my-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Address:</span>
                          </div>
                        <span class="form-control">${e.target.feature.properties.Address}</span>
                    </div>
                <!-- </div> -->
            </div>
        </div>
      `)
  }

  let legendPopulate = legend => {
    $('#legendContents').append(`<div class="row text-primary">
      <i class="fas fa-circle my-auto mx-2" style="color: ${getLegendColor(legend)}"></i>  ${legend}
        </div>
        `)
  }

  function onEachFeature(feature, layer) {
    layer.on({
      click: attributeDataPopulate
    })
  }


  //Initial starter query when opening the map - this will match the dates that are set as the default dates.  This will help with preformance
  let query = L.esri.query({
    url:
      "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Detroit_Crime_Data/FeatureServer/0"
  });

  //Set the query to filter all crime dates but only on the start & end dates specified
  query.where(`DATE > '${mapStartDate}' AND DATE < '${mapEndDate}'`);

  //Order the data recieved by Ascending
  query.orderBy('Type', 'ASC')

  query.run(function(error, featureCollection, response) {
    if (error) {
      console.log(error);
      return;
    }

    //Populate the legend with the visible layers - to start, loop through the collection
    let legendItems = new Set()

    //Create a crimeData cluster group
    crimeData = L.markerClusterGroup({
      // spiderfyOnMaxZoom: true,
      // disableClusteringAtZoom: 16
    });

    //Create a geoJSON from the featureCollection that is returned from the ESRI Leaflet Query
    let geojsonMarkerOptions = {
      radius: 10,
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };

    //Colors are based off Color brewer
    let geojson = L.geoJSON(featureCollection, {
      pointToLayer: function(feature, latlng) {
        legendItems.add(feature.properties.Type)
        return L.circle(latlng, geojsonMarkerOptions);
      },
      onEachFeature: onEachFeature,
      style: getColor
    });

    //Add GeoJSON that was created to the crimeData Cluster Grouping
    crimeData.addLayer(geojson);

    //Add Crime Data to map as a layer
    map.addLayer(crimeData);

    //Chart
    let data = [];
    let chartTotals = [];
    let chartColorsArray = [];
    let config = {
      type: "pie",
      data: {
        labels: Array.from(chartLabels()),
        datasets: [{
          data: chartData(),
          backgroundColor: chartColorsArray, //Will be populated during the chartData() stage
        }]
      },
      options: {
        //Turn off solid white stroke
        elements: {
          arc: {
              borderWidth: 0
          }
        },
        legend: {
          display: false,
        },
        responsive: false,
        maintainAspectRatio: false,
        // turn off animations during chart data updates
        animation: {
          duration: 0
        },
      }
    }
    chart = new Chart('chartCanvas', config)

     //Create a new object that will be used for the chart totals
      function objectCreation(chartItems){
        chartItems = Array.from(chartItems).sort()
        for (let item of chartItems){
          chartTotals.push({
            item: item,
            total: 0,
            color: getLegendColor(item)
          })
        }
      }

  
      function chartLabels () {
        let chartItems = new Set()

        crimeData.eachLayer(function (e) {
          if(map.getBounds().contains(e.getLatLng()) ){
             //first create a new set for the data in the map - this will be used for labels
             chartItems.add(e.feature.properties.Type)
          }
        })
        objectCreation(chartItems)
        return chartItems
      }

      function chartData(){

        crimeData.eachLayer(function (e) {
          if(map.getBounds().contains(e.getLatLng()) ){
             chartTotals.forEach(function(chartTotals){
               if (chartTotals.item === e.feature.properties.Type){
                 chartTotals.total += 1
               }
             })
          }
        })
        chartTotals.forEach(function(chartTotals){
          data.push(chartTotals.total)
          chartColorsArray.push(chartTotals.color)
        })
        return data
      }
  


    //Set Extent to Crime Data that was filtered
    // map.fitBounds(crimeData.getBounds());


    //With the set created during the geoJSON function, the legend can now be built dynamically
    for (let legend of legendItems){
      legendPopulate(legend)
    }
  });

  L.easyButton(
    "fa-home text-primary",
    function(btn, map) {
      let detroit = [42.370973789813014, -83.0918312072754];
      map.setView(detroit, 12);
    },
    {
      position: "topright"
    }
  ).addTo(map);

  L.easyButton({
    states: [
      {
        stateName: "legend", // name the state
        icon: "fa-layer-group text-primary", // and define its properties
        title: "Show Legend", // like its title
        onClick: function(btn, map) {
          // and its callback
          $(".legend-container").show();
          btn.state("closeLegend");
        }
      },
      {
        stateName: "closeLegend",
        icon: "fa-times text-primary",
        title: "Close Legend",
        onClick: function(btn, map) {
          $(".legend-container").hide();
          btn.state("legend");
        }
      }
    ],
    position: "topright"
  }).addTo(map);

  L.easyButton({
    states: [
      {
        stateName: "chart", // name the state
        icon: "fa-chart-bar text-primary", // and define its properties
        title: "Show Chart", // like its title
        onClick: function(btn, map) {
          // and its callback
          $(".chart-container").show();
          btn.state("closeChart");
        }
      },
      {
        stateName: "closeChart",
        icon: "fa-times text-primary",
        title: "Close Legal Plotter",
        onClick: function(btn, map) {
          $(".chart-container").hide();
          btn.state("chart");
        }
      }
    ],
    position: "topright"
  }).addTo(map);

  //Function for applying user specified filters
  $("#filterTest").on("click", () => {
    //If Crime data cluster group is present - remove and add new one
    // crimeData.remove()

    let query = L.esri.query({
      url:
        "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Detroit_Crime_Data/FeatureServer/0"
    });

    let startDate = $("#datetimepicker4").datetimepicker("date")._i;
    let endDate = $("#datetimepicker8").datetimepicker("date")._i;
    let other = $(".selectpicker").val();
    let violent = $(".selectpicker2").val();
    let property = $(".selectpicker3").val();

    //assemble all arrays together as one array
    let crimeArray = other.concat(violent, property)
    let queryItem = ``;

    for (let i = 0; i < crimeArray.length; i++) {
      if (i === 0) {
        queryItem += `Type = '${crimeArray[i].toUpperCase().toString()}'`;
      } else {
        queryItem += ` OR Type = '${crimeArray[i].toUpperCase().toString()}'`;
      }
    }

    if (crimeArray.length > 0){
      queryString = `(DATE > '${startDate}' AND DATE < '${endDate}') AND (${queryItem})`;
    } else {
      queryString = `DATE > '${startDate}' AND DATE < '${endDate}'`;
    }

    query.where(`${queryString}`);
    console.log(queryString)

    query.run(function(error, featureCollection, response) {
      if (error) {
        console.log(error);
        return;
      } else if (featureCollection.features.length > 0){
        crimeData.remove()
        //Create a crimeData cluster group
        crimeData = L.markerClusterGroup({
          // spiderfyOnMaxZoom: true,
          // disableClusteringAtZoom: 16
        });
        //Create a geoJSON from the featureCollection that is returned from the ESRI Leaflet Query
        let geojsonMarkerOptions = {
          radius: 10,
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        };

        //Create a new empty set
        let legendItems = new Set()


        let geojson = L.geoJSON(featureCollection, {
          pointToLayer: function(feature, latlng) {
            legendItems.add(feature.properties.Type)
            return L.circle(latlng, geojsonMarkerOptions);
          },
          onEachFeature: onEachFeature,
          style: getColor
        });

        //With the set created during the geoJSON function, the legend can now be built dynamically
        //Remove current legend
        $('#legendContents').empty()
        for (let legend of legendItems){
          legendPopulate(legend)
        }

        //Add GeoJSON that was created to the crimeData Cluster Grouping
        crimeData.addLayer(geojson);

        //Add Crime Data to map as a layer
        map.addLayer(crimeData);

        //Set Extent to Crime Data that was filtered
        map.fitBounds(crimeData.getBounds());
      } else {
        alert('No Features Returned - Original Features Shown')
      }

    });
  });


  let updateChart = () => {
    //Update chart
    function removeData(chart) {
      chart.data.labels = [];
      chart.data.datasets[0].label = "";
      chart.data.datasets[0].data = [];
      chart.data.datasets[0].backgroundColor = [];
      chart.update();
    }

    function addData(chart, label, data, color) {
      //Sort the labels
      label = label.sort()
      chart.data.labels = label;
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = color
      chart.update();
    }

    //Chart
    let data = [];
    let chartTotals = [];
    let chartColorsArray = [];

     //Create a new object that will be used for the chart totals
      function objectCreation(chartItems){
        chartItems = Array.from(chartItems).sort()
        for (let item of chartItems){
          chartTotals.push({
            item: item,
            total: 0,
            color: getLegendColor(item)
          })
        }
      }

  
      function chartLabels () {
        let chartItems = new Set()
        crimeData.eachLayer(function (e) {
          if(map.getBounds().contains(e.getLatLng()) ){
             //first create a new set for the data in the map - this will be used for labels
             chartItems.add(e.feature.properties.Type)
          }
        })
        objectCreation(chartItems)
        return chartItems
      }

      function chartData(){
        crimeData.eachLayer(function (e) {
          if(map.getBounds().contains(e.getLatLng()) ){
             chartTotals.forEach(function(chartTotals){
               if (chartTotals.item === e.feature.properties.Type){
                 chartTotals.total += 1
               }
             })
          }
        })
        chartTotals.forEach(function(chartTotal){
          data.push(chartTotal.total)
          chartColorsArray.push(chartTotal.color)
        })
        return data
      }

      function chartColors(){

      }

    removeData(chart)
    addData(chart, Array.from(chartLabels()), chartData(),chartColorsArray)

    
  }

  //As the user pans, update the display chart
  map.on('zoom move', updateChart);
  
});