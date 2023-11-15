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
    }
    ModeloInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.metric = [{ modelo: 'GaussianNB', exactitud: 0.648, precision: 0.676, sensibilidad: 0.664, puntuacion_F1: 0.611 },
            { modelo: 'SVM', exactitud: 0.81, precision: 0.802, sensibilidad: 0.777, puntuacion_F1: 0.786 },
            { modelo: 'KNN', exactitud: 0.775, precision: 0.754, sensibilidad: 0.742, puntuacion_F1: 0.747 },
            { modelo: 'Neural Networks', exactitud: 0.811, precision: 0.801, sensibilidad: 0.796, puntuacion_F1: 0.798 },
            { modelo: 'Decision Trees', exactitud: 0.782, precision: 0.769, sensibilidad: 0.768, puntuacion_F1: 0.768 },
            { modelo: 'AdaBoost', exactitud: 0.823, precision: 0.815, sensibilidad: 0.809, puntuacion_F1: 0.812 },
            { modelo: 'Regresión Logística', exactitud: 0.833, precision: 0.825, sensibilidad: 0.82, puntuacion_F1: 0.822 },
            { modelo: 'Gradient Boosting', exactitud: 0.835, precision: 0.815, sensibilidad: 0.815, puntuacion_F1: 0.82 },
            { modelo: 'Extra Trees', exactitud: 0.847, precision: 0.839, sensibilidad: 0.834, puntuacion_F1: 0.836 },
            { modelo: 'Random Forest', exactitud: 0.849, precision: 0.842, sensibilidad: 0.837, puntuacion_F1: 0.839 },
            { modelo: 'LightGBM', exactitud: 0.854, precision: 0.846, sensibilidad: 0.846, puntuacion_F1: 0.846 },
            { modelo: 'XGBoost', exactitud: 0.851, precision: 0.843, sensibilidad: 0.842, puntuacion_F1: 0.842 },
            { modelo: 'XGBoost Optimizado', exactitud: 0.856, precision: 0.848, sensibilidad: 0.848, puntuacion_F1: 0.847 }];
        this.service.obtenerDF().subscribe(function (result) {
            _this.dataframe = JSON.parse(result.dataframe);
            _this.dataRows = Object.values(_this.dataframe).slice(0, 5);
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
    };
    ModeloInfoComponent.prototype.createChart = function () {
        var ctx = this.metricCanvas.nativeElement.getContext('2d');
        this.chart = new chart_js_1.Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.modelos,
                datasets: [
                    {
                        label: 'Exactitud',
                        data: this.exactitudes,
                        backgroundColor: 'rgba(0,0,205,1)',
                        borderColor: 'rgba(0,0,205,1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Precisión',
                        data: this.precisiones,
                        backgroundColor: 'rgba(156, 39, 176, 1)',
                        borderColor: 'rgba(156, 39, 176, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Sensibilidad',
                        data: this.sensibilidades,
                        backgroundColor: 'rgba(34,139,34, 1)',
                        borderColor: 'rgba(34,139,34, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Puntuación F1',
                        data: this.puntuacionesF1,
                        backgroundColor: 'rgba(255,140,0, 1)',
                        borderColor: 'rgba(255,140,0, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };
    __decorate([
        core_1.ViewChild('metrics', { static: true })
    ], ModeloInfoComponent.prototype, "metricCanvas");
    ModeloInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-modelo-info',
            templateUrl: './modelo-info.component.html',
            styleUrls: ['./modelo-info.component.scss']
        })
    ], ModeloInfoComponent);
    return ModeloInfoComponent;
}());
exports.ModeloInfoComponent = ModeloInfoComponent;
