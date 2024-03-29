"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.GraficaBarrasComponent = void 0;
var core_1 = require("@angular/core");
var chart_js_1 = require("chart.js");
var tooltip_1 = require("@angular/material/tooltip");
var GraficaBarrasComponent = /** @class */ (function () {
    function GraficaBarrasComponent(service, renderer) {
        var _this = this;
        this.service = service;
        this.renderer = renderer;
        this.columna1_selec = "Selecciona una columna primero";
        this.columna2_selec = "Selecciona una columna primero";
        this.tooltipContent = "En este gráfico de barras verticales interactivo, se presenta la opción de seleccionar dos variables. Al elegir las variables de interés, la visualización se ajusta dinámicamente, proporcionando un análisis comparativo entre las dos categorías seleccionadas. Al pasar el cursor sobre cada barra, se muestra la información detallada, incluyendo los valores numéricos asociados a cada categoría. Esta funcionalidad brinda una herramienta efectiva para explorar las relaciones y tendencias entre las dos variables seleccionadas, permitiendo una comprensión más profunda de la distribución y la interacción entre los datos.";
        this.originalData = null;
        this.lastSelectedColumns = { columna1: null, columna2: null };
        this.getOrCreateLegendList = function (chart, id) {
            var legendContainer = document.getElementById(id);
            var listContainer = legendContainer.querySelector("ul");
            if (!listContainer) {
                listContainer = document.createElement("ul");
                listContainer.style.display = "flex";
                listContainer.style.flexDirection = "column";
                listContainer.style.margin = "0";
                listContainer.style.padding = "0";
                legendContainer.appendChild(listContainer);
            }
            return listContainer;
        };
        this.createCustomLegendItems = function (chart, options) {
            var ul = _this.getOrCreateLegendList(chart, options.containerID);
            while (ul.firstChild) {
                ul.firstChild.remove();
            }
            var items = chart.options.plugins.legend.labels.generateLabels(chart);
            items.sort(function (a, b) {
                if (typeof a.text === "string" && typeof b.text === "string") {
                    return a.text.localeCompare(b.text);
                }
                else if (typeof a.text === "number" && typeof b.text === "number") {
                    return a.text - b.text;
                }
                return 0;
            });
            items.forEach(function (item) {
                var li = document.createElement("li");
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.display = "flex";
                li.style.flexDirection = "row";
                li.style.marginLeft = "10px";
                li.onclick = function () {
                    var type = chart.config.type;
                    if (type === "pie" || type === "doughnut") {
                        chart.toggleDataVisibility(item.index);
                    }
                    else {
                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                    }
                    chart.update();
                };
                var boxSpan = document.createElement("span");
                boxSpan.style.background = item.fillStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + "px";
                boxSpan.style.display = "inline-block";
                boxSpan.style.flexShrink = "0";
                boxSpan.style.height = "20px";
                boxSpan.style.marginRight = "10px";
                boxSpan.style.width = "20px";
                var textContainer = document.createElement("p");
                textContainer.style.color = item.fontColor;
                textContainer.style.margin = "0";
                textContainer.style.padding = "0";
                textContainer.style.textDecoration = item.hidden ? "line-through" : "";
                var text = document.createTextNode(item.text);
                textContainer.appendChild(text);
                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        };
        this.createCustomLegendItems2 = function (chart, options) {
            var ul = _this.getOrCreateLegendList(chart, options.containerID);
            while (ul.firstChild) {
                ul.firstChild.remove();
            }
            if (_this.originalData === null ||
                _this.lastSelectedColumns.columna1 !== _this.columna1_selec ||
                _this.lastSelectedColumns.columna2 !== _this.columna2_selec) {
                _this.originalData = chart.data.datasets.map(function (dataset) { return __spreadArrays(dataset.data); });
                // Actualiza las últimas columnas seleccionadas
                _this.lastSelectedColumns.columna1 = _this.columna1_selec;
                _this.lastSelectedColumns.columna2 = _this.columna2_selec;
            }
            var labels = chart.data.labels;
            labels.forEach(function (label, index) {
                var li = document.createElement("li");
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.display = "flex";
                li.style.flexDirection = "row";
                li.style.marginLeft = "10px";
                li.onclick = function () {
                    chart.data.datasets.forEach(function (dataset) {
                        var datasetIndex = chart.data.datasets.indexOf(dataset);
                        if (dataset.data[index] === null) {
                            dataset.data[index] = _this.originalData[datasetIndex][index];
                        }
                        else {
                            dataset.data[index] = null;
                        }
                    });
                    chart.update();
                };
                var textContainer = document.createElement("p");
                textContainer.style.color = label.fontColor;
                textContainer.style.margin = "0";
                textContainer.style.padding = "0";
                textContainer.style.textDecoration = chart.data.datasets.some(function (dataset) { return dataset.data[index] === null; }) ? "line-through" : "";
                var text = document.createTextNode(label);
                textContainer.appendChild(text);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        };
    }
    GraficaBarrasComponent.prototype.ngOnInit = function () {
        var _this = this;
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.service.obtenerDF().subscribe(function (result) {
            _this.dataframe = JSON.parse(result.dataframe);
            _this.columnas = Object.keys(_this.dataframe[0]);
            if (_this.columna1_selec !== "Selecciona una columna primero" ||
                _this.columna2_selec !== "Selecciona una columna primero") {
                _this.crearGraficoBarras(_this.columna1_selec, _this.columna2_selec);
            }
        });
    };
    GraficaBarrasComponent.prototype.beforeunloadHandler = function (event) {
        // Borrar la clave del localStorage al cerrar la pestaña
        localStorage.removeItem('primerCarga');
        if (localStorage.getItem('formData')) {
            // Si existe, eliminar la clave del localStorage
            localStorage.removeItem('formData');
        }
    };
    GraficaBarrasComponent.prototype.actualizarGrafica = function () {
        console.log("se llama actualizar");
        if (this.myChart) {
            this.myChart.destroy(); // Destruye la gráfica anterior si existe
        }
        if (this.columna1_selec !== "Selecciona una columna primero" &&
            this.columna2_selec !== "Selecciona una columna primero") {
            this.crearGraficoBarras(this.columna1_selec, this.columna2_selec);
        }
    };
    GraficaBarrasComponent.prototype.crearGraficoBarras = function (columna1_selec, columna2_selec) {
        var _this = this;
        var data = this.dataframe;
        console.log(this.dataframe);
        console.log(columna1_selec);
        console.log(columna2_selec);
        // Obtener los valores únicos de los ejes
        var eje1 = Array.from(new Set(data.map(function (item) { return item[columna1_selec]; })));
        var eje2 = Array.from(new Set(data.map(function (item) { return item[columna2_selec]; })));
        // Contar el número de registros por combinación de ejes
        var contador = new Map();
        data.forEach(function (item) {
            var clave = item[columna1_selec] + "-" + item[columna2_selec];
            contador.set(clave, (contador.get(clave) || 0) + 1);
        });
        // Preparar los datos para el gráfico de barras
        var datos = [];
        eje1.forEach(function (columna1_selec) {
            var fila = { columna1_selec: columna1_selec };
            eje2.forEach(function (columna2_selec) {
                var clave = columna1_selec + "-" + columna2_selec;
                fila[columna2_selec] = contador.get(clave) || 0;
            });
            datos.push(fila);
        });
        // Ordenar los datos por la primera columna
        datos.sort(function (a, b) { return a.columna1_selec - b.columna2_selec; });
        // Obtener los valores de los ejes
        var etiquetas = datos.map(function (item) { return item.columna1_selec; });
        var valores = eje2.map(function (columna2_selec) {
            return datos.map(function (item) { return item[columna2_selec]; });
        });
        // Generar una lista de colores aleatorios
        var colores = this.generarColoresAleatorios(valores.length);
        var htmlLegendPlugin1 = {
            id: "htmlLegend1",
            afterUpdate: function (chart, args, options) {
                _this.createCustomLegendItems(chart, options);
            }
        };
        var htmlLegendPlugin2 = {
            id: "htmlLegend2",
            afterUpdate: function (chart, args, options) {
                _this.createCustomLegendItems2(chart, options);
            }
        };
        // Crear el gráfico de barras
        var ctx = document.getElementById("myChart");
        this.myChart = new chart_js_1.Chart(ctx, {
            type: "bar",
            data: {
                labels: etiquetas,
                datasets: eje2.map(function (item, index) { return ({
                    label: item,
                    data: valores[index],
                    backgroundColor: _this.getRandomColorWithOpacity(0.5),
                    borderWidth: 1
                }); })
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    // @ts-ignore
                    htmlLegend1: {
                        containerID: "legend-container-1"
                    },
                    htmlLegend2: {
                        containerID: "legend-container-2"
                    },
                    datalabels: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            maxTicksLimit: 5
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: columna1_selec + " - " + columna2_selec
                        }
                    }
                }
            },
            plugins: [htmlLegendPlugin1, htmlLegendPlugin2]
        });
    };
    GraficaBarrasComponent.prototype.getRandomColorWithOpacity = function (opacity) {
        var getRandomHex = function () { return Math.floor(Math.random() * 256).toString(16); };
        var color;
        do {
            color = "#" + getRandomHex() + getRandomHex() + getRandomHex();
        } while (parseInt(color.substr(1), 16) < parseInt("444444", 16));
        return "" + color + Math.round(opacity * 255).toString(16);
    };
    GraficaBarrasComponent.prototype.generarColoresAleatorios = function (cantidad) {
        var colores = [];
        for (var i = 0; i < cantidad; i++) {
            var color = this.generarColorAleatorio();
            colores.push(color);
        }
        return colores;
    };
    GraficaBarrasComponent.prototype.generarColorAleatorio = function () {
        var letras = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    GraficaBarrasComponent.prototype.showTooltip = function () {
        if (!this.tooltip.disabled) {
            this.tooltip.show();
        }
    };
    GraficaBarrasComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.listen(this.tooltipIcon.nativeElement, "click", function () {
            _this.showTooltip();
        });
    };
    __decorate([
        core_1.ViewChild(tooltip_1.MatTooltip)
    ], GraficaBarrasComponent.prototype, "tooltip");
    __decorate([
        core_1.ViewChild("tooltipIcon")
    ], GraficaBarrasComponent.prototype, "tooltipIcon");
    __decorate([
        core_1.HostListener('window:beforeunload', ['$event']),
        core_1.HostListener('window:pagehide', ['$event'])
    ], GraficaBarrasComponent.prototype, "beforeunloadHandler");
    GraficaBarrasComponent = __decorate([
        core_1.Component({
            selector: "app-grafica-barras",
            templateUrl: "./grafica-barras.component.html",
            styleUrls: ["./grafica-barras.component.scss"]
        })
    ], GraficaBarrasComponent);
    return GraficaBarrasComponent;
}());
exports.GraficaBarrasComponent = GraficaBarrasComponent;
