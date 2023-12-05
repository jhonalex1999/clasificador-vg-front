"use strict";
exports.__esModule = true;
exports.TraductorEtiquetas = void 0;
var TraductorEtiquetas = /** @class */ (function () {
    function TraductorEtiquetas() {
    }
    TraductorEtiquetas.traducirColumnas = function (dataframe) {
        this.traducirPacienteHospitalizado(dataframe);
        this.traducirCondicionFinal(dataframe);
        this.traducirNaturaleza(dataframe);
    };
    TraductorEtiquetas.traducirPacienteHospitalizado = function (dataframe) {
        var _a;
        // Verificar si la columna 'paciente_hospitalizado' existe en el dataframe
        if (!((_a = dataframe[0]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("paciente_hospitalizado"))) {
            console.error('La columna "paciente_hospitalizado" no existe en el dataframe.');
            return;
        }
        /* Se mapean los valores de las columnas para que en lugar de mostrar
        valores numericos muestre etiquetas mas dsecriptivas
        */
        dataframe.forEach(function (item) {
            var valorOriginal = item["paciente_hospitalizado"];
            if (valorOriginal === "1") {
                item["paciente_hospitalizado"] = "Si";
            }
            else if (valorOriginal === "2") {
                item["paciente_hospitalizado"] = "No";
            }
            else {
                console.warn("Valor inesperado en la columna 'paciente_hospitalizado': " + valorOriginal);
            }
        });
    };
    TraductorEtiquetas.traducirCondicionFinal = function (dataframe) {
        var _a;
        // Verificar si la columna 'Condicion_final' existe en el dataframe
        if (!((_a = dataframe[0]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("condicion_final"))) {
            console.error('La columna "condicion_final" no existe en el dataframe.');
            return;
        }
        // Mapear los valores de la columna 'Condicion_final'
        dataframe.forEach(function (item) {
            var valorOriginal = item["condicion_final"];
            switch (valorOriginal) {
                case '0':
                    item["condicion_final"] = "Vivo";
                    break;
                case '1':
                    item["condicion_final"] = "Muerto";
                    break;
                case '2':
                    item["condicion_final"] = "No sabe-no responde";
                    break;
                default:
                    console.warn("Valor inesperado en la columna 'condicion_final': " + valorOriginal);
            }
        });
    };
    TraductorEtiquetas.traducirNaturaleza = function (dataframe) {
        var _a;
        // Verificar si la columna 'naturaleza' existe en el dataframe
        if (!((_a = dataframe[0]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('naturaleza'))) {
            console.error('La columna "naturaleza" no existe en el dataframe.');
            return;
        }
        // Mapear los valores de la columna 'naturaleza'
        dataframe.forEach(function (item) {
            var valorOriginal = item['naturaleza'];
            switch (valorOriginal) {
                case 0:
                    item['naturaleza'] = '1. Violencia física o psicológica';
                    break;
                case 1:
                    item['naturaleza'] = '2. Abuso sexual';
                    break;
                case 2:
                    item['naturaleza'] = '3. Negligencia y abandono';
                    break;
                default:
                    console.warn("Valor inesperado en la columna 'naturaleza': " + valorOriginal);
            }
        });
    };
    return TraductorEtiquetas;
}());
exports.TraductorEtiquetas = TraductorEtiquetas;
