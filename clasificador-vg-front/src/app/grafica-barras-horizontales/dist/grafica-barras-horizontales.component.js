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
var tooltip_1 = require("@angular/material/tooltip");
var GraficaBarrasHorizontalesComponent = /** @class */ (function () {
    function GraficaBarrasHorizontalesComponent(service, renderer) {
        var _this = this;
        this.service = service;
        this.renderer = renderer;
        this.columna_selec = "Selecciona una columna primero";
        this.tooltipContent = "En este gráfico de barras horizontales interactivo, se ofrece la capacidad de seleccionar una variable específica. Al elegir la variable de interés, la visualización se adapta dinámicamente, mostrando la distribución de las categorías asociadas a esa variable en el eje horizontal. Al desplazar el cursor sobre cada barra, se despliega información detallada, incluyendo los valores numéricos correspondientes a cada categoría. Esta funcionalidad proporciona una herramienta efectiva para explorar y comparar la distribución de una variable particular, facilitando la identificación de patrones y tendencias dentro de los datos.";
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
            var items = chart.options.plugins.legend.labels.generateLabels(chart);
            // Ordenar las etiquetas alfabéticamente o numéricamente
            items.sort(function (a, b) {
                if (typeof a.text === "string" && typeof b.text === "string") {
                    return a.text.localeCompare(b.text); // Orden alfabético
                }
                else if (typeof a.text === "number" && typeof b.text === "number") {
                    return a.text - b.text; // Orden numérico ascendente
                }
                return 0; // No se cambia el orden si los tipos son diferentes
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
                // Color box
                var boxSpan = document.createElement("span");
                boxSpan.style.background = item.fillStyle;
                boxSpan.style.borderColor = item.strokeStyle;
                boxSpan.style.borderWidth = item.lineWidth + "px";
                boxSpan.style.display = "inline-block";
                boxSpan.style.flexShrink = "0";
                boxSpan.style.height = "20px";
                boxSpan.style.marginRight = "10px";
                boxSpan.style.width = "20px";
                // Texto
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
    }
    GraficaBarrasHorizontalesComponent.prototype.ngOnInit = function () {
        var _this = this;
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.service.obtenerDF().subscribe(function (result) {
            _this.dataframe = JSON.parse(result.dataframe);
            _this.columnas = Object.keys(_this.dataframe[0]);
            if (_this.columna_selec != "Selecciona una columna primero") {
                _this.crearGraficaBarrasHorizontal(_this.columna_selec);
            }
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
        var data = this.dataframe;
        console.log(this.dataframe);
        console.log(columna_selec);
        // Obtener los valores únicos de la columna seleccionada
        var eje1 = Array.from(new Set(data.map(function (item) { return item[columna_selec]; })));
        // Contar el número de registros por valor de la columna seleccionada
        var contador = new Map();
        data.forEach(function (item) {
            var clave = item[columna_selec];
            contador.set(clave, (contador.get(clave) || 0) + 1);
        });
        // Preparar los datos para el gráfico de líneas horizontales
        var datos = eje1.map(function (valor) { return ({
            valor: valor,
            count: contador.get(valor) || 0
        }); });
        // Ordenar los datos por valor ascendente
        datos.sort(function (a, b) { return a.valor - b.valor; });
        // Obtener los valores y etiquetas
        var etiquetas = datos.map(function (item) { return item.valor; });
        var valores = datos.map(function (item) { return item.count; });
        var htmlLegendPlugin = {
            id: "htmlLegend",
            afterUpdate: function (chart, args, options) {
                // Cambio a función de flecha
                _this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
            }
        };
        // Crear el gráfico de líneas horizontales
        var ctx = document.getElementById("myChart");
        this.myChart = new chart_js_1.Chart(ctx, {
            type: "bar",
            data: {
                labels: etiquetas,
                datasets: eje1.map(function (valor, index) {
                    var dataPorValor = datos.find(function (item) { return item.valor === valor; });
                    var data = etiquetas.map(function (etiqueta) { return (etiqueta === valor ? (dataPorValor === null || dataPorValor === void 0 ? void 0 : dataPorValor.count) || 0 : 0); });
                    return {
                        label: valor,
                        data: data,
                        backgroundColor: _this.getRandomColorWithOpacity(0.5),
                        hidden: false
                    };
                })
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                        onClick: function (event, legendItem) {
                            var dataset = this.chart.data.datasets[legendItem.datasetIndex];
                            dataset.hidden = !dataset.hidden;
                            this.chart.update();
                        }
                    },
                    // @ts-ignore
                    htmlLegend: {
                        containerID: "legend-container"
                    }
                },
                indexAxis: "y",
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true
                    },
                    x: {
                        stacked: true
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
    GraficaBarrasHorizontalesComponent.prototype.getRandomColorWithOpacity = function (opacity) {
        var getRandomHex = function () { return Math.floor(Math.random() * 256).toString(16); };
        var color;
        do {
            color = "#" + getRandomHex() + getRandomHex() + getRandomHex();
        } while (
        // Excluir colores oscuros (tonos de marrón, morado oscuro y negro)
        parseInt(color.substr(1), 16) < parseInt("444444", 16));
        return "" + color + Math.round(opacity * 255).toString(16);
    };
    GraficaBarrasHorizontalesComponent.prototype.showTooltip = function () {
        if (!this.tooltip.disabled) {
            this.tooltip.show();
        }
    };
    GraficaBarrasHorizontalesComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.listen(this.tooltipIcon.nativeElement, "click", function () {
            _this.showTooltip();
        });
    };
    __decorate([
        core_1.ViewChild(tooltip_1.MatTooltip)
    ], GraficaBarrasHorizontalesComponent.prototype, "tooltip");
    __decorate([
        core_1.ViewChild("tooltipIcon")
    ], GraficaBarrasHorizontalesComponent.prototype, "tooltipIcon");
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
