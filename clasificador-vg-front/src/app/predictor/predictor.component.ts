import { Component, OnInit } from "@angular/core";
import { Service } from "../service/service";
import { RegistroDto } from "app/dto/registro-dto";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Chart } from "chart.js";
import "chart.js/auto";
import { startOfWeek, addWeeks, getMonth, getQuarter, format } from 'date-fns';
import { startWith } from "rxjs/operators";

@Component({
  selector: "app-predictor",
  templateUrl: "./predictor.component.html",
  styleUrls: ["./predictor.component.scss"],
})
export class PredictorComponent implements OnInit {
  public registroDTO: RegistroDto;
  public definicion: any;
  public prediccion: any;
  public importancia_caracteristicas: any;
  public banderaVisibilidad: boolean = false;
  public animacion;
  public banderaCard: boolean=true;
  formulario: FormGroup;
  departamentos: string[] = ["SANTANDER", "Otros"];
  municipios: string[] = ["BUCARAMANGA", "Otros"];
  anios: string[] = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
  gruposEdad: string[] = ["0 a 6", "7  a 11", "12 a 17", "18 a 28", "29 a 59", "60 y mas"];
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
    "No asegurado",
    "Excepción",
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
  sexosAgre: String[] = ["M", "F"];
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
  noms_eve: string[] = [
    "VIGILANCIA EN SALUD PÚBLICA DE LA VIOLENCIA DE GÉNERO E INTRAFAMILIAR",
    "VIGILANCIA EN SALUD PÚBLICA DE LAS VIOLENCIAS DE GÉNERO",
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
  
  sivigilas = [
    { valor: "1", texto: "sivigila_2012" },
    { valor: "2", texto: "sivigila_2014" },
    { valor: "3", texto: "sivigila_2015" },
    { valor: "4", texto: "sivigila_2016" },
    { valor: "5", texto: "sivigila_2017" },
    { valor: "6", texto: "sivigila_2018" },
  ];

  parentezcosVictBackup: string[] = [...this.parentezcosVict];
  constructor(private service: Service, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.registroDTO = new RegistroDto();

    this.initFormulario();
  }
  initFormulario() {
    this.formulario = this.formBuilder.group({
      departamento: ["", Validators.required],
      municipio: ["", Validators.required],
      semana: ["", Validators.required],
      año: ["", Validators.required],
      grupo_edad: ["", Validators.required],
      sexo: ["", Validators.required],
      area: ["", Validators.required],
      comuna: ["", Validators.required],
      tipo_de_seguridad_social: ["", Validators.required],
      paciente_hospitalizado: ["", Validators.required],
      condicion_final: ["", Validators.required],
      actividad: ["", Validators.required],
      edad_agre: ["", Validators.required],
      sexo_agre: ["", Validators.required],
      parentezco_vict: ["", Validators.required],
      sustancias_victima: ["", Validators.required],
      escenario: ["", Validators.required],
      nom_eve: ["", Validators.required],
      nom_upgd: ["", Validators.required],
      sivigila: ["", Validators.required],
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
      this.formulario.get('sexo_agre').valueChanges.pipe(startWith('')).subscribe((sexoAgresor) => {
        this.actualizarOpcionesParentezco(sexoAgresor);
      });
  }

  public predecir() {
    this.banderaVisibilidad = true;
    this.banderaCard=true;
    if (this.formulario.valid) {
      this.animacion=true;
      const formularioValue = { ...this.formulario.value };
      formularioValue.semana = formularioValue.semana.toString();
      formularioValue.año = formularioValue.año.toString();
      this.registroDTO = formularioValue;
      if (this.registroDTO.departamento == "Otros") {
        this.registroDTO.municipio = "Otros";
      }
      this.registroDTO.mes= this.obtenerMesDesdeSemana(this.registroDTO.semana)
      this.registroDTO.trimestre=this.obtenerTrimestreDesdeSemana(this.registroDTO.semana)
      this.registroDTO.ciclo_de_vida=this.opcionesCicloDeVida(this.registroDTO.grupo_edad)
      console.log(this.registroDTO);
    
      this.service.predecir(this.registroDTO).subscribe((result) => {
        this.definicion = result.definicion;
        this.prediccion = result.prediccion;
        this.importancia_caracteristicas = result.importancia_caracteristicas;
        console.log(this.importancia_caracteristicas[this.prediccion]);
        this.animacion=false;
        this.graficaCaracteristicas(this.importancia_caracteristicas[this.prediccion]);
        this.banderaVisibilidad = false;
        this.banderaCard=false;
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

  graficaCaracteristicas(importancia_caracteristicas: any) {
    // Filtrar solo las características con importancia positiva
    const caracteristicasPositivas = importancia_caracteristicas.filter(
      (item) => item.importancia >= 0
    );
  
    // Ordenar el arreglo de características positivas por importancia de manera descendente
    const sortedImportancia = caracteristicasPositivas.sort(
      (a, b) => b.importancia - a.importancia
    );
  
    // Tomar los 10 elementos con mayor importancia
    const top10Importancia = sortedImportancia.slice(0, 10);
  
    const etiquetas = top10Importancia.map((item) => item.nombre);
    const valores = top10Importancia.map((item) => item.importancia);
  
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
      throw new Error("Número de semana fuera de rango (debe estar entre 1 y 52)");
    }
  
    const fechaInicioAño = new Date(2023, 0, 1); // 2023-01-01
    const fechaInicioSemana = startOfWeek(fechaInicioAño); // Primer día de la primera semana
    const fechaObjetivo = addWeeks(fechaInicioSemana, semana - 1); // Fecha correspondiente a la semana
    const mes = getMonth(fechaObjetivo);
  
    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
  
    return `${(mes + 1).toString().padStart(2, '0')}. ${nombresMeses[mes]}`;
  }
 obtenerTrimestreDesdeSemana(prmsemana: string): string {
  const semana: number = parseInt(prmsemana);
    if (semana < 1 || semana > 52) {
      throw new Error("Número de semana fuera de rango (debe estar entre 1 y 52)");
    }
  
    const fechaInicioAño = new Date(2023, 0, 1); // 2023-01-01
    const fechaInicioSemana = startOfWeek(fechaInicioAño); // Primer día de la primera semana
    const fechaObjetivo = addWeeks(fechaInicioSemana, semana - 1); // Fecha correspondiente a la semana
    const trimestre = getQuarter(fechaObjetivo);
    const trimestrString: string = `${trimestre}`;
    return trimestrString;
  }
  opcionesCicloDeVida(grupoEdad: string): string {
    let cicloDeVidaValue = '';
  
    switch (grupoEdad) {
      case '0 a 6':
        cicloDeVidaValue = 'Primera infancia';
        break;
      case '7  a 11':
        cicloDeVidaValue = 'Infancia';
        break;
      case '12 a 17':
        cicloDeVidaValue = 'Adolescencia';
        break;
      case '18 a 28':
        cicloDeVidaValue = 'Jovenes';
        break;
      case '29 a 59':
        cicloDeVidaValue = 'Adultez';
        break;
      case '60 y mas':
        cicloDeVidaValue = 'Persona Mayor';
        break;
      default:
        cicloDeVidaValue = '';
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
      this.parentezcosVict = this.parentezcosVict.filter((opcion) => opcion !== "Madre");
    } else if (sexoAgresor === "F") {
      // Si el sexo del agresor es femenino, excluye las opciones "Padre" y "Esposo"
      this.parentezcosVict = this.parentezcosVict.filter((opcion) => opcion !== "Padre" && opcion !== "Esposo");
    }
  
    // Establece las opciones filtradas en el formulario
    this.formulario.get("parentezco_vict").setValue("");
  }
  
  

}
