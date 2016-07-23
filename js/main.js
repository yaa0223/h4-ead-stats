window.onload = function() {
  var data = [];
  Plotly.d3.csv('data.csv', function(err, rows){
    console.log(rows[0]);
    data = rows;
    update();
  });

  $('#service-center').change(function() {
    update();
  });

  $("#premium").change(function() {
    update();
  });

  $("#application-type").change(function() {
    update();
  });

  var showStats = function(x) {
    if (!x.length) {
      $('#stats').text("No data")
    }

    x.sort(function(a, b) {
      return a - b;
    });
    var median_index = Math.floor(x.length/2);
    var sum = x.reduce(function(prev, curr) {
      return prev + curr;
    }, 0);
    var avg = sum / x.length;
    var stats_str = "Min: " + x[0].toFixed(0) +
                    ", Max: " + x[x.length - 1].toFixed(0) +
                    ", Median: " + x[median_index].toFixed(0) +
                    ", Average: " + avg.toFixed(0) +
                    ", Count: " + x.length;
    $('#stats').text(stats_str);
  };

  /**
   * Plot a histgram given x
   */
  var plot = function(x) {
    var data = [
      {
        type: 'histogram',
        x: x,
        autobinx: false,
        xbins: {
          start: 0,
          end: 365,
          size: 7
        },
      }
    ];
    var layout = {
      xaxis: {title: 'Total Processing Days'},
      yaxis: {title: 'Count'},
      bargap: 0.25,
      bargroupgap: 0.3
    };
    Plotly.newPlot('graph', data, layout);
  };

  var update = function() {
    if (!data.length) {
      return;
    }

    var service_center = "all";
    $("#service-center option:selected").each(function() {
      service_center = $(this).text().toLowerCase();
    });
    var premium = "all";
    $("#premium option:selected").each(function() {
      premium = $(this).text().toLowerCase();
    });
    var application_type = "all";
    $("#application-type option:selected").each(function() {
      application_type = $(this).text().toLowerCase();
    });

    var filtered_rows = data;
    if (service_center != 'all') {
      filtered_rows = filtered_rows.filter(function(row) {
        return row.service_center.toLowerCase() == service_center;
      });
    }
    if (premium != 'all') {
      filtered_rows = filtered_rows.filter(function(row) {
        if (premium == "yes") {
          return row.premium.toLowerCase() == "true";
        }
        return row.premium.toLowerCase() == "false";
      })
    }
    if (application_type != 'all') {
      filtered_rows = filtered_rows.filter(function(row) {
        return row.application_type.toLowerCase() == application_type;
      })
    }
    var x = filtered_rows.map(function(row) {
      return parseInt(row.total_processing_days);
    });
    showStats(x);
    plot(x);
  };
}
