"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PredictorComponent = void 0;
var core_1 = require("@angular/core");
var registro_dto_1 = require("app/dto/registro-dto");
var forms_1 = require("@angular/forms");
var chart_js_1 = require("chart.js");
require("chart.js/auto");
var date_fns_1 = require("date-fns");
var operators_1 = require("rxjs/operators");
var tooltip_1 = require("@angular/material/tooltip");
var PredictorComponent = /** @class */ (function () {
    function PredictorComponent(service, formBuilder, renderer) {
        this.service = service;
        this.formBuilder = formBuilder;
        this.renderer = renderer;
        this.banderaVisibilidad = false;
        this.mostrarOverlay = false;
        this.banderaCard = true;
        this.departamentos = ["SANTANDER", "Otros"];
        this.municipios = ["BUCARAMANGA", "Otros"];
        this.anios = [
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
        ];
        this.gruposEdad = [
            "0 a 6",
            "7  a 11",
            "12 a 17",
            "18 a 28",
            "29 a 59",
            "60 y mas",
        ];
        this.sexos = ["Femenino", "Masculino"];
        this.areas = ["CABECERA MUNICIPAL", "RURAL DISPERSO", "CENTRO POBLADO"];
        this.comunas = [
            "01. NORTE",
            "02. NORORIENTAL",
            "03. SAN FRANCISCO",
            "04. OCCIDENTAL",
            "05. GARCIA ROVIRA",
            "10. PROVENZA",
            "11. SUR",
            "13. ORIENTAL",
            "14. MORRORICO",
            "Otros",
        ];
        this.tiposDeSeguridadSocial = [
            "Subsidiado",
            "Contributivo",
            "Excepción",
            "Excepción",
            "Indeterminado",
            "No Asegurado",
            "No Afiliado",
        ];
        this.tiposDePacienteHospitalizado = [
            { valor: "1", texto: "Sí" },
            { valor: "2", texto: "No" },
        ];
        this.condicionesFinales = [
            { valor: "0", texto: "Vivo" },
            { valor: "1", texto: "Muerto" },
            { valor: "2", texto: "No sabe-no responde" },
        ];
        this.actividades = [
            { valor: "8", texto: "Reciclador" },
            { valor: "13", texto: "Líder cívico" },
            { valor: "15", texto: "Maestro" },
            { valor: "16", texto: "Servidor publico" },
            { valor: "17", texto: "Fuerza publica" },
            { valor: "24", texto: "Estudiante" },
            { valor: "26", texto: "Otro" },
            { valor: "28", texto: "Trabajadora domestica" },
            { valor: "29", texto: "Persona en situación de prostitución" },
            { valor: "33", texto: "Ninguna" },
            { valor: "31", texto: "Persona dedicada al cuidado del hogar" },
        ];
        this.sexosAgre = ["M", "F"];
        this.parentezcosVict = [
            "Madre",
            "Pareja",
            "Familiar",
            "Padre",
            "Ex pareja",
            "Esposo",
            "Compañero permanente",
            "Novio(a)",
            "Abuelo (a)",
            "Hermano (a)",
            "Otros",
        ];
        this.sustanciasVictima = [
            { valor: "1", texto: "Sí" },
            { valor: "2", texto: "No" },
        ];
        this.escenarios = [
            { valor: "1", texto: "Vía pública" },
            { valor: "2", texto: "Vivienda" },
            { valor: "3", texto: "Establecimiento educativo" },
            { valor: "4", texto: "Lugar de trabajo" },
            { valor: "7", texto: "Otro" },
            { valor: "8", texto: "Comercio y áreas de servicios" },
            { valor: "9", texto: "Otros espacios abiertos" },
            { valor: "10", texto: "Lugares de esparcimiento con expendido de alcohol" },
            { valor: "11", texto: "Institución de salud" },
            { valor: "12", texto: "Área deportiva y recreativa" },
        ];
        this.noms_eve = [
            "VIGILANCIA EN SALUD PÚBLICA DE LA VIOLENCIA DE GÉNERO E INTRAFAMILIAR",
            "VIGILANCIA EN SALUD PÚBLICA DE LAS VIOLENCIAS DE GÉNERO",
        ];
        this.noms_upgd = [
            "HOSPITAL LOCAL DEL NORTE",
            "HOSPITAL UNIVERSITARIO DE SANTANDER",
            "CLINICA CHICAMOCHA SA",
            "CLINICA MATERNO INFANTIL SAN LUIS SA",
            "UIMIST",
            "FUNDACION OFTALMOLOGICA DE SDER FOSCAL",
            "LOS COMUNEROS HOSPITAL UNIVERSITARIO DE BUCARAMANG",
            "SERVICLINICOS DROMEDICA SA",
            "SEDE GONZALEZ VALENCIA",
            "UNIVERSIDAD INDUSTRIAL DE SANTANDER- UIS",
            "Otros",
        ];
        this.tooltipContent = 'En esta grafica se puede observar la importancia de las caracteristicas al momento de realizar la prediccion. Algunas caracteristicas se calculan a partir de otras variables del formulario, como por ejemplo trismestre o mes que se generan a partir de la semana';
        this.parentezcosVictBackup = __spreadArrays(this.parentezcosVict);
    }
    PredictorComponent.prototype.ngOnInit = function () {
        this.registroDTO = new registro_dto_1.RegistroDto();
        this.initFormulario();
    };
    PredictorComponent.prototype.beforeunloadHandler = function (event) {
        // Borrar la clave del localStorage al cerrar la pestaña
        localStorage.removeItem('primerCarga');
    };
    PredictorComponent.prototype.initFormulario = function () {
        var _this = this;
        this.formulario = this.formBuilder.group({
            departamento: ["", forms_1.Validators.required],
            municipio: ["", forms_1.Validators.required],
            semana: ["", forms_1.Validators.required],
            año: ["", forms_1.Validators.required],
            grupo_edad: ["", forms_1.Validators.required],
            sexo: ["", forms_1.Validators.required],
            area: ["", forms_1.Validators.required],
            comuna: ["", forms_1.Validators.required],
            tipo_de_seguridad_social: ["", forms_1.Validators.required],
            paciente_hospitalizado: ["", forms_1.Validators.required],
            condicion_final: ["", forms_1.Validators.required],
            actividad: ["", forms_1.Validators.required],
            edad_agre: ["", forms_1.Validators.required],
            sexo_agre: ["", forms_1.Validators.required],
            parentezco_vict: ["", forms_1.Validators.required],
            sustancias_victima: ["", forms_1.Validators.required],
            escenario: ["", forms_1.Validators.required],
            nom_eve: ["", forms_1.Validators.required],
            nom_upgd: ["", forms_1.Validators.required]
        });
        this.formulario
            .get("departamento")
            .valueChanges.subscribe(function (departamento) {
            if (departamento === "Otros") {
                _this.formulario.get("municipio").setValue("Otros");
                _this.formulario.get("municipio").disable();
            }
            else {
                _this.formulario.get("municipio").enable();
            }
        });
        this.formulario
            .get("sexo_agre")
            .valueChanges.pipe(operators_1.startWith(""))
            .subscribe(function (sexoAgresor) {
            _this.actualizarOpcionesParentezco(sexoAgresor);
        });
    };
    PredictorComponent.prototype.predecir = function () {
        var _this = this;
        this.banderaVisibilidad = true;
        this.banderaCard = true;
        if (this.formulario.valid) {
            this.animacion = true;
            this.mostrarOverlay = true;
            var formularioValue = __assign({}, this.formulario.value);
            formularioValue.semana = formularioValue.semana.toString();
            formularioValue.año = formularioValue.año.toString();
            this.registroDTO = formularioValue;
            if (this.registroDTO.departamento == "Otros") {
                this.registroDTO.municipio = "Otros";
            }
            this.registroDTO.mes = this.obtenerMesDesdeSemana(this.registroDTO.semana);
            this.registroDTO.trimestre = this.obtenerTrimestreDesdeSemana(this.registroDTO.semana);
            this.registroDTO.ciclo_de_vida = this.opcionesCicloDeVida(this.registroDTO.grupo_edad);
            this.registroDTO.violencia_intrafamiliar = this.obtenerViolenciaIntrafamiliar(this.registroDTO.parentezco_vict);
            this.registroDTO.victima_menor_de_edad = this.obtenerVictimaMenor(this.registroDTO.grupo_edad);
            this.registroDTO.agresor_menor_de_edad = this.obtenerAgresorMenor(this.registroDTO.edad_agre);
            console.log(this.registroDTO);
            this.service.predecir(this.registroDTO).subscribe(function (result) {
                _this.definicion = result.definicion;
                _this.prediccion = result.prediccion;
                _this.importancia_caracteristicas = result.importancia_caracteristicas;
                console.log(_this.importancia_caracteristicas[_this.prediccion]);
                _this.animacion = false;
                _this.mostrarOverlay = false;
                _this.graficaCaracteristicas(_this.importancia_caracteristicas[_this.prediccion]);
                _this.banderaVisibilidad = false;
                _this.banderaCard = false;
            });
        }
        else {
            console.log("Algunos campos del formulario no son válidos.");
            Object.keys(this.formulario.controls).forEach(function (key) {
                var control = _this.formulario.get(key);
                if (control.invalid) {
                    console.log("Campo \"" + key + "\" no v\u00E1lido.");
                }
            });
            return;
        }
    };
    PredictorComponent.prototype.obtenerAgresorMenor = function (edad_agre) {
        return edad_agre >= 18 ? "0" : "1";
    };
    PredictorComponent.prototype.obtenerVictimaMenor = function (grupoEdad) {
        switch (grupoEdad) {
            case "0 a 6":
                return "1";
            case "7  a 11":
                return "1";
            case "12 a 17":
                return "1";
            case "18 a 28":
                return "0";
            case "29 a 59":
                return "0";
            case "60 y mas":
                return "0";
            default:
                return "0";
        }
    };
    PredictorComponent.prototype.obtenerViolenciaIntrafamiliar = function (parentezco_vict) {
        var valoresPermitidos = ["Madre", "Padre", "Familiar", "Pareja", "Ex pareja", "Esposo", "Compañero permanente", "Novio(a)", "Abuelo(a)"];
        return valoresPermitidos.includes(parentezco_vict) ? "1" : "0";
    };
    PredictorComponent.prototype.graficaCaracteristicas = function (importancia_caracteristicas) {
        // Filtrar solo las características con importancia positiva
        var caracteristicasPositivas = importancia_caracteristicas.filter(function (item) { return item.importancia >= 0; });
        // Ordenar el arreglo de características positivas por importancia de manera descendente
        var sortedImportancia = caracteristicasPositivas.sort(function (a, b) { return b.importancia - a.importancia; });
        // Tomar los 10 elementos con mayor importancia
        var top10Importancia = sortedImportancia.slice(0, 10);
        var etiquetas = top10Importancia.map(function (item) { return item.nombre; });
        var valores = top10Importancia.map(function (item) { return item.importancia; });
        var colores = valores.map(function () { return "rgba(156, 39, 176, 1)"; }); // Colores para valores positivos
        var existingChart = chart_js_1.Chart.getChart("graficoImportancia");
        if (existingChart) {
            existingChart.destroy();
        }
        try {
            var ctx = document.getElementById("graficoImportancia");
            if (!ctx) {
                console.error("No se encontró el elemento canvas");
                return;
            }
            var myChart = new chart_js_1.Chart(ctx, {
                type: "bar",
                data: {
                    labels: etiquetas,
                    datasets: [
                        {
                            label: "Importancia de características",
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
                    indexAxis: "y",
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var originalValue = valores[context.dataIndex];
                                    return originalValue.toFixed(5);
                                }
                            }
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error("Error al crear la gráfica:", error);
        }
    };
    PredictorComponent.prototype.obtenerMesDesdeSemana = function (prmsemana) {
        var semana = parseInt(prmsemana);
        if (semana < 1 || semana > 52) {
            throw new Error("Número de semana fuera de rango (debe estar entre 1 y 52)");
        }
        var fechaInicioAño = new Date(2023, 0, 1); // 2023-01-01
        var fechaInicioSemana = date_fns_1.startOfWeek(fechaInicioAño); // Primer día de la primera semana
        var fechaObjetivo = date_fns_1.addWeeks(fechaInicioSemana, semana - 1); // Fecha correspondiente a la semana
        var mes = date_fns_1.getMonth(fechaObjetivo);
        var nombresMeses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        return (mes + 1).toString().padStart(2, "0") + ". " + nombresMeses[mes];
    };
    PredictorComponent.prototype.obtenerTrimestreDesdeSemana = function (prmsemana) {
        var semana = parseInt(prmsemana);
        if (semana < 1 || semana > 52) {
            throw new Error("Número de semana fuera de rango (debe estar entre 1 y 52)");
        }
        var fechaInicioAño = new Date(2023, 0, 1); // 2023-01-01
        var fechaInicioSemana = date_fns_1.startOfWeek(fechaInicioAño); // Primer día de la primera semana
        var fechaObjetivo = date_fns_1.addWeeks(fechaInicioSemana, semana - 1); // Fecha correspondiente a la semana
        var trimestre = date_fns_1.getQuarter(fechaObjetivo);
        var trimestrString = "" + trimestre;
        return trimestrString;
    };
    PredictorComponent.prototype.opcionesCicloDeVida = function (grupoEdad) {
        var cicloDeVidaValue = "";
        switch (grupoEdad) {
            case "0 a 6":
                cicloDeVidaValue = "Primera infancia";
                break;
            case "7  a 11":
                cicloDeVidaValue = "Infancia";
                break;
            case "12 a 17":
                cicloDeVidaValue = "Adolescencia";
                break;
            case "18 a 28":
                cicloDeVidaValue = "Jovenes";
                break;
            case "29 a 59":
                cicloDeVidaValue = "Adultez";
                break;
            case "60 y mas":
                cicloDeVidaValue = "Persona Mayor";
                break;
            default:
                cicloDeVidaValue = "";
                break;
        }
        return cicloDeVidaValue;
    };
    PredictorComponent.prototype.actualizarOpcionesParentezco = function (sexoAgresor) {
        // Restaura las opciones originales desde la copia de respaldo
        this.parentezcosVict = __spreadArrays(this.parentezcosVictBackup);
        // Filtra las opciones de parentezco según el sexo del agresor
        if (sexoAgresor === "M") {
            // Si el sexo del agresor es masculino, excluye la opción "Madre"
            this.parentezcosVict = this.parentezcosVict.filter(function (opcion) { return opcion !== "Madre"; });
        }
        else if (sexoAgresor === "F") {
            // Si el sexo del agresor es femenino, excluye las opciones "Padre" y "Esposo"
            this.parentezcosVict = this.parentezcosVict.filter(function (opcion) { return opcion !== "Padre" && opcion !== "Esposo"; });
        }
        // Establece las opciones filtradas en el formulario
        this.formulario.get("parentezco_vict").setValue("");
    };
    PredictorComponent.prototype.showTooltip = function () {
        if (!this.tooltip.disabled) {
            this.tooltip.show();
        }
    };
    PredictorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.listen(this.tooltipIcon.nativeElement, 'click', function () {
            _this.showTooltip();
        });
    };
    __decorate([
        core_1.ViewChild(tooltip_1.MatTooltip)
    ], PredictorComponent.prototype, "tooltip");
    __decorate([
        core_1.ViewChild('tooltipIcon')
    ], PredictorComponent.prototype, "tooltipIcon");
    __decorate([
        core_1.HostListener('window:beforeunload', ['$event']),
        core_1.HostListener('window:pagehide', ['$event'])
    ], PredictorComponent.prototype, "beforeunloadHandler");
    PredictorComponent = __decorate([
        core_1.Component({
            selector: "app-predictor",
            templateUrl: "./predictor.component.html",
            styleUrls: ["./predictor.component.scss"]
        })
    ], PredictorComponent);
    return PredictorComponent;
}());
exports.PredictorComponent = PredictorComponent;
