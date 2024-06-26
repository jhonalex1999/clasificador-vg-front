import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
  HostListener,
} from "@angular/core";
import { Service } from "../service/service";
import { RegistroDto } from "app/dto/registro-dto";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Chart } from "chart.js";
import "chart.js/auto";
import { startOfWeek, addWeeks, getMonth, getQuarter, format } from "date-fns";
import { startWith } from "rxjs/operators";
import { MatTooltip } from "@angular/material/tooltip";
import { filter } from "rxjs/operators";
@Component({
  selector: "app-predictor",
  templateUrl: "./predictor.component.html",
  styleUrls: ["./predictor.component.scss"],
})
export class PredictorComponent implements OnInit {
  @ViewChild("tooltipDepartamento") tooltipDepartamento: MatTooltip;
  @ViewChild("tooltipMunicipio") tooltipMunicipio: MatTooltip;
  @ViewChild("tooltipSemana") tooltipSemana: MatTooltip;
  @ViewChild("tooltipAnio") tooltipAnio: MatTooltip;
  @ViewChild("tooltipRangoEdad") tooltipRangoEdad: MatTooltip;
  @ViewChild("tooltipSexoVictima") tooltipSexoVictima: MatTooltip;
  @ViewChild("tooltipArea") tooltipArea: MatTooltip;
  @ViewChild("tooltipComuna") tooltipComuna: MatTooltip;
  @ViewChild("tooltipSeguridadSocial") tooltipSeguridadSocial: MatTooltip;
  @ViewChild("tooltipVictimaHospitalizada")
  tooltipVictimaHospitalizada: MatTooltip;
  @ViewChild("tooltipEstadoFinal") tooltipEstadoFinal: MatTooltip;
  @ViewChild("tooltipActividadVictima") tooltipActividadVictima: MatTooltip;
  @ViewChild("tooltipEdadAgresor") tooltipEdadAgresor: MatTooltip;
  @ViewChild("tooltipSexoAgresor") tooltipSexoAgresor: MatTooltip;
  @ViewChild("tooltipParentezco") tooltipParentezco: MatTooltip;
  @ViewChild("tooltipSustanciasVictima") tooltipSustanciasVictima: MatTooltip;
  @ViewChild("tooltipEscenarioEvento") tooltipEscenarioEvento: MatTooltip;
  @ViewChild("tooltipUPGD") tooltipUPGD: MatTooltip;
  @ViewChild("tooltipGrafica") tooltipGrafica: MatTooltip;

