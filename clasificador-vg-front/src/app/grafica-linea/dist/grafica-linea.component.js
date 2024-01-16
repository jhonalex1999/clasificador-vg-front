"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraficaLineaComponent = void 0;
var core_1 = require("@angular/core");
var chart_js_1 = require("chart.js");
var traductor_etiquetas_1 = require("app/utils/traductor-etiquetas");
var tooltip_1 = require("@angular/material/tooltip");
var GraficaLineaComponent = /** @class */ (function () {
    function GraficaLineaComponent(service, renderer) {
        var _this = this;
        this.service = service;
        this.renderer = renderer;
        this.columna1_selec = "Selecciona una columna primero";
        this.columna2_selec = "Selecciona una columna primero";
        this.tooltipContent = "En este gráfico de líneas interactivo, se proporciona la flexibilidad de seleccionar dos variables específicas para explorar su relación entre sí. Al elegir las variables de interés, las líneas se ajustan dinámicamente, permitiendo visualizar cómo cambian en función de las variables seleccionadas. Esto facilita la identificación de tendencias, patrones o correlaciones entre las dos variables. Al pasar el cursor sobre puntos específicos en las líneas, se despliega información detallada, incluyendo los valores exactos de ambas variables en ese punto. Esta funcionalidad es esencial para comprender la relación y la interacción entre las dos variables seleccionadas.";
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
            // Limpiar los elementos de la leyenda anteriores
            while (ul.firstChild) {
                ul.firstChild.remove();
            }
            var items = chart.options.plugins.legend.labels.generateLabels(chart);
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
    GraficaLineaComponent.prototype.ngOnInit = function () {
        var _this = this;
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.service.obtenerDF().subscribe(function (result) {
            var valoresPermitidos = [
                "semana",
                "año",
                "pac_hospitalizado",
                "condicion final",
                "naturaleza",
                "actividad",
                "edad_agre",
                "sustancias vict",
                "escenario",
                "sivigila",
                "trimestre",
            ];
            _this.dataframe = JSON.parse(result.dataframe);
            _this.columnas = Object.keys(_this.dataframe[0]);
            _this.columnasIndep = Object.keys(_this.dataframe[0]);
            if (_this.columna1_selec !== "Selecciona una columna primero" ||
                _this.columna2_selec !== "Selecciona una columna primero") {
                _this.crearGraficoLinea(_this.columna1_selec, _this.columna2_selec);
            }
        });
    };
    GraficaLineaComponent.prototype.actualizarGraficoLinear = function () {
        console.log("se llama actualizar");
        if (this.linearChart) {
            this.linearChart.destroy(); // Destruye la gráfica anterior si existe
        }
        if (this.columna1_selec !== "Selecciona una columna primero" &&
            this.columna2_selec !== "Selecciona una columna primero") {
            this.crearGraficoLinea(this.columna1_selec, this.columna2_selec);
        }
    };
    GraficaLineaComponent.prototype.generarColorAleatorio = function () {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    GraficaLineaComponent.prototype.crearGraficoLinea = function (columna1_selec, columna2_selec) {
        var _this = this;
        traductor_etiquetas_1.TraductorEtiquetas.traducirColumnas(this.dataframe);
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
        // Create the scatter plot
        var ctx = document.getElementById("linearChart");
        // Cambiar el tipo de gráfico a 'line'
        this.linearChart = new chart_js_1.Chart(ctx, {
            type: "line",
            data: {
                labels: etiquetas,
                datasets: eje2.map(function (sexo, index) {
                    var color = _this.getRandomColorWithOpacity(0.5); // Color aleatorio con opacidad 0.2
                    return {
                        label: sexo,
                        data: valores[index],
                        backgroundColor: color,
                        borderColor: color,
                        borderWidth: 1,
                        fill: true,
                        tension: 0.4,
                        spanGaps: true
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
                    x: {
                        title: {
                            display: true,
                            text: columna1_selec
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: columna2_selec
                        }
                    }
                }
            },
            plugins: [htmlLegendPlugin1, htmlLegendPlugin2]
        });
    };
    GraficaLineaComponent.prototype.getRandomColorWithOpacity = function (opacity) {
        var getRandomHex = function () { return Math.floor(Math.random() * 256).toString(16); };
        var color;
        do {
            color = "#" + getRandomHex() + getRandomHex() + getRandomHex();
        } while (
        // Excluir colores oscuros (tonos de marrón, morado oscuro y negro)
        parseInt(color.substr(1), 16) < parseInt("444444", 16));
        return "" + color + Math.round(opacity * 255).toString(16);
    };
    GraficaLineaComponent.prototype.showTooltip = function () {
        if (!this.tooltip.disabled) {
            this.tooltip.show();
        }
    };
    GraficaLineaComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.listen(this.tooltipIcon.nativeElement, "click", function () {
            _this.showTooltip();
        });
    };
    __decorate([
        core_1.ViewChild(tooltip_1.MatTooltip)
    ], GraficaLineaComponent.prototype, "tooltip");
    __decorate([
        core_1.ViewChild("tooltipIcon")
    ], GraficaLineaComponent.prototype, "tooltipIcon");
    GraficaLineaComponent = __decorate([
        core_1.Component({
            selector: "app-grafica-dispersion",
            templateUrl: "./grafica-linea.component.html",
            styleUrls: ["./grafica-linea.component.scss"]
        })
    ], GraficaLineaComponent);
    return GraficaLineaComponent;
}());
exports.GraficaLineaComponent = GraficaLineaComponent;
