import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Service } from '../service/service';
import { Chart} from 'chart.js';

@Component({
  selector: 'app-modelo-info',
  templateUrl: './modelo-info.component.html',
  styleUrls: ['./modelo-info.component.scss']
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
  
  chart: any;
 
  constructor(private service: Service) { }

  ngOnInit(): void {
    this.metric=[{modelo:'GaussianNB',exactitud:0.648,precision:0.676,sensibilidad:0.664,puntuacion_F1:0.611},
                 {modelo:'SVM',exactitud:0.81,precision:0.802,sensibilidad:0.777,puntuacion_F1:0.786},
                 {modelo:'KNN',exactitud:0.775,precision:0.754,sensibilidad:0.742,puntuacion_F1:0.747},
                 {modelo:'Neural Networks',exactitud:0.811,precision:0.801,sensibilidad:0.796,puntuacion_F1:0.798},
                 {modelo:'Decision Trees',exactitud:0.782,precision:0.769,sensibilidad:0.768,puntuacion_F1:0.768},
                 {modelo:'AdaBoost',exactitud:0.823,precision:0.815,sensibilidad:0.809,puntuacion_F1:0.812},
                 {modelo:'Regresión Logística',exactitud:0.833,precision:0.825,sensibilidad:0.82,puntuacion_F1:0.822},
                 {modelo:'Gradient Boosting',exactitud:0.835,precision:0.815,sensibilidad:0.815,puntuacion_F1:0.82},
                 {modelo:'Extra Trees',exactitud:0.847,precision:0.839,sensibilidad:0.834,puntuacion_F1:0.836},
                 {modelo:'Random Forest',exactitud:0.849,precision:0.842,sensibilidad:0.837,puntuacion_F1:0.839},
                 {modelo:'LightGBM',exactitud:0.854,precision:0.846,sensibilidad:0.846,puntuacion_F1:0.846},
                 {modelo:'XGBoost',exactitud:0.851,precision:0.843,sensibilidad:0.842,puntuacion_F1:0.842},
                 {modelo:'XGBoost Optimizado',exactitud:0.856,precision:0.848,sensibilidad:0.848,puntuacion_F1:0.847}]
    this.service.obtenerDF().subscribe(
      result => {
        this.dataframe = JSON.parse(result.dataframe);
        this.dataRows = Object.values(this.dataframe).slice(0, 5); 
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
        responsive:true,
        maintainAspectRatio:false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
}