  public registroDTO: RegistroDto;
  public definicion: any;
  public prediccion: any;
  public importancia_caracteristicas: any;
  public banderaVisibilidad: boolean = false;
  public animacion;
  public mostrarOverlay: boolean = false;
  public banderaCard: boolean = true;
  formulario: FormGroup;
  departamentos: string[] = ["SANTANDER", "Otros"];
  municipios: string[] = ["BUCARAMANGA", "Otros"];
  anios: string[] = [
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
  gruposEdad: string[] = [
    "0 a 6",
    "7  a 11",
    "12 a 17",
    "18 a 28",
    "29 a 59",
    "60 y mas",
  ];
  sexos: string[] = ["Femenino", "Masculino"];
  areas: string[] = ["CABECERA MUNICIPAL", "RURAL DISPERSO", "CENTRO POBLADO"];
  comunas: string[] = [
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
  tiposDeSeguridadSocial: string[] = [
    "Subsidiado",
    "Contributivo",
    "Excepción",
    "Indeterminado",
    "No Asegurado",
    "No Afiliado",
  ];
  tiposDePacienteHospitalizado = [
    { valor: "1", texto: "Sí" },
    { valor: "2", texto: "No" },
  ];
  condicionesFinales = [
    { valor: "0", texto: "Vivo" },
    { valor: "1", texto: "Muerto" },
    { valor: "2", texto: "No sabe-no responde" },
  ];
  actividades = [
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
  sexosAgre = [
    { valor: "F", texto: "Femenino" },
    { valor: "M", texto: "Masculino" },
  ];
  parentezcosVict: string[] = [
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
  sustanciasVictima = [
    { valor: "1", texto: "Sí" },
    { valor: "2", texto: "No" },
  ];
  escenarios = [
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
  noms_upgd: string[] = [
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

  tooltipContentGrafica =
    "La gráfica resalta las características más importantes consideradas por el modelo de machine learning para realizar predicciones. Cada barra representa la influencia de una característica en la predicción del modelo, ofreciendo una visión rápida de los factores más relevantes.";
  tooltipContentDepartamento =
    "Departamento donde sucedió el caso de violencia de género.";
  tooltipContentMunicipio =
    "Municipio donde sucedió el caso de violencia de género. Este campo se autocompleta con el valor de Otros si el departamento tiene como valor Otros.";
  tooltipContentSemana =
    "Semana en la que sucedió el caso de violencia de género. (A partir de este valor también se generan los valores para las variables Mes y Trimestre).";
  tooltipContentAnio = "Año en el que sucedió el caso de violencia de género.";
  tooltipContentRangoEdad =
    "Rango de edad que tenía la víctima en el momento del suceso de violencia de género. (A partir de esta variable se genera los valores para la variable ciclo de vida y víctima menor de edad)";
  tooltipContentSexoVictima =
    "Sexo de la víctima del acto de violencia de género.";
  tooltipContentArea =
    "Área geográfica del municipio donde ocurrió el caso de violencia de género.";
  tooltipContentComuna =
    "Comuna del área geográfica donde sucedió el acto de violencia de género. (Este campo toma como Valor Otros si el municipio es diferente a cabecera municipal, de lo contrario se despliegan una serie de comunas)";
  tooltipContentSeguridadSocial =
    "Tipo de seguridad social a la que se encuentra vinculada la víctima de violencia de género.";
  tooltipContentVictimaHospitalizada =
    "Valor que indica si la víctima fue hospitalizada después de sufrir el acto de violencia de género.";
  tooltipContentEstadoFinal =
    "Indica el estado vital de la víctima luego de sufrir el acto de violencia de género.";
  tooltipContentActividadVictima =
    "Actividad en la que se desempeña la víctima de violencia de género.";
  tooltipContentEdadAgresor =
    "Edad del agresor en el momento del acto de violencia de género. (A partir de esta variable se genera el valor para la variable agresor menor de edad)";
  tooltipContentSexoAgresor =
    "Sexo del agresor. Se debe tener en cuenta que según el género seleccionado en esta variable se modifican los posibles valores de la variable parentezco víctima.";
  tooltipContentParentezco =
    "Parentezco persona o familiar de la víctima con el agresor. (A partir de esta variable se generan los valores para la variable violencia intrafamiliar y nombre del evento)";
  tooltipContentSustanciasVictima =
    "Indica si la víctima estaba bajo el efecto de sustancias psicoactivas en el momento del acto de violencia de género.";
  tooltipContentEscenarioEvento =
    "Entorno ambiental donde sucedió el caso de violencia de género.";
  tooltipContentUPGD =
    "La unidad primaria generadora de datos hace referencia a la entidad encargada de recibir o generar la información del acto de violencia de género.";
  private sexoAgreAnterior: string = "";
  parentezcosVictBackup: string[] = [...this.parentezcosVict];
  constructor(
    private service: Service,
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.registroDTO = new RegistroDto();

    this.initFormulario();
    this.cargarDesdeLocalStorage();
  }
  @HostListener("window:beforeunload", ["$event"])
  @HostListener("window:pagehide", ["$event"])
  beforeunloadHandler(event: Event) {
    // Borrar la clave del localStorage al cerrar la pestaña
    localStorage.removeItem("primerCarga");
    if (localStorage.getItem("formData")) {
      // Si existe, eliminar la clave del localStorage
      localStorage.removeItem("formData");
    }
  }

  initFormulario() {
    this.formulario = this.formBuilder.group({
      departamento: [""],
      municipio: [""],
      semana: [""],
      año: [""],
      grupo_edad: [""],
      sexo: [""],
      area: [""],
      comuna: [""],
      tipo_de_seguridad_social: [""],
      paciente_hospitalizado: [""],
      condicion_final: [""],
      actividad: [""],
      edad_agre: [""],
      sexo_agre: [""],
      parentezco_vict: [""],
      sustancias_victima: [""],
      escenario: [""],
      nom_upgd: [""],
    });
    // Agregar el escuchador de cambios al campo "area"
    this.formulario.get("area").valueChanges.subscribe((area) => {
      // Si el área es "CABECERA MUNICIPAL", mostrar el campo "comuna"
      if (area === "CABECERA MUNICIPAL") {
        this.formulario.get("comuna").enable();
      } else if (area === "RURAL DISPERSO" || area === "CENTRO POBLADO") {
        // Si no, establecer el valor de "comuna" en "Otros" y deshabilitarlo
        this.formulario.get("comuna").setValue("Otros");
        this.formulario.get("comuna").disable();
      }
    });

    this.formulario
      .get("departamento")
      .valueChanges.subscribe((departamento) => {
        if (departamento === "Otros") {
          this.formulario.get("municipio").setValue("Otros");
          this.formulario.get("municipio").disable();
        } else {
          this.formulario.get("municipio").enable();
        }
      });

    this.formulario
      .get("sexo_agre")
      .valueChanges.pipe(startWith(""))
      .subscribe((sexoAgresor) => {
        if (sexoAgresor !== this.sexoAgreAnterior) {
          this.actualizarOpcionesParentezco(sexoAgresor);
          this.sexoAgreAnterior = sexoAgresor; // Actualizar el valor anterior
        }
      });

    this.formulario.valueChanges.subscribe(() => {
      this.guardarSinEnviar();
    });
  }
  cargarDesdeLocalStorage() {
    const formDataString = localStorage.getItem("formData");
    if (formDataString) {
      const formData = JSON.parse(formDataString);
      this.formulario.patchValue(formData);
    }
  }

  limpiarFormulario() {
    this.formulario.reset(); // Restablecer el formulario
    this.formulario.get("comuna").enable(); // Habilitar el control "comuna"
    this.desactivarValidaciones();
    // Eliminar los datos del formulario del almacenamiento local
    if (localStorage.getItem("formData")) {
      localStorage.removeItem("formData");
    }
  }

  desactivarValidaciones() {
    Object.keys(this.formulario.controls).forEach((field) => {
      const control = this.formulario.get(field);
      control.setValidators(null); // Establece los validadores como nulos
      control.updateValueAndValidity(); // Actualiza la validez del control
    });
  }

  guardarSinEnviar() {
    // Aquí se obtienen los valores del formulario
    const formData = this.formulario.value;
    // Se convierten a cadena JSON y se guardan en el almacenamiento local bajo la clave 'formData'
    localStorage.setItem("formData", JSON.stringify(formData));
  }
  agregarValidacionRequeridaATodosLosCampos() {
    // Obtenemos los nombres de los campos del formulario
    const campos = Object.keys(this.formulario.controls);

    // Iteramos sobre cada campo y le agregamos la validación requerida si no la tiene
    campos.forEach((campo) => {
      const control = this.formulario.get(campo);
      // Verificamos si el campo no tiene la validación requerida
      if (!control.validator || !this.hasRequiredValidator(control)) {
        // Agregamos la validación requerida
        const validators = control.validator
          ? [control.validator, Validators.required]
          : Validators.required;
        control.setValidators(validators);
        control.updateValueAndValidity();
      }
    });
  }

  hasRequiredValidator(control: AbstractControl<any>): boolean {
    if (control.validator) {
      const validators = Array.isArray(control.validator)
        ? control.validator
        : [control.validator];
      return validators.some((validator) => validator === Validators.required);
    }
    return false;
  }

  public predecir() {
    this.agregarValidacionRequeridaATodosLosCampos();
    this.banderaVisibilidad = true;
    this.banderaCard = true;
    if (this.formulario.valid) {
      this.animacion = true;
      this.mostrarOverlay = true;
      const formularioValue = { ...this.formulario.value };
      formularioValue.semana = formularioValue.semana.toString();
      formularioValue.año = formularioValue.año.toString();
      this.registroDTO = formularioValue;
      if (this.registroDTO.departamento == "Otros") {
        this.registroDTO.municipio = "Otros";
      }
      this.registroDTO.comuna = this.formulario.get("comuna").value;

      this.registroDTO.mes = this.obtenerMesDesdeSemana(
        this.registroDTO.semana
      );
      this.registroDTO.trimestre = this.obtenerTrimestreDesdeSemana(
        this.registroDTO.semana
      );
      this.registroDTO.ciclo_de_vida = this.opcionesCicloDeVida(
        this.registroDTO.grupo_edad
      );
      this.registroDTO.violencia_intrafamiliar =
        this.obtenerViolenciaIntrafamiliar(this.registroDTO.parentezco_vict);
      this.registroDTO.victima_menor_de_edad = this.obtenerVictimaMenor(
        this.registroDTO.grupo_edad
      );
      this.registroDTO.agresor_menor_de_edad = this.obtenerAgresorMenor(
        this.registroDTO.edad_agre
      );
      this.registroDTO.nom_eve = this.obtenerNombreDelEvento(
        this.registroDTO.parentezco_vict
      );
   

      this.service.predecir(this.registroDTO).subscribe((result) => {
        this.definicion = result.definicion;
        this.prediccion = result.prediccion;
        this.importancia_caracteristicas = result.importancia_caracteristicas;
   
        this.animacion = false;
        this.mostrarOverlay = false;
        this.graficaCaracteristicas(
          this.importancia_caracteristicas
        );
        this.banderaVisibilidad = false;
        this.banderaCard = false;
      });
    } else {
      console.log("Algunos campos del formulario no son válidos.");
      Object.keys(this.formulario.controls).forEach((key) => {
        const control = this.formulario.get(key);
        if (control.invalid) {
          console.log(`Campo "${key}" no válido.`);
        }
      });
      return;
    }
  }
  obtenerAgresorMenor(edad_agre: number): string {
    return edad_agre >= 18 ? "0" : "1";
  }
  obtenerVictimaMenor(grupoEdad: string): string {
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
  }
  obtenerViolenciaIntrafamiliar(parentezco_vict: string): string {
    const valoresPermitidos = [
      "Madre",
      "Padre",
      "Familiar",
      "Pareja",
      "Ex pareja",
      "Esposo",
      "Compañero permanente",
      "Novio(a)",
      "Abuelo(a)",
    ];
    return valoresPermitidos.includes(parentezco_vict) ? "1" : "0";
  }
  obtenerNombreDelEvento(parentezco_vict: string): string {
    const valoresPermitidos = [
      "Madre",
      "Padre",
      "Familiar",
      "Pareja",
      "Ex pareja",
      "Esposo",
      "Compañero permanente",
      "Novio(a)",
      "Abuelo(a)",
    ];
    return valoresPermitidos.includes(parentezco_vict)
      ? "VIGILANCIA EN SALUD PÚBLICA DE LA VIOLENCIA DE GÉNERO E INTRAFAMILIAR"
      : "VIGILANCIA EN SALUD PÚBLICA DE LAS VIOLENCIAS DE GÉNERO";
  }

  graficaCaracteristicas(importancia_caracteristicas: any) {
    
    const etiquetas = importancia_caracteristicas.map((item: any) => item[0].nombre);

    // Obtener valores
    const valores = importancia_caracteristicas.map((item: any) => item[0].importancia);

    const colores = valores.map(() => "rgba(156, 39, 176, 1)"); // Colores para valores positivos

    const existingChart = Chart.getChart("graficoImportancia");
    if (existingChart) {
      existingChart.destroy();
    }
    try {
      const ctx = document.getElementById(
        "graficoImportancia"
      ) as HTMLCanvasElement;
      if (!ctx) {
        console.error("No se encontró el elemento canvas");
        return;
      }

      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: etiquetas,
          datasets: [
            {
              label: "Importancia de características",
              data: valores,
              backgroundColor: colores,
              borderColor: colores,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const originalValue = valores[context.dataIndex];
                  return originalValue.toFixed(5);
                },
              },
            },
            datalabels: {
              display: false,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error al crear la gráfica:", error);
    }
  }

  obtenerMesDesdeSemana(prmsemana: string): string {
    const semana: number = parseInt(prmsemana);
    if (semana < 1 || semana > 52) {
      throw new Error(
        "Número de semana fuera de rango (debe estar entre 1 y 52)"
      );
    }

    const fechaInicioAño = new Date(2023, 0, 1); // 2023-01-01
    const fechaInicioSemana = startOfWeek(fechaInicioAño); // Primer día de la primera semana
    const fechaObjetivo = addWeeks(fechaInicioSemana, semana - 1); // Fecha correspondiente a la semana
    const mes = getMonth(fechaObjetivo);

    const nombresMeses = [
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

    return `${(mes + 1).toString().padStart(2, "0")}. ${nombresMeses[mes]}`;
  }
  obtenerTrimestreDesdeSemana(prmsemana: string): string {
    const semana: number = parseInt(prmsemana);
    if (semana < 1 || semana > 52) {
      throw new Error(
        "Número de semana fuera de rango (debe estar entre 1 y 52)"
      );
    }

    const fechaInicioAño = new Date(2023, 0, 1); // 2023-01-01
    const fechaInicioSemana = startOfWeek(fechaInicioAño); // Primer día de la primera semana
    const fechaObjetivo = addWeeks(fechaInicioSemana, semana - 1); // Fecha correspondiente a la semana
    const trimestre = getQuarter(fechaObjetivo);
    const trimestrString: string = `${trimestre}`;
    return trimestrString;
  }
  opcionesCicloDeVida(grupoEdad: string): string {
    let cicloDeVidaValue = "";

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
  }
  actualizarOpcionesParentezco(sexoAgresor: string): void {
    // Restaura las opciones originales desde la copia de respaldo
    this.parentezcosVict = [...this.parentezcosVictBackup];

    // Filtra las opciones de parentezco según el sexo del agresor
    if (sexoAgresor === "M") {
      // Si el sexo del agresor es masculino, excluye la opción "Madre"
      this.parentezcosVict = this.parentezcosVict.filter(
        (opcion) => opcion !== "Madre"
      );
    } else if (sexoAgresor === "F") {
      // Si el sexo del agresor es femenino, excluye las opciones "Padre" y "Esposo"
      this.parentezcosVict = this.parentezcosVict.filter(
        (opcion) => opcion !== "Padre" && opcion !== "Esposo"
      );
    }

    // Establece las opciones filtradas en el formulario
    this.formulario.get("parentezco_vict").setValue("");
  }

  mostrarTooltip(tooltip: MatTooltip) {
    tooltip.show();
  }
}
