"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
        this.columna1_selec = 'Selecciona una columna primero';
        this.columna2_selec = 'Selecciona una columna primero';
        this.tooltipContent = 'En este gráfico de barras verticales interactivo, se presenta la opción de seleccionar dos variables. Al elegir las variables de interés, la visualización se ajusta dinámicamente, proporcionando un análisis comparativo entre las dos categorías seleccionadas. Al pasar el cursor sobre cada barra, se muestra la información detallada, incluyendo los valores numéricos asociados a cada categoría. Esta funcionalidad brinda una herramienta efectiva para explorar las relaciones y tendencias entre las dos variables seleccionadas, permitiendo una comprensión más profunda de la distribución y la interacción entre los datos.';
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
            // Generar elementos de leyenda personalizados
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
        this.createCustomLegendItems2 = function (chart, options) {
            var ul = _this.getOrCreateLegendList(chart, options.containerID);
            // Limpiar los elementos de la leyenda anteriores
            while (ul.firstChild) {
                ul.firstChild.remove();
            }
            // Generar elementos de leyenda personalizados para el eje x
            var labels = chart.data.labels;
            labels.forEach(function (label) {
                var li = document.createElement("li");
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.display = "flex";
                li.style.flexDirection = "row";
                li.style.marginLeft = "10px";
                li.onclick = function () {
                    // Realizar acciones al hacer clic en una etiqueta del eje x
                    console.log("Clic en la etiqueta del eje x: " + label);
                };
                // Puedes personalizar el contenido del elemento li según tus necesidades
                var textContainer = document.createElement("p");
                textContainer.style.margin = "0";
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
            if (_this.columna1_selec !== 'Selecciona una columna primero' || _this.columna2_selec !== 'Selecciona una columna primero') {
                _this.crearGraficoBarras(_this.columna1_selec, _this.columna2_selec);
            }
        });
    };
    GraficaBarrasComponent.prototype.actualizarGrafica = function () {
        console.log("se llama actualizar");
        if (this.myChart) {
            this.myChart.destroy(); // Destruye la gráfica anterior si existe
        }
        if (this.columna1_selec !== 'Selecciona una columna primero' && this.columna2_selec !== 'Selecciona una columna primero') {
            this.crearGraficoBarras(this.columna1_selec, this.columna2_selec);
        }
    };
    GraficaBarrasComponent.prototype.crearGraficoBarras = function (columna1_selec, columna2_selec) {
        var _this = this;
        var data = this.dataframe;
        console.log(this.dataframe);
        console.log(columna1_selec);
        console.log(columna2_selec);
        // Obtener los valores únicos de grupo edad edad y sexo
        var eje1 = Array.from(new Set(data.map(function (item) { return item[columna1_selec]; })));
        var eje2 = Array.from(new Set(data.map(function (item) { return item[columna2_selec]; })));
        // Contar el número de registros por combinación de edad y sexo
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
        // Ordenar los datos por edad ascendente
        datos.sort(function (a, b) { return a.columna1_selec - b.columna2_selec; });
        // Obtener los valores de edad y sexos
        var etiquetas = datos.map(function (item) { return item.columna1_selec; });
        var valores = eje2.map(function (columna2_selec) {
            return datos.map(function (item) { return item[columna2_selec]; });
        });
        var htmlLegendPlugin1 = {
            id: "htmlLegend1",
            afterUpdate: function (chart, args, options) {
                // Cambio a función de flecha
                _this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
            }
        };
        var htmlLegendPlugin2 = {
            id: "htmlLegend2",
            afterUpdate: function (chart, args, options) {
                _this.createCustomLegendItems2(chart, options);
            }
        };
        var color = this.getRandomColorWithOpacity(0.2); // Color aleatorio con opacidad 0.2
        // Crear el gráfico de barras
        var ctx = document.getElementById("myChart");
        this.myChart = new chart_js_1.Chart(ctx, {
            type: "bar",
            data: {
                labels: etiquetas,
                datasets: eje2.map(function (sexo, index) {
                    var color = _this.getRandomColorWithOpacity(0.5);
                    return {
                        label: sexo,
                        data: valores[index],
                        backgroundColor: color
                    };
                })
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
        } while (
        // Excluir colores oscuros (tonos de marrón, morado oscuro y negro)
        parseInt(color.substr(1), 16) < parseInt("444444", 16));
        return "" + color + Math.round(opacity * 255).toString(16);
    };
    GraficaBarrasComponent.prototype.showTooltip = function () {
        if (!this.tooltip.disabled) {
            this.tooltip.show();
        }
    };
    GraficaBarrasComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.listen(this.tooltipIcon.nativeElement, 'click', function () {
            _this.showTooltip();
        });
    };
    __decorate([
        core_1.ViewChild(tooltip_1.MatTooltip)
    ], GraficaBarrasComponent.prototype, "tooltip");
    __decorate([
        core_1.ViewChild('tooltipIcon')
    ], GraficaBarrasComponent.prototype, "tooltipIcon");
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
