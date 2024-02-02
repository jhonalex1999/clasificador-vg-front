"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraficaDonaComponent = void 0;
var core_1 = require("@angular/core");
var chart_js_1 = require("chart.js");
var traductor_etiquetas_1 = require("app/utils/traductor-etiquetas");
var tooltip_1 = require("@angular/material/tooltip");
var GraficaDonaComponent = /** @class */ (function () {
    function GraficaDonaComponent(service, renderer) {
        var _this = this;
        this.service = service;
        this.renderer = renderer;
        this.columna_selec = 'Selecciona una columna primero';
        this.tooltipContent = 'En esta gráfica de dona, al seleccionar una variable específica, se habilita la visualización detallada de la cantidad de registros asociados a cada valor de la variable. Al desplazar el puntero sobre cada porción, se revela el número exacto de registros correspondientes a esa categoría. Esta funcionalidad permite una exploración más detallada y una comprensión precisa de la distribución de datos, brindando una experiencia interactiva que facilita la identificación de patrones y la toma de decisiones informada basada en los valores numéricos asociados a cada valor de la variable seleccionada.';
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
    GraficaDonaComponent.prototype.ngOnInit = function () {
        var _this = this;
        chart_js_1.Chart.register.apply(chart_js_1.Chart, chart_js_1.registerables);
        this.service.obtenerDF().subscribe(function (result) {
            _this.dataframe = JSON.parse(result.dataframe);
            _this.columnas = Object.keys(_this.dataframe[0]);
            console.log(_this.columnas);
            if (_this.columna_selec != 'Selecciona una columna primero') {
                _this.crearGraficaQueso(_this.columna_selec);
            }
        });
    };
    GraficaDonaComponent.prototype.beforeunloadHandler = function (event) {
        // Borrar la clave del localStorage al cerrar la pestaña
        localStorage.removeItem('primerCarga');
    };
    GraficaDonaComponent.prototype.actualizarGraficaQueso = function () {
        console.log("se llama actualizar");
        if (this.myChart) {
            this.myChart.destroy(); // Destruye la gráfica anterior si existe
        }
        this.crearGraficaQueso(this.columna_selec);
    };
    GraficaDonaComponent.prototype.crearGraficaQueso = function (columna_selec) {
        var _this = this;
        // Obtener los valores
        console.log(this.dataframe);
        traductor_etiquetas_1.TraductorEtiquetas.traducirColumnas(this.dataframe);
        var datos = Array.from(new Set(this.dataframe.map(function (item) { return item[columna_selec]; })));
        // Contar la frecuencia de cada categoría
        var contador = new Map();
        this.dataframe.forEach(function (item) {
            contador.set(item[columna_selec], (contador.get(item[columna_selec]) || 0) + 1);
        });
        // Obtener los datos para la gráfica de queso
        var etiquetas = datos;
        var valores = datos.map(function (x) { return contador.get(x); });
        if (columna_selec === "nom_upgd") {
            var _a = this.filtrarEtiquetas(etiquetas, valores, contador), nuevasEtiquetas = _a.etiquetas, nuevosValores = _a.valores;
            etiquetas = nuevasEtiquetas;
            valores = nuevosValores;
        }
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
        // Crear la gráfica de queso
        var ctx = document.getElementById("myChart2");
        var chartContainer = document.querySelector(".chart-scroll-container");
        this.myChart = new chart_js_1.Chart(ctx, {
            type: "doughnut",
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
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    htmlLegend: {
                        containerID: "legend-container"
                    }
                }
            },
            plugins: [htmlLegendPlugin]
        });
    };
    GraficaDonaComponent.prototype.filtrarEtiquetas = function (etiquetas, valores, contador) {
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
    GraficaDonaComponent.prototype.generarColoresAleatorios = function (cantidad) {
        var colores = [];
        for (var i = 0; i < cantidad; i++) {
            var color = this.generarColorAleatorio();
            colores.push(color);
        }
        return colores;
    };
    GraficaDonaComponent.prototype.generarColorAleatorio = function () {
        var letras = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    GraficaDonaComponent.prototype.showTooltip = function () {
        if (!this.tooltip.disabled) {
            this.tooltip.show();
        }
    };
    GraficaDonaComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.listen(this.tooltipIcon.nativeElement, 'click', function () {
            _this.showTooltip();
        });
    };
    __decorate([
        core_1.ViewChild(tooltip_1.MatTooltip)
    ], GraficaDonaComponent.prototype, "tooltip");
    __decorate([
        core_1.ViewChild('tooltipIcon')
    ], GraficaDonaComponent.prototype, "tooltipIcon");
    __decorate([
        core_1.HostListener('window:beforeunload', ['$event']),
        core_1.HostListener('window:pagehide', ['$event'])
    ], GraficaDonaComponent.prototype, "beforeunloadHandler");
    GraficaDonaComponent = __decorate([
        core_1.Component({
            selector: "app-grafica-dona",
            templateUrl: "./grafica-dona.component.html",
            styleUrls: ["./grafica-dona.component.scss"]
        })
    ], GraficaDonaComponent);
    return GraficaDonaComponent;
}());
exports.GraficaDonaComponent = GraficaDonaComponent;
