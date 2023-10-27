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
var GraficaBarrasComponent = /** @class */ (function () {
    function GraficaBarrasComponent(service) {
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
    }
    GraficaBarrasComponent.prototype.ngOnInit = function () {
        var _this = this;
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.service.obtenerDF().subscribe(function (result) {
            _this.dataframe = JSON.parse(result.dataframe);
            _this.columnas = Object.keys(_this.dataframe[0]);
            _this.crearGraficoBarras(_this.columna1_selec, _this.columna2_selec);
        });
    };
    GraficaBarrasComponent.prototype.actualizarGrafica = function () {
        console.log("se llama actualizar");
        if (this.myChart) {
            this.myChart.destroy(); // Destruye la gráfica anterior si existe
        }
        this.crearGraficoBarras(this.columna1_selec, this.columna2_selec);
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
        // Generar una lista de colores aleatorios
        var colores = this.generarColoresAleatorios(valores.length);
        var htmlLegendPlugin = {
            id: "htmlLegend",
            afterUpdate: function (chart, args, options) {
                // Cambio a función de flecha
                _this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
            }
        };
        var colors = ["rgba(0, 0, 255, 0.2)", "rgba(0, 128, 0, 0.2)"];
        // Crear el gráfico de barras
        var delayed;
        var ctx = document.getElementById("myChart");
        this.myChart = new chart_js_1.Chart(ctx, {
            type: "bar",
            data: {
                labels: etiquetas,
                datasets: eje2.map(function (sexo, index) { return ({
                    label: sexo,
                    data: valores[index],
                    backgroundColor: [colors[index % colors.length]],
                    borderColor: [colors[index % colors.length]],
                    borderWidth: 1
                }); })
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    // @ts-ignore
                    htmlLegend: {
                        containerID: "legend-container"
                    }
                },
                animation: {
                    onComplete: function () {
                        delayed = true;
                    },
                    delay: function (context) {
                        var delay = 0;
                        if (context.type === "data" &&
                            context.mode === "default" &&
                            !delayed) {
                            delay = context.dataIndex * 300 + context.datasetIndex * 100;
                        }
                        return delay;
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
            plugins: [htmlLegendPlugin]
        });
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
