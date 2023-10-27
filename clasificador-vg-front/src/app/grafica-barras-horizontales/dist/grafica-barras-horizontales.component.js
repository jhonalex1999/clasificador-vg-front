"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraficaBarrasHorizontalesComponent = void 0;
var core_1 = require("@angular/core");
var chart_js_1 = require("chart.js");
var GraficaBarrasHorizontalesComponent = /** @class */ (function () {
    function GraficaBarrasHorizontalesComponent(service) {
        var _this = this;
        this.service = service;
        // Función para obtener o crear la lista de elementos de la leyenda HTML personalizada
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
        // Función para crear los elementos de la leyenda HTML personalizada
        this.createCustomLegendItems = function (chart, options) {
            var ul = _this.getOrCreateLegendList(chart, options.containerID);
            // Limpiar los elementos de la leyenda anteriores
            while (ul.firstChild) {
                ul.firstChild.remove();
            }
            // Obtener las etiquetas personalizadas de la columna seleccionada
            var labels = chart.data.labels;
            // Separar las etiquetas en dos arrays: uno para las etiquetas alfabéticas y otro para las etiquetas numéricas
            var alphabeticalLabels = [];
            var numericalLabels = [];
            labels.forEach(function (label) {
                if (isNaN(label)) {
                    alphabeticalLabels.push(label);
                }
                else {
                    numericalLabels.push(Number(label));
                }
            });
            // Ordenar las etiquetas alfabéticas a-z
            alphabeticalLabels.sort();
            // Ordenar las etiquetas numéricas de manera ascendente
            numericalLabels.sort(function (a, b) { return a - b; });
            // Combinar las etiquetas ordenadas en un solo array
            var sortedLabels = alphabeticalLabels.concat(numericalLabels);
            labels.forEach(function (label, index) {
                var li = document.createElement("li");
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.display = "flex";
                li.style.flexDirection = "row";
                li.style.marginLeft = "10px";
                // Color box
                var boxSpan = document.createElement("span");
                boxSpan.style.background = chart.data.datasets[0].backgroundColor[index];
                boxSpan.style.borderColor = chart.data.datasets[0].borderColor[index];
                boxSpan.style.borderWidth = chart.data.datasets[0].borderWidth + "px";
                boxSpan.style.display = "inline-block";
                boxSpan.style.flexShrink = "0";
                boxSpan.style.height = "20px";
                boxSpan.style.marginRight = "10px";
                boxSpan.style.width = "20px";
                // Texto
                var textContainer = document.createElement("p");
                textContainer.style.color = chart.data.datasets[0].fontColor;
                textContainer.style.margin = "0";
                textContainer.style.padding = "0";
                /*textContainer.style.textDecoration = !chart.isDatasetVisible(index)
                  ? "line-through"
                  : "";*/
                var text = document.createTextNode(label);
                textContainer.appendChild(text);
                li.appendChild(boxSpan);
                li.appendChild(textContainer);
                ul.appendChild(li);
            });
        };
    }
    GraficaBarrasHorizontalesComponent.prototype.ngOnInit = function () {
        var _this = this;
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.service.obtenerDF().subscribe(function (result) {
            _this.dataframe = JSON.parse(result.dataframe);
            _this.columnas = Object.keys(_this.dataframe[0]);
            _this.crearGraficaBarrasHorizontal(_this.columna_selec);
        });
    };
    GraficaBarrasHorizontalesComponent.prototype.actualizarGraficaHorizontal = function () {
        console.log("se llama actualizar");
        if (this.myChart) {
            this.myChart.destroy(); // Destruye la gráfica anterior si existe
        }
        this.crearGraficaBarrasHorizontal(this.columna_selec);
    };
    GraficaBarrasHorizontalesComponent.prototype.crearGraficaBarrasHorizontal = function (columna_selec) {
        var _this = this;
        // Obtener los valores
        console.log(this.dataframe);
        var datos = Array.from(new Set(this.dataframe.map(function (item) { return item[columna_selec]; })));
        // Contar la frecuencia de cada categoría
        var contador = new Map();
        this.dataframe.forEach(function (item) {
            contador.set(item[columna_selec], (contador.get(item[columna_selec]) || 0) + 1);
        });
        // Obtener los datos para la gráfica de queso
        var etiquetas = datos;
        var valores = datos.map(function (x) { return contador.get(x); });
        // Generar una lista de colores aleatorios
        var colores = this.generarColoresAleatorios(datos.length);
        // Configuración del plugin htmlLegendPlugin
        var htmlLegendPlugin = {
            id: "htmlLegend",
            afterUpdate: function (chart, args, options) {
                // Cambio a función de flecha
                _this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
            }
        };
        // Crear la gráfica de barras
        var ctx = document.getElementById("myChart2");
        var chartContainer = document.querySelector(".chart-scroll-container");
        this.myChart = new chart_js_1.Chart(ctx, {
            type: "bar",
            data: {
                labels: etiquetas,
                datasets: [
                    {
                        data: valores,
                        backgroundColor: colores,
                        borderColor: colores,
                        borderWidth: 1
                    },
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    htmlLegend: {
                        containerID: "legend-container"
                    }
                },
                indexAxis: "y",
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            plugins: [htmlLegendPlugin]
        });
    };
    GraficaBarrasHorizontalesComponent.prototype.filtrarEtiquetas = function (etiquetas, valores, contador) {
        var otrosEtiqueta = "Otros";
        var etiquetasAgrupadas = etiquetas.filter(function (etiqueta) { return contador.get(etiqueta) < 20; });
        var totalValoresOtros = 0;
        var valoresFiltrados = valores.filter(function (valor, index) {
            if (etiquetasAgrupadas.includes(etiquetas[index])) {
                totalValoresOtros += valor;
                return false;
            }
            return true;
        });
        etiquetas = etiquetas.filter(function (etiqueta) { return !etiquetasAgrupadas.includes(etiqueta); });
        valores = valoresFiltrados;
        etiquetas.push(otrosEtiqueta);
        valores.push(totalValoresOtros);
        return { etiquetas: etiquetas, valores: valores };
    };
    GraficaBarrasHorizontalesComponent.prototype.generarColoresAleatorios = function (cantidad) {
        var colores = [];
        for (var i = 0; i < cantidad; i++) {
            var color = this.generarColorAleatorio();
            colores.push(color);
        }
        return colores;
    };
    GraficaBarrasHorizontalesComponent.prototype.generarColorAleatorio = function () {
        var letras = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    GraficaBarrasHorizontalesComponent = __decorate([
        core_1.Component({
            selector: "app-grafica-barras-horizontales",
            templateUrl: "./grafica-barras-horizontales.component.html",
            styleUrls: ["./grafica-barras-horizontales.component.scss"]
        })
    ], GraficaBarrasHorizontalesComponent);
    return GraficaBarrasHorizontalesComponent;
}());
exports.GraficaBarrasHorizontalesComponent = GraficaBarrasHorizontalesComponent;
