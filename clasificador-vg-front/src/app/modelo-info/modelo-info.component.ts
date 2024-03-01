import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { Service } from '../service/service';
import { Chart} from 'chart.js';

@Component({
  selector: 'app-modelo-info',
  templateUrl: './modelo-info.component.html',
  styleUrls: ['./modelo-info.component.scss', './background-animado.css']
})
export class ModeloInfoComponent implements OnInit {
  @ViewChild('metrics', { static: true }) metricCanvas: ElementRef;
  private dataframe: any[] = [];
  public dataRows: any[] = [];
  public metric: any[]=[];
  modelos = [];
  exactitudes = [];
  precisiones = [];
  sensibilidades = [];
  puntuacionesF1 = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  chart: any;
  mostrarOverlay: boolean ;
  primerCarga = false;
  constructor(private service: Service) { }

  ngOnInit(): void {
    this.metric=[{modelo:'GaussianNB',exactitud:0.658,precision:0.686,sensibilidad:0.682,puntuacion_F1:0.624},
                 {modelo:'SVM',exactitud:0.816,precision:0.805,sensibilidad:0.789,puntuacion_F1:0.796},
                 {modelo:'KNN',exactitud:0.793,precision:0.774,sensibilidad:0.766,puntuacion_F1:0.769},
                 {modelo:'Neural Networks',exactitud:0.810,precision:0.80,sensibilidad:0.799,puntuacion_F1:0.799},
                 {modelo:'Decision Trees',exactitud:0.783,precision:0.771,sensibilidad:0.769,puntuacion_F1:0.770},
                 {modelo:'AdaBoost',exactitud:0.825,precision:0.817,sensibilidad:0.812,puntuacion_F1:0.814},
                 {modelo:'Regresión Logística',exactitud:0.835,precision:0.827,sensibilidad:0.822,puntuacion_F1:0.825},
                 {modelo:'Gradient Boosting',exactitud:0.836,precision:0.827,sensibilidad:0.819,puntuacion_F1:0.822},
                 {modelo:'Extra Trees',exactitud:0.847,precision:0.837,sensibilidad:0.836,puntuacion_F1:0.836},
                 {modelo:'Random Forest',exactitud:0.850,precision:0.840,sensibilidad:0.840,puntuacion_F1:0.839},
                 {modelo:'LightGBM',exactitud:0.850,precision:0.841,sensibilidad:0.840,puntuacion_F1:0.840},
                 {modelo:'XGBoost',exactitud:0.850,precision:0.842,sensibilidad:0.840,puntuacion_F1:0.841},
                 {modelo:'XGBoost Optimizado',exactitud:0.855,precision:0.845,sensibilidad:0.846,puntuacion_F1:0.845}]
    this.service.obtenerDF().subscribe(
      result => {
        this.dataframe = JSON.parse(result.dataframe);
        this.dataRows = Object.values(this.dataframe); 
        console.log(this.dataRows)
        this.dataRows.forEach((row) => {
          row.anio = row.año;
        });
      }
    );
    this.metric.forEach(item => {
      this.modelos.push(item.modelo);
      this.exactitudes.push(item.exactitud);
      this.precisiones.push(item.precision);
      this.sensibilidades.push(item.sensibilidad);
      this.puntuacionesF1.push(item.puntuacion_F1);
    });

    // Crear la gráfica
    this.createChart();
    if (!localStorage.getItem('primerCarga')) {
      this.mostrarOverlay = true;
      localStorage.setItem('primerCarga', 'true');
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  @HostListener('window:pagehide', ['$event'])
  beforeunloadHandler(event: Event) {
    // Borrar la clave del localStorage al cerrar la pestaña
    localStorage.removeItem('primerCarga');
    if (localStorage.getItem('formData')) {
      // Si existe, eliminar la clave del localStorage
      localStorage.removeItem('formData');
    }
  }

  createChart(): void {
    const ctx = this.metricCanvas.nativeElement.getContext('2d');
  
    this.chart = new Chart(ctx, {
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
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,  
        maintainAspectRatio: false, 
        plugins:{
          datalabels: {
            display: false, 
          }
        }
      },
    });
  }
  // Función para obtener los elementos de la página actual
 getCurrentPageRows(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.dataRows.slice(startIndex, endIndex);
}

// Función para cambiar a la siguiente página
nextPage() {
  if ((this.currentPage * this.itemsPerPage) < this.dataRows.length) {
    this.currentPage++;
  }
}

// Función para cambiar a la página anterior
prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
ocultarOverlay() {
  this.mostrarOverlay = false;
}
}
