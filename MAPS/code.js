
    am4core.ready(function() {
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var mainContainer = am4core.create("chartdiv", am4core.Container);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.layout = "horizontal";
    
    var usData = [
            {
        "age": "0 a 17",
        "male": 5,
        "female": 17
      },
      {
        "age": "18 a 25",
        "male": 189,
        "female": 272
      },
      {
        "age": "26 a 50",
        "male": 1724,
        "female": 8916
      },
      {
        "age": "51 a 75",
        "male": 2600,
        "female": 10148
      },
      {
        "age": "76 y más",
        "male": 686,
        "female": 846
      }
    ];
    
    
    var maleChart = mainContainer.createChild(am4charts.XYChart);
    maleChart.paddingRight = 0;
    maleChart.data = JSON.parse(JSON.stringify(usData));
    
    // Create axes
    var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
    maleCategoryAxis.dataFields.category = "age";
    maleCategoryAxis.renderer.grid.template.location = 0;
    //maleCategoryAxis.renderer.inversed = true;
    maleCategoryAxis.renderer.minGridDistance = 15;
    
    var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
    maleValueAxis.renderer.inversed = true;
    maleValueAxis.min = 0;
    maleValueAxis.max = 100;
    maleValueAxis.strictMinMax = true;
    
    maleValueAxis.numberFormatter = new am4core.NumberFormatter();
    maleValueAxis.numberFormatter.numberFormat = "#.#'%'";
    
    // Create series
    var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
    maleSeries.dataFields.valueX = "male";
    maleSeries.dataFields.valueXShow = "percent";
    maleSeries.calculatePercent = true;
    maleSeries.dataFields.categoryY = "age";
    maleSeries.interpolationDuration = 1000;
    maleSeries.columns.template.tooltipText = "Masculinos, edad de {categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    //maleSeries.sequencedInterpolation = true;
    
    
    var femaleChart = mainContainer.createChild(am4charts.XYChart);
    femaleChart.paddingLeft = 0;
    femaleChart.data = JSON.parse(JSON.stringify(usData));
    
    // Create axes
    var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
    femaleCategoryAxis.renderer.opposite = true;
    femaleCategoryAxis.dataFields.category = "age";
    femaleCategoryAxis.renderer.grid.template.location = 0;
    femaleCategoryAxis.renderer.minGridDistance = 15;
    
    var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
    femaleValueAxis.min = 0;
    femaleValueAxis.max = 100;
    femaleValueAxis.strictMinMax = true;
    femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
    femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";
    femaleValueAxis.renderer.minLabelPosition = 0.01;
    
    // Create series
    var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
    femaleSeries.dataFields.valueX = "female";
    femaleSeries.dataFields.valueXShow = "percent";
    femaleSeries.calculatePercent = true;
    femaleSeries.fill = femaleChart.colors.getIndex(4);
    femaleSeries.stroke = femaleSeries.fill;
    //femaleSeries.sequencedInterpolation = true;
    femaleSeries.columns.template.tooltipText = "Femeninos, edad de {categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    femaleSeries.dataFields.categoryY = "age";
    femaleSeries.interpolationDuration = 1000;
    
    
    var mapChart = mainContainer.createChild(am4maps.MapChart);
    mapChart.projection = new am4maps.projections.Mercator();
    mapChart.geodata = am4geodata_region_mexico_chpLow;
    mapChart.zoomControl = new am4maps.ZoomControl();
    mapChart.zIndex = -1;
    
    var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries())
    polygonSeries.useGeodata = true;
    
    var selectedStateId = "";
    var selectedPolygon;
    var selectedStateName;
    
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.togglable = true;
    
    var hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fill = mapChart.colors.getIndex(2);
    
    var activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = mapChart.colors.getIndex(6);
    
    polygonTemplate.events.on("hit", function(event) {
      var id = event.target.dataItem.dataContext.id;
      var stateId = id;
      showState(stateId, event.target.dataItem.dataContext.COUNTY, event.target);
    })
    
    
    mapChart.seriesContainer.background.events.on("over", function(event) {
      showState(selectedStateId, selectedStateName, selectedPolygon);
    });
    
    
    function showState(id, stateName, polygon) {
      if(selectedStateId != id){
    
        var newData = stateData[id];
    
        if (selectedPolygon) {
          selectedPolygon.isActive = false;
        }
    
        for (var i = 0; i < femaleChart.data.length; i++) {
          femaleChart.data[i].female = newData[i].female;
          maleChart.data[i].male = newData[i].male;
        }
    
        femaleChart.invalidateRawData();
        maleChart.invalidateRawData();
    
        selectedStateName = stateName;
        selectedStateId = id;
        selectedPolygon = polygon;
    
        label.text = stateName+" Incidencias Médicas";
        label.hide(0);
        label.show();
       }
    }
    
    var label = mainContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.x = am4core.percent(80);
    label.horizontalCenter = "middle";
    label.y = 50;
    label.showOnInit = true;
    label.text = "Estado de Chiapas";
    label.hiddenState.properties.dy = -100;
    
    var stateData = {
      "07059": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 4
        },
        {
          "age": "26 to 50",
          "male": 4,
          "female": 5
        },
        {
          "age": "51 to 75",
          "male": 2,
          "female": 16
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07052": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 23,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 3,
          "female": 23
        },
        {
          "age": "51 to 75",
          "male": 7,
          "female": 32
        },
        
        {
          "age": "76 y más",
          "male": 4,
          "female": 0
        }
      ],
      "07065": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 3
        },
        
        {
          "age": "76 y más",
          "male": 3,
          "female": 1
        }
      ],
      "07041": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 3
        },
        
        {
          "age": "76 y más",
          "male": 3,
          "female": 1
        }
      ],
      "07009": [
		{
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 23,
          "female": 26
        },
        {
          "age": "51 to 75",
          "male": 31,
          "female": 43
        },
        
        {
          "age": "76 y más",
          "male": 6,
          "female": 23
        }
      ],
      "07001": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 2,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 12,
          "female": 43
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 3
        },
        
        {
          "age": "76 y más",
          "male": 15,
          "female": 28
        }
      ],
      "07089": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 4
        },
        {
          "age": "18 to 25",
          "male": 54,
          "female": 77
        },
        {
          "age": "26 to 50",
          "male": 253,
          "female": 610
        },
        {
          "age": "51 to 75",
          "male": 378,
          "female": 1478
        },
        
        {
          "age": "76 y más",
          "male": 166,
          "female": 328
        }
      ],
      "07074": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07044": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 2,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 1,
          "female": 0
        }
      ],
      "07105": [
      {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 3,
          "female": 3
        },
        {
          "age": "26 to 50",
          "male": 4,
          "female": 15
        },
        {
          "age": "51 to 75",
          "male": 14,
          "female": 28
        },
        
        {
          "age": "76 y más",
          "male": 3,
          "female": 1
        }
      ],
      "07038": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 3
        },
        {
          "age": "26 to 50",
          "male": 4,
          "female": 17
        },
        {
          "age": "51 to 75",
          "male": 14,
          "female": 28
        },
        
        {
          "age": "76 y más",
          "male": 1,
          "female": 0
        }
      ],
      "07081": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 2
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07110": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 6,
          "female": 7
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07078": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 5,
          "female": 4
        },
        {
          "age": "26 to 50",
          "male": 8,
          "female": 26
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 18
        },
        
        {
          "age": "76 y más",
          "male": 1,
          "female": 2
        }
      ],
      "07020": [
      {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 4,
          "female": 8
        },
        {
          "age": "51 to 75",
          "male": 2,
          "female": 24
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07109": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07048": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
     "07072": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
    "07056": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
     "07110": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
     "07049": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
     "07114": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 2
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
    "07112": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07106": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 3,
          "female": 12
        },
        {
          "age": "51 to 75",
          "male": 7,
          "female": 3
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07032": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 25,
          "female": 45
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 5
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07006": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 3
        },
        {
          "age": "26 to 50",
          "male": 14,
          "female": 14
        },
        {
          "age": "51 to 75",
          "male": 9,
          "female": 25
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 1
        }
      ],
      "07026": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07088": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 3
        },
        
        {
          "age": "76 y más",
          "male": 3,
          "female": 1
        }
      ],
      "07066": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07119": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07057": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 13,
          "female": 12
        },
        {
          "age": "26 to 50",
          "male": 42,
          "female": 108
        },
        {
          "age": "51 to 75",
          "male": 39,
          "female": 47
        },
        
        {
          "age": "76 y más",
          "male": 25,
          "female": 17
        }
      ],
      "07002": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 3,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07064": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 0
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07039": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        }, 
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07117": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 1
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 10
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 2
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07042": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },     
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07102": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 4
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 25
        },
        {
          "age": "26 to 50",
          "male": 27,
          "female": 84
        },
        {
          "age": "51 to 75",
          "male": 32,
          "female": 86
        },
        
        {
          "age": "76 y más",
          "male": 10,
          "female": 5
        }
      ],
      "07062": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07116": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 1,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 2,
          "female": 2
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07047": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 1,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07054": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 4
        },
        {
          "age": "18 to 25",
          "male": 8,
          "female": 2
        },
        {
          "age": "26 to 50",
          "male": 14,
          "female": 35
        },
        {
          "age": "51 to 75",
          "male": 36,
          "female": 76
        },
        
        {
          "age": "76 y más",
          "male": 8,
          "female": 6
        }
      ],
      "07070": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 5
        },
        {
          "age": "26 to 50",
          "male": 3,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 5,
          "female": 5
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07115": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 5
        },
        {
          "age": "26 to 50",
          "male": 3,
          "female": 5
        },
        {
          "age": "51 to 75",
          "male": 5,
          "female": 7
        },     
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07021": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 7
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07008": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07011": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 3,
          "female": 2
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 16
        },
        {
          "age": "51 to 75",
          "male": 11,
          "female": 5
        },    
        {
          "age": "76 y más",
          "male": 0,
          "female": 2
        }
      ],
      "07098": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 2
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 5
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07111": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 1
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07069": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 20,
          "female": 4
        },
        {
          "age": "26 to 50",
          "male": 34,
          "female": 128
        },
        {
          "age": "51 to 75",
          "male": 58,
          "female": 158
        },   
        {
          "age": "76 y más",
          "male": 22,
          "female": 30
        }
      ],
      "07045": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07028": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07012": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 2,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 7,
          "female": 4
        }, 
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07053": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 18,
          "female": 5
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 8
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 3
        }
      ],
      "07118": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 3
        },
        {
          "age": "76 y más",
          "male": 3,
          "female": 1
        }
      ],
      "07073": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },     
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07094": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 4,
          "female": 3
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 10
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07010": [
       {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 6
        },
        {
          "age": "51 to 75",
          "male": 2,
          "female": 0
        },
        {
          "age": "76 y más",
          "male": 1,
          "female": 0
        }
      ],
      "07022": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 3,
          "female": 0
        }, 
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07051": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 6,
          "female": 21
        },
        {
          "age": "26 to 50",
          "male": 21,
          "female": 112
        },
        {
          "age": "51 to 75",
          "male": 44,
          "female": 117
        },
        {
          "age": "76 y más",
          "male": 13,
          "female": 23
        }
      ],
      "07060": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07093": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },  
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07007": [
        {
          "age": "0 to 17",
          "male": 2,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 1,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07046": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 2
        },
        {
          "age": "26 to 50",
          "male": 3,
          "female": 12
        },
        {
          "age": "51 to 75",
          "male": 6,
          "female": 5
        },
        
        {
          "age": "76 y más",
          "male": 5,
          "female": 0
        }
      ],
      "07017": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 13,
          "female": 8
        },
        {
          "age": "51 to 75",
          "male": 9,
          "female": 14
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 1
        }
      ],
      "07029": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        {
          "age": "76 y más",
          "male": 4,
          "female": 0
        }
      ],
      "07058": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 1
        },    
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07108": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 10,
          "female": 12
        },
        {
          "age": "51 to 75",
          "male": 15,
          "female": 10
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 1
        }
      ],
      "07096": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },
        
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07099": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 3,
          "female": 11
        },
        {
          "age": "26 to 50",
          "male": 13,
          "female": 43
        },
        {
          "age": "51 to 75",
          "male": 3,
          "female": 21
        },
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07050": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        }, 
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07090": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },     
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07004": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 1
        },
        {
          "age": "26 to 50",
          "male": 2,
          "female": 9
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 28
        },
        
        {
          "age": "76 y más",
          "male": 4,
          "female": 0
        }
      ],
      "07097": [
        {
          "age": "0 to 17",
          "male": 1,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 7,
          "female": 4
        },
        {
          "age": "26 to 50",
          "male": 38,
          "female": 102
        },
        {
          "age": "51 to 75",
          "male": 58,
          "female": 127
        },  
        {
          "age": "76 y más",
          "male":17,
          "female": 17
        }
      ],
      "07031": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 1
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 5,
          "female": 0
        },  
        {
          "age": "76 y más",
          "male": 1,
          "female": 0
        }
      ],
      "07087": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 1,
          "female": 13
        },
        {
          "age": "26 to 50",
          "male": 27,
          "female": 57
        },
        {
          "age": "51 to 75",
          "male": 26,
          "female": 57
        },   
        {
          "age": "76 y más",
          "male": 3,
          "female": 24
        }
      ],
      "07023": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
    "07016": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
     "07077": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
     "07076": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
    "07003": [
        {
          "age": "0 to 17",
          "male": 1,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 10,
          "female": 7
        },
        {
          "age": "26 to 50",
          "male": 12,
          "female": 86
        },
        {
          "age": "51 to 75",
          "male": 48,
          "female": 87
        },   
        {
          "age": "76 y más",
          "male": 32,
          "female": 19
        }
      ],  
    "07005": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07013": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 2,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 4
        },
        {
          "age": "51 to 75",
          "male": 7,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07014": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 1,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07015": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07018": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 7
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07019": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 9
        },
        {
          "age": "26 to 50",
          "male": 19,
          "female": 72
        },
        {
          "age": "51 to 75",
          "male": 26,
          "female": 73
        },   
        {
          "age": "76 y más",
          "male": 5,
          "female": 21
        }
      ],  
      "07024": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 3,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 2,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07025": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07027": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 5,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 9
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07030": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 3,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 13,
          "female": 8
        },
        {
          "age": "51 to 75",
          "male": 3,
          "female": 10
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 6
        }
      ],  
      "07033": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07034": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 1
        },
        {
          "age": "18 to 25",
          "male": 4,
          "female": 3
        },
        {
          "age": "26 to 50",
          "male": 5,
          "female": 60
        },
        {
          "age": "51 to 75",
          "male": 31,
          "female": 31
        },   
        {
          "age": "76 y más",
          "male": 5,
          "female": 13
        }
      ],  
      "07035": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 1
        },
        {
          "age": "18 to 25",
          "male": 1,
          "female": 1
        },
        {
          "age": "26 to 50",
          "male": 8,
          "female": 15
        },
        {
          "age": "51 to 75",
          "male": 7,
          "female": 32
        },   
        {
          "age": "76 y más",
          "male": 15,
          "female": 0
        }
      ],  
      "07036": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 3
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07037": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 6
        },
        {
          "age": "26 to 50",
          "male": 35,
          "female": 62
        },
        {
          "age": "51 to 75",
          "male": 57,
          "female": 69
        },   
        {
          "age": "76 y más",
          "male": 1,
          "female": 1
        }
      ],  
      "07040": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 4,
          "female": 4
        },
        {
          "age": "26 to 50",
          "male": 40,
          "female": 56
        },
        {
          "age": "51 to 75",
          "male": 47,
          "female": 89
        },   
        {
          "age": "76 y más",
          "male": 14,
          "female": 9
        }
      ],  
      "07043": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07055": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 2
        },
        {
          "age": "26 to 50",
          "male": 2,
          "female": 8
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 1
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07061": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 3,
          "female": 3
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 18
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 7
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 2
        }
      ],  
      "07063": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07067": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07068": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 2
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07071": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 6
        },
        {
          "age": "26 to 50",
          "male": 4,
          "female": 26
        },
        {
          "age": "51 to 75",
          "male": 26,
          "female": 37
        },   
        {
          "age": "76 y más",
          "male": 8,
          "female": 7
        }
      ],  
      "07075": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 2
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 1
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07080": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 1
        },
        {
          "age": "26 to 50",
          "male": 8,
          "female": 53
        },
        {
          "age": "51 to 75",
          "male": 8,
          "female": 35
        },   
        {
          "age": "76 y más",
          "male": 1,
          "female": 1
        }
      ],  
      "07082": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 2
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07083": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 1,
          "female": 1
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 2
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 3
        }
      ],  
      "07084": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07085": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 1,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07086": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 6
        },
        {
          "age": "51 to 75",
          "male": 5,
          "female": 2
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07090": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07091": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 2
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07092": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 6
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 8
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07100": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 2
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  

      "07101": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 3,
          "female": 4
        },
        {
          "age": "26 to 50",
          "male": 20,
          "female": 37
        },
        {
          "age": "51 to 75",
          "male": 43,
          "female": 44
        },   
        {
          "age": "76 y más",
          "male": 6,
          "female": 7
        }
      ],  
      "07103": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],  
      "07104": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 1
        }
      ],  
    
    "07107": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ], 
       "07113": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 0,
          "female": 0
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ],
      "07079": [
        {
          "age": "0 to 17",
          "male": 0,
          "female": 0
        },
        {
          "age": "18 to 25",
          "male": 0,
          "female": 0
        },
        {
          "age": "26 to 50",
          "male": 0,
          "female": 0
        },
        {
          "age": "51 to 75",
          "male": 1,
          "female": 6
        },   
        {
          "age": "76 y más",
          "male": 0,
          "female": 0
        }
      ]              
    }
    }); // end am4core.ready()