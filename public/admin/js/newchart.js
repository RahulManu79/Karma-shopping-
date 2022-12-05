class ChartsExtend {
    static LegendLabels() {
      return {
        padding: 20,
        usePointStyle: !0,
        fontSize: 14,
        boxWidth: 10,
        fontFamily: Globals.font,
      };
    }
    static ChartTooltip() {
      return {
        backgroundColor: Globals.foreground,
        titleFontColor: Globals.primary,
        borderColor: Globals.separator,
        borderWidth: 1,
        bodyFontColor: Globals.body,
        fontFamily: Globals.font,
        bodySpacing: 10,
        xPadding: 15,
        yPadding: 15,
        cornerRadius: parseInt(Globals.borderRadiusMd),
        displayColors: !1,
        intersect: !1,
      };
    }
    static ChartTooltipForCrosshair() {
      return {
        backgroundColor: Globals.foreground,
        titleFontColor: Globals.primary,
        borderColor: Globals.separator,
        borderWidth: 1,
        bodyFontColor: Globals.body,
        fontFamily: Globals.font,
        bodySpacing: 10,
        xPadding: 15,
        yPadding: 15,
        cornerRadius: parseInt(Globals.borderRadiusMd),
        displayColors: !1,
        intersect: !1,
        position: "nearest",
        mode: "index",
      };
    }
    static Crosshair() {
      return {
        line: { color: Globals.separator, width: 1 },
        sync: { enabled: !1 },
        pan: { incrementer: 3 },
        zoom: { enabled: !1 },
      };
    }
    static CenterTextPlugin() {
      return {
        afterDatasetsUpdate: function (t) {},
        beforeDraw: function (t) {
          var e = t.chartArea.right,
            a = t.chartArea.bottom,
            o = t.chart.ctx;
          o.restore();
          var n = t.data.labels[0],
            r = t.data.datasets[0].data[0],
            s = t.data.datasets[0],
            l = s._meta[Object.keys(s._meta)[0]],
            d = l.total,
            i = parseFloat(((r / d) * 100).toFixed(1));
          (i = t.legend.legendItems[0].hidden ? 0 : i),
            t.pointAvailable &&
              ((n = t.data.labels[t.pointIndex]),
              (r = t.data.datasets[t.pointDataIndex].data[t.pointIndex]),
              (d = (l = (s = t.data.datasets[t.pointDataIndex])._meta[
                Object.keys(s._meta)[0]
              ]).total),
              (i = parseFloat(((r / d) * 100).toFixed(1))),
              (i = t.legend.legendItems[t.pointIndex].hidden ? 0 : i)),
            (o.font = "28px" + Globals.font),
            (o.textBaseline = "middle"),
            (o.fillStyle = Globals.body);
          var c = i + "%",
            u = Math.round((e - o.measureText(c).width) / 2),
            p = a / 2;
          o.fillText(c, u, p),
            (o.fillStyle = Globals.alternate),
            (o.font = "12px" + Globals.font),
            (o.textBaseline = "top");
          var h = n.toLocaleUpperCase();
          (u = Math.round((e - o.measureText(h).width) / 2)), (p = a / 2 - 30);
          o.fillText(h, u, p), o.save();
        },
        beforeEvent: function (t, e, a) {
          var o = t.getElementAtEvent(e)[0];
          o &&
            ((t.pointIndex = o._index),
            (t.pointDataIndex = o._datasetIndex),
            (t.pointAvailable = !0));
        },
      };
    }
    static CenterTextPluginSmall() {
      return {
        afterDatasetsUpdate: function (t) {},
        beforeDraw: function (t) {
          var e = t.chartArea.right,
            a = t.chartArea.bottom,
            o = t.chart.ctx;
          o.restore();
          var n = t.data.datasets[0].data[0],
            r = t.data.datasets[0],
            s = r._meta[Object.keys(r._meta)[0]].total,
            l = parseFloat(((n / s) * 100).toFixed(1));
          (l = t.data.datasets[0].data[0] / s),
            (l = parseFloat((100 * l).toFixed(1))),
            (o.font = "12px" + Globals.font),
            (o.textBaseline = "middle"),
            (o.fillStyle = Globals.primary);
          var d = l + "%",
            i = Math.round((e - o.measureText(d).width) / 2),
            c = a / 2;
          o.fillText(d, i, c), o.save();
        },
        beforeEvent: function (t, e, a) {
          var o = t.getElementAtEvent(e)[0];
          o &&
            ((t.pointIndex = o._index),
            (t.pointDataIndex = o._datasetIndex),
            (t.pointAvailable = !0));
        },
      };
    }
    static LargeLineChartTooltip() {
      const t = {
        enabled: !1,
        custom: function (t) {
          var e = this._chart.canvas.closest(".chart-container");
          if (t.body) {
            var a = this,
              o = t.dataPoints[0].index,
              n = t.dataPoints[0].datasetIndex;
            e
              .querySelector(".icon")
              .setAttribute("data-acorn-icon", a._data.datasets[n].icons[o]),
              new AcornIcons().replace(),
              (e.querySelector(".title").innerHTML = a._data.datasets[n].label),
              (e.querySelector(".text").innerHTML =
                a._data.labels[o].toLocaleUpperCase()),
              (e.querySelector(".value").innerHTML = Helpers.AddCommas(
                a._data.datasets[n].data[o]
              ));
          }
          e.style.opacity = 1;
        },
      };
      return Object.assign(t, ChartsExtend.ChartTooltipForCrosshair());
    }
    static LargeLineChart(t, e) {
      if (document.getElementById(t)) {
        const s = document.getElementById(t).getContext("2d"),
          l = new Chart(s, {
            type: "line",
            options: {
              events: ["mousemove", "touchmove", "touchstart"],
              plugins: { crosshair: !1 },
              hover: { mode: "index", intersect: !1 },
              layout: { padding: { left: 10, right: 15, top: 35, bottom: 0 } },
              responsive: !0,
              maintainAspectRatio: !1,
              scales: {
                yAxes: [
                  {
                    gridLines: { display: !1, drawBorder: !1 },
                    ticks: { display: !1 },
                  },
                ],
                xAxes: [
                  {
                    gridLines: { display: !1, drawBorder: !1 },
                    ticks: { display: !1 },
                  },
                ],
              },
              plugins: {
                datalabels: {
                  backgroundColor: "transparent",
                  borderRadius: parseInt(Globals.borderRadiusMd),
                  borderWidth: 1,
                  padding: 5,
                  borderColor: function (t) {
                    return t.dataset.borderColor;
                  },
                  color: function (t) {
                    return Globals.alternate;
                  },
                  font: { size: 10 },
                  formatter: Math.round,
                },
              },
              legend: { display: !1 },
              tooltips: ChartsExtend.LargeLineChartTooltip(),
            },
            data: e,
          });
        var a = l.getDatasetMeta(0),
          o = l.canvas.getBoundingClientRect(),
          n = a.data[a.data.length - 1].getCenterPoint(),
          r = new MouseEvent("mousemove", {
            clientX: o.left + n.x,
            clientY: o.top + n.y,
          });
        return l.canvas.dispatchEvent(r), l;
      }
    }
    static SmallDoughnutChart(t, e, a) {
      if (
        (Chart.defaults.doughnutSmall ||
          ((Chart.defaults.doughnutSmall = Chart.defaults.doughnut),
          (Chart.controllers.doughnutSmall = Chart.controllers.doughnut.extend({
            draw: function (t) {
              Chart.controllers.doughnut.prototype.draw.call(this, t);
              var e = this.chart.chart.ctx,
                a = this.chart.getDatasetMeta(0).data[0]._model,
                o = (0.7 * (a.outerRadius - a.innerRadius)) / 2;
              e.save(),
                (e.fillStyle = a.backgroundColor),
                e.beginPath(),
                e.arc(a.x, a.y, a.outerRadius - o, 0, 2 * Math.PI),
                e.arc(a.x, a.y, a.innerRadius + o, 0, 2 * Math.PI, !0),
                e.closePath(),
                e.fill(),
                e.restore();
            },
          }))),
        document.getElementById(t))
      ) {
        const n = document.getElementById(t).getContext("2d");
        var o = new Chart(n, {
          type: "doughnutSmall",
          data: {
            labels: [a],
            datasets: [
              {
                data: e,
                backgroundColor: [Globals.primary, "rgba(0,0,0,0)"],
                borderWidth: [0, 0],
              },
            ],
          },
          plugins: [ChartsExtend.CenterTextPluginSmall()],
          options: {
            cutoutPercentage: 85,
            plugins: { crosshair: !1, datalabels: { display: !1 } },
            legend: !1,
            tooltips: { enabled: !1 },
            aspectRatio: 1,
            legendCallback: function (t) {
              const e = t.canvas.parentElement.parentElement.querySelector(
                ".custom-legend-container"
              );
              e.innerHTML = "";
              var a = t.canvas.parentElement.parentElement
                .querySelector(".custom-legend-item")
                .content.cloneNode(!0);
              (a.querySelector(".text").innerHTML =
                t.data.labels[0].toLocaleUpperCase()),
                (a.querySelector(".value").innerHTML =
                  t.data.datasets[0].data[0] +
                  " / " +
                  (t.data.datasets[0].data[1] + t.data.datasets[0].data[0])),
                e.appendChild(a);
            },
          },
        });
        return o.generateLegend(), o;
      }
    }
    static SmallLineChart(t, e) {
      const a = {
        enabled: !1,
        custom: function (t) {
          var e =
            this._chart.canvas.parentElement.parentElement.querySelector(
              ".custom-tooltip"
            );
          if (t.body) {
            var a = this,
              o = t.dataPoints[0].index,
              n = t.dataPoints[0].datasetIndex;
            e
              .querySelector(".icon")
              .setAttribute("data-acorn-icon", a._data.datasets[n].icons[o]),
              new AcornIcons().replace(),
              (e.querySelector(".title").innerHTML = a._data.datasets[n].label),
              (e.querySelector(".text").innerHTML = a._data.labels[o]),
              (e.querySelector(".value").innerHTML = Helpers.AddCommas(
                a._data.datasets[n].data[o]
              ));
          }
          e.style.opacity = 1;
        },
      };
      if (
        (Object.assign(a, ChartsExtend.ChartTooltipForCrosshair()),
        document.getElementById(t))
      ) {
        const l = document.getElementById(t).getContext("2d"),
          d = new Chart(l, {
            type: "line",
            options: {
              events: ["mousemove", "touchmove", "touchstart"],
              plugins: { crosshair: !1, datalabels: { display: !1 } },
              hover: { mode: "index", intersect: !1 },
              layout: { padding: { left: 6, right: 6, top: 6, bottom: 6 } },
              responsive: !0,
              maintainAspectRatio: !1,
              scales: {
                yAxes: [
                  {
                    gridLines: { display: !1, drawBorder: !1 },
                    ticks: { display: !1 },
                  },
                ],
                xAxes: [
                  {
                    gridLines: { display: !1, drawBorder: !1 },
                    ticks: { display: !1 },
                  },
                ],
              },
              legend: { display: !1 },
              tooltips: a,
            },
            data: e,
          });
        var o = d.getDatasetMeta(0),
          n = d.canvas.getBoundingClientRect(),
          r = o.data[o.data.length - 1].getCenterPoint(),
          s = new MouseEvent("mousemove", {
            clientX: n.left + r.x,
            clientY: n.top + r.y,
          });
        return d.canvas.dispatchEvent(s), d;
      }
    }
  }