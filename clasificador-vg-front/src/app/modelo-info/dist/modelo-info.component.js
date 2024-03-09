"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModeloInfoComponent = void 0;
var core_1 = require("@angular/core");
var chart_js_1 = require("chart.js");
var ModeloInfoComponent = /** @class */ (function () {
    function ModeloInfoComponent(service) {
        this.service = service;
        this.dataframe = [];
        this.dataRows = [];
        this.metric = [];
        this.modelos = [];
        this.exactitudes = [];
        this.precisiones = [];
        this.sensibilidades = [];
        this.puntuacionesF1 = [];
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.primerCarga = false;
        this.imagenes = [];
        this.cantidadImagenes = 14;
    }
    ModeloInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        for (var i = 1; i <= this.cantidadImagenes; i++) {
            this.imagenes.push("../../assets/img/ppt/" + i + ".png");
        }
        this.metric = [
            {
                modelo: "GaussianNB",
                exactitud: 0.658,
                precision: 0.686,
                sensibilidad: 0.682,
                puntuacion_F1: 0.624
            },
            {
                modelo: "SVM",
                exactitud: 0.816,
                precision: 0.805,
                sensibilidad: 0.789,
                puntuacion_F1: 0.796
            },
            {
                modelo: "KNN",
                exactitud: 0.793,
                precision: 0.774,
                sensibilidad: 0.766,
                puntuacion_F1: 0.769
            },
            {
                modelo: "Neural Networks",
                exactitud: 0.81,
                precision: 0.8,
                sensibilidad: 0.799,
                puntuacion_F1: 0.799
            },
            {
                modelo: "Decision Trees",
                exactitud: 0.783,
                precision: 0.771,
                sensibilidad: 0.769,
                puntuacion_F1: 0.77
            },
            {
                modelo: "AdaBoost",
                exactitud: 0.825,
                precision: 0.817,
                sensibilidad: 0.812,
                puntuacion_F1: 0.814
            },
            {
                modelo: "Regresión Logística",
                exactitud: 0.835,
                precision: 0.827,
                sensibilidad: 0.822,
                puntuacion_F1: 0.825
            },
            {
                modelo: "Gradient Boosting",
                exactitud: 0.836,
                precision: 0.827,
                sensibilidad: 0.819,
                puntuacion_F1: 0.822
            },
            {
                modelo: "Extra Trees",
                exactitud: 0.847,
                precision: 0.837,
                sensibilidad: 0.836,
                puntuacion_F1: 0.836
            },
            {
                modelo: "Random Forest",
                exactitud: 0.85,
                precision: 0.84,
                sensibilidad: 0.84,
                puntuacion_F1: 0.839
            },
            {
                modelo: "LightGBM",
                exactitud: 0.85,
                precision: 0.841,
                sensibilidad: 0.84,
                puntuacion_F1: 0.84
            },
            {
                modelo: "XGBoost",
                exactitud: 0.85,
                precision: 0.842,
                sensibilidad: 0.84,
                puntuacion_F1: 0.841
            },
            {
                modelo: "XGBoost Optimizado",
                exactitud: 0.855,
                precision: 0.845,
                sensibilidad: 0.846,
                puntuacion_F1: 0.845
            },
        ];
        this.service.obtenerDF().subscribe(function (result) {
            _this.dataframe = JSON.parse(result.dataframe);
            _this.dataRows = Object.values(_this.dataframe);
            console.log(_this.dataRows);
            _this.dataRows.forEach(function (row) {
                row.anio = row.año;
            });
        });
        this.metric.forEach(function (item) {
            _this.modelos.push(item.modelo);
            _this.exactitudes.push(item.exactitud);
            _this.precisiones.push(item.precision);
            _this.sensibilidades.push(item.sensibilidad);
            _this.puntuacionesF1.push(item.puntuacion_F1);
        });
        // Crear la gráfica
        this.createChart();
        if (!localStorage.getItem("primerCarga")) {
            this.mostrarOverlay = true;
            localStorage.setItem("primerCarga", "true");
        }
    };
    ModeloInfoComponent.prototype.beforeunloadHandler = function (event) {
        // Borrar la clave del localStorage al cerrar la pestaña
        localStorage.removeItem("primerCarga");
        if (localStorage.getItem("formData")) {
            // Si existe, eliminar la clave del localStorage
            localStorage.removeItem("formData");
        }
    };
    ModeloInfoComponent.prototype.createChart = function () {
        var ctx = this.metricCanvas.nativeElement.getContext("2d");
        this.chart = new chart_js_1.Chart(ctx, {
            type: "bar",
            data: {
                labels: this.modelos,
                datasets: [
                    {
                        label: "Exactitud",
                        data: this.exactitudes,
                        backgroundColor: "rgba(0,0,205,1)",
                        borderColor: "rgba(0,0,205,1)",
                        borderWidth: 1
                    },
                    {
                        label: "Precisión",
                        data: this.precisiones,
                        backgroundColor: "rgba(156, 39, 176, 1)",
                        borderColor: "rgba(156, 39, 176, 1)",
                        borderWidth: 1
                    },
                    {
                        label: "Sensibilidad",
                        data: this.sensibilidades,
                        backgroundColor: "rgba(34,139,34, 1)",
                        borderColor: "rgba(34,139,34, 1)",
                        borderWidth: 1
                    },
                    {
                        label: "Puntuación F1",
                        data: this.puntuacionesF1,
                        backgroundColor: "rgba(255,140,0, 1)",
                        borderColor: "rgba(255,140,0, 1)",
                        borderWidth: 1
                    },
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }
        });
    };
    // Función para obtener los elementos de la página actual
    ModeloInfoComponent.prototype.getCurrentPageRows = function () {
        var startIndex = (this.currentPage - 1) * this.itemsPerPage;
        var endIndex = startIndex + this.itemsPerPage;
        return this.dataRows.slice(startIndex, endIndex);
    };
    // Función para cambiar a la siguiente página
    ModeloInfoComponent.prototype.nextPage = function () {
        if (this.currentPage * this.itemsPerPage < this.dataRows.length) {
            this.currentPage++;
        }
    };
    // Función para cambiar a la página anterior
    ModeloInfoComponent.prototype.prevPage = function () {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    };
    ModeloInfoComponent.prototype.desplegarOverlay = function () {
        this.mostrarOverlay = true;
    };
    ModeloInfoComponent.prototype.ocultarOverlay = function () {
        this.mostrarOverlay = false;
    };
    __decorate([
        core_1.ViewChild("metrics", { static: true })
    ], ModeloInfoComponent.prototype, "metricCanvas");
    __decorate([
        core_1.HostListener("window:beforeunload", ["$event"]),
        core_1.HostListener("window:pagehide", ["$event"])
    ], ModeloInfoComponent.prototype, "beforeunloadHandler");
    ModeloInfoComponent = __decorate([
        core_1.Component({
            selector: "app-modelo-info",
            templateUrl: "./modelo-info.component.html",
            styleUrls: ["./modelo-info.component.scss", "./background-animado.css"]
        })
    ], ModeloInfoComponent);
    return ModeloInfoComponent;
}());
exports.ModeloInfoComponent = ModeloInfoComponent;
