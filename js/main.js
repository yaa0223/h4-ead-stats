window.onload = function() {
  var data = [];
  Plotly.d3.csv('data.csv', function(err, rows){
    console.log(rows[0]);
    data = rows;
    plot(data);
  });

  $('#service-center').change(function() {
    plot(data);
  });

  $("#premium").change(function() {
    plot(data);
  });

  $("#application-type").change(function() {
    plot(data);
  });

  /**
   * @param {string} service_center Service center name or 'all'
   * @param {string} premium 'all', 'yes', 'no'
   * @param {string} application_type 'all', 'renewal', 'new application'
   * @param {Array.{Object}} rows rows in data.csv
   */
  var plot = function(rows) {
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

    var filtered_rows = rows;
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
    x = filtered_rows.map(function(row) {
      return parseInt(row.total_processing_days);
    });
    var data = [
      {
        x: x,
        type: 'histogram'
      }
    ];
    Plotly.newPlot('graph', data);
  };
}
