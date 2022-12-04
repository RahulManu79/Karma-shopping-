class Dashboard {
    constructor() {
      (this._horizontalTooltipChart = null),
        "undefined" != typeof Chart && "undefined" != typeof ChartsExtend
          ? this._initCustomTooltipBar()
          : console.error("[CS] ChartsExtend is undefined."),
        jQuery().barrating
          ? this._initBarrating()
          : console.error("[CS] jQuery().barrating is undefined."),
        this._initEvents();
    }
    
    _initCustomTooltipBar() {
      var DateSpan = document.getElementById('DateSpan').innerHTML
      DateSpan=DateSpan.split(',')
      var OrderCompletedata = document.getElementById('OrderCompletedata').innerHTML
      OrderCompletedata=OrderCompletedata.split(',').map((e) => parseInt(e));
      var Ordercanceldata = document.getElementById('Ordercanceldata').innerHTML
      Ordercanceldata=Ordercanceldata.split(',').map((e) => parseInt(e));
  
  
      
  
      if (document.getElementById("horizontalTooltipChart")) {
        const t = document
          .getElementById("horizontalTooltipChart")
          .getContext("2d");
          
  
          //get min , max , avg
          let tempArray = OrderCompletedata.concat(Ordercanceldata)
          let max=(Math.max(...tempArray));
          let min=(Math.min(...tempArray));
          let avg=Math.round(((max+min)*10)/100)
          //
  
        this._horizontalTooltipChart = new Chart(t, {
          type: "bar",
          data: {
            labels: DateSpan,
            datasets: [
              {
                label: "Completed",
                icon: "check",
                borderColor: Globals.primary,
                backgroundColor: "rgba(" + Globals.primaryrgb + ",0.1)",
                data: OrderCompletedata,
                borderWidth: 2,
              },
              {
                label: "Cancelled",
                icon: "close",
                borderColor: Globals.danger,
                backgroundColor: "rgba(" + Globals.secondaryrgb + ",0.1)",
                data: Ordercanceldata,
                borderWidth: 2,
              },
            ],
          },
          options: {
            cornerRadius: parseInt(Globals.borderRadiusMd),
            plugins: { crosshair: !1, datalabels: { display: !1 } },
            responsive: !0,
            maintainAspectRatio: !1,
            legend: { position: "bottom", labels: ChartsExtend.LegendLabels() },
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: !0,
                    lineWidth: 1,
                    color: Globals.separator,
                    drawBorder: !1,
                  },
                  ticks: {
                    beginAtZero: !0,
                    stepSize: avg,
                    min: min,
                    max: max,
                    padding: 20,
                  },
                },
              ],
              xAxes: [{ gridLines: { display: !1 } }],
            },
            tooltips: {
              enabled: !1,
              custom: function (t) {
                const a =
                  this._chart.canvas.parentElement.querySelector(
                    ".custom-tooltip"
                  );
                if (0 === t.opacity) return void (a.style.opacity = 0);
                if (
                  (a.classList.remove("above", "below", "no-transform"),
                  t.yAlign
                    ? a.classList.add(t.yAlign)
                    : a.classList.add("no-transform"),
                  t.body)
                ) {
                  const o = this,
                    e = t.dataPoints[0].index,
                    r = t.dataPoints[0].datasetIndex,
                    i = a.querySelector(".icon");
                  (a.querySelector(".icon-container").style =
                    "border-color: " +
                    t.labelColors[0].borderColor +
                    "!important"),
                    (i.style = "color: " + t.labelColors[0].borderColor + ";"),
                    i.setAttribute("data-acorn-icon", o._data.datasets[r].icon),
                    new AcornIcons().replace(),
                    (a.querySelector(".text").innerHTML =
                      o._data.datasets[r].label.toLocaleUpperCase()),
                    (a.querySelector(".value").innerHTML =
                      o._data.datasets[r].data[e]);
                }
                const o = this._chart.canvas.offsetTop,
                  e = this._chart.canvas.offsetLeft;
                (a.style.opacity = 1),
                  (a.style.left = e + t.dataPoints[0].x - 75 + "px"),
                  (a.style.top = o + t.caretY + "px");
              },
            },
          },
        });
      }
    }
    _initBarrating() {
      jQuery(".rating").each(function () {
        const t = jQuery(this).data("initialRating"),
          a = jQuery(this).data("readonly"),
          o = jQuery(this).data("showSelectedRating"),
          e = jQuery(this).data("showValues");
        jQuery(this).barrating({
          initialRating: t,
          readonly: a,
          showValues: e,
          showSelectedRating: o,
          onSelect: function (t, a) {},
          onClear: function (t, a) {},
        });
      });
    }
    _initEvents() {
      document.documentElement.addEventListener(
        Globals.colorAttributeChange,
        (t) => {
          this._horizontalTooltipChart && this._horizontalTooltipChart.destroy(),
            this._initCustomTooltipBar();
        }
      );
    }
  }