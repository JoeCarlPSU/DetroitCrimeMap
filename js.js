//Global Variables
let map;
let geojson;
let heatmapLayer;
let crimeData;
let mapStartDate = "1/22/2020";
let mapEndDate = "1/31/2020";
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
  let initialView = [42.33389093561675, -83.0475962162018];
  let fullExtent = [42.35892446028166, -83.07123184204103]

  map = L.map("map", {
    zoomControl: false
  }).setView(initialView, 16);

  L.control
    .zoom({
      position: "topright"
    })
    .addTo(map);

  var CartoDB_PositronNoLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }
  ).addTo(map);

  //Custom tile map - re-doing
  // L.tileLayer('data/neighborhoods/{z}/{x}/{y}.png', {
  //   minZoom: 0,
  //   noWrap: true
  //   }).addTo(map)

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
        return { color: "#8A2BE2" };
      case "KIDNAPPING":
        return { color: "#FF0090" };
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
      case "WEAPONS OFFENSES":
        return { color: "#c51b8a" };
    }
  };

  //Function to get colors for chart features and the legend
  let getLegendColor = legend => {
    switch (legend) {
      case "HOMICIDE":
        return "#b10026";
      case "SEXUAL ASSAULT":
        return "#e31a1c";
      case "SEX OFFENSES":
        return "#fc4e2a";
      case "ROBBERY":
        return "#fd8d3c";
      case "ASSAULT":
        return "#feb24c";
      case "AGGRAVATED ASSAULT":
        return "#fed976";
      case "JUSTIFIABLE HOMICIDE":
        return "#ffffb2";
      case "ARSON":
        return "#0c2c84";
      case "EXTORTION":
        return "#225ea8";
      case "BURGLARY":
        return "#1d91c0";
      case "LARCENY":
        return "#41b6c4";
      case "STOLEN VEHICLE":
        return "#7fcdbb";
      case "STOLEN PROPERTY":
        return "#c7e9b4";
      case "DAMAGE TO PROPERTY":
        return "#8A2BE2";
      case "KIDNAPPING":
        return "#FF0090";
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
        return "#bc80bd";
      case "SOLICITATION":
        return "#ccebc5";
      case "WEAPONS OFFENSES":
        return "#c51b8a"
    }
  };

  //Convert to proper case - this offers a more streamlined experience for the user
  let properCaseConvert = type => {
    //Assign empty string
    let typeConvert = ''
    for (let i = 0; i < type.length; i++){
      //If i is the first character in the string, or the previous character is a space - make uppercase, else make lowercase
      (i === 0 || type[i-1] === ' ') ? typeConvert += type[i].toUpperCase() : typeConvert += type[i].toLowerCase()
    }
    return typeConvert
  }

  //This function will populate the 'Crime Overview Panel' when a user clicks a point
  let attributeDataPopulate = e => {
    $("#crimeContents").empty();
    $("#crimeContents").append(`
          <div class="row">
            <div class="col text-center my-2">
                <h4 class="text-primary"><i class="fas fa-user-shield text-warning"></i>  Crime Overview</h4>
                <!-- <div class="row text-left"> -->
                    <div class="input-group my-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Crime Type:</span>
                          </div>
                        <span class="form-control">
                        ${properCaseConvert(e.target.feature.properties.Type)}
                        </span>
                    </div>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Crime Date:</span>
                          </div>
                        <span class="form-control">
                        ${new Date(e.target.feature.properties.Date
                        ).getUTCMonth() + 1}/${new Date(
                          e.target.feature.properties.Date
                        ).getUTCDate()}/${new Date(
                          e.target.feature.properties.Date
                        ).getUTCFullYear()}
                    </span>
                    </div>
                    <div class="input-group my-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Neighborhood:</span>
                          </div>
                        <span class="form-control">
                        ${e.target.feature.properties.NeighborHood}
                        </span>
                    </div>
                    <div class="input-group my-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">Address:</span>
                          </div>
                        <span class="form-control">
                        ${e.target.feature.properties.Address}
                        </span>
                    </div>
                <!-- </div> -->
            </div>
        </div>
      `);
    //Resets the style - this is used for highlighting features on click
    geojson.resetStyle();
    e.target.setStyle({
      color: "rgb(0,255,255)",
      stroke: true,
      weight: 4,
      fillColor: "yellow"
    });
  };

  let legendPopulate = legend => {
    $("#legendContents").append(`<div class="row text-primary legend-text">
      <i class="fas fa-circle my-auto mx-2" style="color: ${getLegendColor(
        legend
      )}"></i>  ${properCaseConvert(legend)}
        </div>
        `);
  };

  function onEachFeature(feature, layer) {
    layer.on({
      click: attributeDataPopulate
    });
  }

  //Easy Buttons
  //Full Extent of map button
  let homeButton = L.easyButton({
    states: [{
      stateName: "home",
      icon: "fa-home text-primary",
      title: "Full Extent",
      onClick: function(btn, map){
        map.setView(fullExtent, 12);
      }
    }],
    position: "topright"
  }).addTo(map)

  /*Heatmap Button
    Add A heatmap to the current filered data*/
  let heatMapButton = L.easyButton({
    states: [
      {
        stateName: "heatMap",
        icon: "fa-fire text-secondary", // and define its properties
        title: "Show Heat Map", // like its title
        onClick: function(btn, map) {
          //Configure the heatmap layer
          var cfg = {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            // if scaleRadius is false it will be the constant radius used in pixels
            radius: 30,
            maxOpacity: 0.8,
            // scales the radius based on map zoom
            scaleRadius: false,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            useLocalExtrema: false,
            // which field name in your data represents the latitude - default "lat"
            latField: "lat",
            // which field name in your data represents the longitude - default "lng"
            lngField: "lng",
            // which field name in your data represents the data value - default "value"
            valueField: "count"
          };

          //Create an empty data array
          let data = [];

          //Set the heatmap layer with the options specified
          heatmapLayer = new HeatmapOverlay(cfg);

          let crimeHeat = {
            max: 1,
            data: []
          };

          //loop through the crime data layer and grab the lat/long values
          crimeData.eachLayer(function(layer) {
            latitude = layer._latlng.lat;
            longitude = layer._latlng.lng;
            crimeHeat.data.push({ lat: latitude, lng: longitude, count: 1 });
          });

          //set the data of the heatmap layer to the crime data
          heatmapLayer.setData(crimeHeat);

          //add the heatmap layer to the map
          heatmapLayer.addTo(map);

          //remove the crime data layer
          crimeData.remove();

          btn.state("closeHeatMap");
        }
      },
      {
        stateName: "closeHeatMap",
        icon: "fa-times text-secondary",
        title: "Close Heat Map",
        onClick: function(btn, map) {
          heatmapLayer.remove();
          crimeData.addTo(map);
          btn.state("heatMap");
        }
      }
    ],
    position: "topright"
  })

  let legendButton = L.easyButton({
    states: [
      {
        stateName: "legend", // name the state
        icon: "fa-layer-group text-info", // and define its properties
        title: "Show Legend", // like its title
        onClick: function(btn, map) {
          // and its callback
          $(".legend-container").show();
          btn.state("closeLegend");
        }
      },
      {
        stateName: "closeLegend",
        icon: "fa-times text-info",
        title: "Close Legend",
        onClick: function(btn, map) {
          $(".legend-container").hide();
          btn.state("legend");
        }
      }
    ],
    position: "topright"
  })

  // Charts 
  let chartButton = L.easyButton({
    states: [
      {
        stateName: "chart", // name the state
        icon: "fa-chart-pie text-success", // and define its properties
        title: "Show Chart", // like its title
        onClick: function(btn, map) {
          // and its callback
          $(".chart-container").show();
          btn.state("closeChart");
        }
      },
      {
        stateName: "closeChart",
        icon: "fa-times text-success",
        title: "Close Legal Plotter",
        onClick: function(btn, map) {
          $(".chart-container").hide();
          btn.state("chart");
        }
      }
    ],
    position: "topright"
  })

  //Add the buttons to an array so they can be added to easy bar
  let buttons = [heatMapButton, legendButton, chartButton]

  //Add the buttons as a 'bar' - found this in the documentation :)
  L.easyBar(buttons, {position: "topright"}).addTo(map)

  //Set the default button state for the chart
  chartButton.state("closeChart");

  //Modal view
  let modalButton = L.easyButton({
    states: [{
      stateName: "info",
      icon: "fa-info text-primary",
      title: "Show Info",
      onClick: function(btn, map){
        $('#Modal').modal('show');
      }
    }]
  }).addTo(map);

  //ESRI Search control
  const searchControl = L.esri.Geocoding.geosearch().addTo(map);

  let results = L.layerGroup().addTo(map);

  searchControl.on('results', function (data) {
    results.clearLayers();
    for (let i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });

  //Initial starter query when opening the map - this will match the dates that are set as the default dates.  This will help with preformance
  let query = L.esri.query({
    url:
      "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Detroit_Crime_Data/FeatureServer/0"
  });

  //Set the query to filter all crime dates but only on the start & end dates specified
  query.where(`DATE > '${mapStartDate}' AND DATE < '${mapEndDate}'`);

  //Order the data recieved by Ascending
  query.orderBy("Type", "ASC");

  query.run(function(error, featureCollection, response) {
    if (error) {
      console.log(error);
      return;
    }

    //Populate the legend with the visible layers - to start, loop through the collection
    let legendItems = new Set();

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
    geojson = L.geoJSON(featureCollection, {
      pointToLayer: function(feature, latlng) {
        legendItems.add(feature.properties.Type);
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
        datasets: [
          {
            data: chartData(),
            backgroundColor: chartColorsArray //Will be populated during the chartData() stage
          }
        ]
      },
      options: {
        //Chart title
        title: {
          display: true,
          text: 'Current Extent Crime Data',
          fontColor: '#004445',
          fontFamily: "'Helvetica Neue', Helvetica, Arial,sans-serif",
          fontSize: 12
        },
        //Turn off solid white stroke
        elements: {
          arc: {
            borderWidth: 0.3
          }
        },
        legend: {
          display: false
        },
        responsive: false,
        maintainAspectRatio: false,
        // turn off animations during chart data updates
        animation: {
          duration: 0
        }
      }
    };
    chart = new Chart("chartCanvas", config);

    //Create a new object that will be used for the chart totals
    function objectCreation(chartItems) {
      chartItems = Array.from(chartItems).sort();
      for (let item of chartItems) {
        chartTotals.push({
          item: item,
          total: 0,
          color: getLegendColor(item)
        });
      }
    }

    function chartLabels() {
      let chartItems = new Set();

      crimeData.eachLayer(function(e) {
        if (map.getBounds().contains(e.getLatLng())) {
          //first create a new set for the data in the map - this will be used for labels - convert to proper case
          chartItems.add(e.feature.properties.Type);
        }
      });
      objectCreation(chartItems);
      return chartItems;
    }

    function chartData() {
      crimeData.eachLayer(function(e) {
        if (map.getBounds().contains(e.getLatLng())) {
          chartTotals.forEach(function(chartTotals) {
            if (chartTotals.item === e.feature.properties.Type) {
              chartTotals.total += 1;
            }
          });
        }
      });
      chartTotals.forEach(function(chartTotals) {
        data.push(chartTotals.total);
        chartColorsArray.push(chartTotals.color);
      });
      return data;
    }

    //With the set created during the geoJSON function, the legend can now be built dynamically
    //Sort the values so the legend looks cleaner
    legendItems = Array.from(legendItems).sort();
    for (let legend of legendItems) {
      legendPopulate(legend);
    }
  });

  //Function for applying user specified filters
  $("#applyFilter").on("click", () => {
    
    //if heatmap layer is currently active & present, remove layer and change button state back
    if (heatmapLayer){
      console.log('yes')
      heatmapLayer.remove()
      heatMapButton.state("heatMap")
    }

    let query = L.esri.query({
      url:
        "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Detroit_Crime_Data/FeatureServer/0"
    });

    startDate = $("#datetimepicker4").data("date");
    endDate = $("#datetimepicker8").data("date");
    let other = $(".selectpicker").val();
    let violent = $(".selectpicker2").val();
    let property = $(".selectpicker3").val();

    //assemble all arrays together as one array
    let crimeArray = other.concat(violent, property);
    let queryItem = ``;

    //Build the where clause based on if it is the first pass in the loop
    for (let i = 0; i < crimeArray.length; i++) {
      (i === 0) ? queryItem += `Type = '${crimeArray[i].toUpperCase().toString()}'` : queryItem += ` OR Type = '${crimeArray[i].toUpperCase().toString()}'`
    }
    // If length of crime is less than 0, only dates will need to be filtered
    (crimeArray.length > 0) ? queryString = `(DATE > '${startDate}' AND DATE < '${endDate}') AND (${queryItem})` : queryString = `DATE > '${startDate}' AND DATE < '${endDate}'`
    
    //Set the where clause
    query.where(`${queryString}`);

    query.run(function(error, featureCollection, response) {
      if (error) {
        console.log(error);
        return;
      } else if (featureCollection.features.length > 0) {
        crimeData.remove();
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
        let legendItems = new Set();

        geojson = L.geoJSON(featureCollection, {
          pointToLayer: function(feature, latlng) {
            legendItems.add(feature.properties.Type);
            return L.circle(latlng, geojsonMarkerOptions);
          },
          onEachFeature: onEachFeature,
          style: getColor
        });

        //With the set created during the geoJSON function, the legend can now be built dynamically
        //Remove current legend
        $("#legendContents").empty();
        //Sort the legend items
        legendItems = Array.from(legendItems).sort();
        for (let legend of legendItems) {
          legendPopulate(legend);
        }

        //Add GeoJSON that was created to the crimeData Cluster Grouping
        crimeData.addLayer(geojson);

        //Add Crime Data to map as a layer
        map.addLayer(crimeData);

        //Set Extent to Crime Data that was filtered
        map.fitBounds(crimeData.getBounds());
      } else {
        alert("No Features Returned - Original Features Shown");
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
      label = label.sort();
      chart.data.labels = label;
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = color;
      chart.update();
    }

    //Chart
    let data = [];
    let chartTotals = [];
    let chartColorsArray = [];

    //Create a new object that will be used for the chart totals
    function objectCreation(chartItems) {
      chartItems = Array.from(chartItems).sort();
      for (let item of chartItems) {
        chartTotals.push({
          item: item,
          total: 0,
          color: getLegendColor(item)
        });
      }
    }

    function chartLabels() {
      let chartItems = new Set();
      crimeData.eachLayer(function(e) {
        if (map.getBounds().contains(e.getLatLng())) {
          //first create a new set for the data in the map - this will be used for labels
          chartItems.add(e.feature.properties.Type);
        }
      });
      objectCreation(chartItems);
      return chartItems;
    }

    function chartData() {
      crimeData.eachLayer(function(e) {
        if (map.getBounds().contains(e.getLatLng())) {
          chartTotals.forEach(function(chartTotals) {
            if (chartTotals.item === e.feature.properties.Type) {
              chartTotals.total += 1;
            }
          });
        }
      });
      chartTotals.forEach(function(chartTotal) {
        data.push(chartTotal.total);
        chartColorsArray.push(chartTotal.color);
      });
      return data;
    }

    removeData(chart);
    addData(chart, Array.from(chartLabels()), chartData(), chartColorsArray);
  };

  //As the user pans, update the display chart
  map.on("zoom move", updateChart);

  //Load modal on page load
  $('#Modal').modal('show');
});
