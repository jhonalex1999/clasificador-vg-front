import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
  HostListener
} from "@angular/core";
import { Service } from "../service/service";
import { RegistroDto } from "app/dto/registro-dto";
import { Chart, registerables } from "chart.js";
import { TraductorEtiquetas } from "app/utils/traductor-etiquetas";
import { type } from "os";
import { MatTooltip } from "@angular/material/tooltip";
@Component({
  selector: "app-grafica-dispersion",
  templateUrl: "./grafica-linea.component.html",
  styleUrls: ["./grafica-linea.component.scss"],
})
export class GraficaLineaComponent implements OnInit {
  @ViewChild(MatTooltip) tooltip: MatTooltip;
  @ViewChild("tooltipIcon") tooltipIcon: ElementRef;
  public columnas: string[];
  private dataframe: any[];
  originalData = null;
  lastSelectedColumns = { columna1: null, columna2: null };
  public columna1_selec = "Selecciona una columna primero";
  public columna2_selec = "Selecciona una columna primero";

  tooltipContent =
    "En este gráfico de líneas interactivo, se proporciona la flexibilidad de seleccionar dos variables específicas para explorar su relación entre sí. Al elegir las variables de interés, las líneas se ajustan dinámicamente, permitiendo visualizar cómo cambian en función de las variables seleccionadas. Esto facilita la identificación de tendencias, patrones o correlaciones entre las dos variables. Al pasar el cursor sobre puntos específicos en las líneas, se despliega información detallada, incluyendo los valores exactos de ambas variables en ese punto. Esta funcionalidad es esencial para comprender la relación y la interacción entre las dos variables seleccionadas.";

  linearChart: any;
  public columnasIndep: string[];

  constructor(private service: Service, private renderer: Renderer2) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.service.obtenerDF().subscribe((result) => {
      const valoresPermitidos = [
        "semana",
        "año",
        "pac_hospitalizado",
        "condicion final",
        "naturaleza",
        "actividad",
        "edad_agre",
        "sustancias vict",
        "escenario",
        "sivigila",
        "trimestre",
      ];

      this.dataframe = JSON.parse(result.dataframe);
      this.columnas = Object.keys(this.dataframe[0]);
      this.columnasIndep = Object.keys(this.dataframe[0]);
      if (
        this.columna1_selec !== "Selecciona una columna primero" ||
        this.columna2_selec !== "Selecciona una columna primero"
      ) {
        this.crearGraficoLinea(this.columna1_selec, this.columna2_selec);
      }
    });
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
  actualizarGraficoLinear() {
    console.log("se llama actualizar");
    if (this.linearChart) {
      this.linearChart.destroy(); // Destruye la gráfica anterior si existe
    }
    if (
      this.columna1_selec !== "Selecciona una columna primero" &&
      this.columna2_selec !== "Selecciona una columna primero"
    ) {
      this.crearGraficoLinea(this.columna1_selec, this.columna2_selec);
    }
  }

  private generarColorAleatorio(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private crearGraficoLinea(columna1_selec: string, columna2_selec: string) {
    TraductorEtiquetas.traducirColumnas(this.dataframe);
    const data = this.dataframe;
    console.log(this.dataframe);
    console.log(columna1_selec);
    console.log(columna2_selec);

    // Obtener los valores únicos de los ejes
    const eje1 = Array.from(new Set(data.map((item) => item[columna1_selec])));
    const eje2 = Array.from(new Set(data.map((item) => item[columna2_selec])));

    // Contar el número de registros por combinación de ejes
    const contador = new Map();
    data.forEach((item) => {
      const clave = item[columna1_selec] + "-" + item[columna2_selec];
      contador.set(clave, (contador.get(clave) || 0) + 1);
    });

    // Preparar los datos para el gráfico de barras
    const datos = [];
    eje1.forEach((columna1_selec) => {
      const fila = { columna1_selec };
      eje2.forEach((columna2_selec) => {
        const clave = columna1_selec + "-" + columna2_selec;
        fila[columna2_selec] = contador.get(clave) || 0;
      });
      datos.push(fila);
    });

      // Ordenar los datos por la primera columna
    datos.sort((a, b) => a.columna1_selec - b.columna2_selec);

     // Obtener los valores de los ejes
    const etiquetas = datos.map((item) => item.columna1_selec);
    const valores = eje2.map((columna2_selec) =>
      datos.map((item) => item[columna2_selec])
    );

    const htmlLegendPlugin1 = {
      id: "htmlLegend1",
      afterUpdate: (chart, args, options) => {
        this.createCustomLegendItems(chart, options); 
      },
    };
    const htmlLegendPlugin2 = {
      id: "htmlLegend2",
      afterUpdate: (chart, args, options) => {
        this.createCustomLegendItems2(chart, options);
      },
    };

    const color = this.getRandomColorWithOpacity(0.2); // Color aleatorio con opacidad 0.2
    
    // Create the scatter plot
    const ctx = document.getElementById("linearChart") as HTMLCanvasElement;
    // Cambiar el tipo de gráfico a 'line'
    this.linearChart = new Chart(ctx, {
      type: "line", // Cambiado a tipo de gráfico de líneas
      data: {
        labels: etiquetas,
        datasets: eje2.map((item, index) => {
          const color = this.getRandomColorWithOpacity(0.5); // Color aleatorio con opacidad 0.2

          return {
            label: item,
            data: valores[index],
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            fill: true,
            tension: 0.4,
            spanGaps: true,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          // @ts-ignore
          htmlLegend1: {
            containerID: "legend-container-1",
          },
          htmlLegend2: {
            containerID: "legend-container-2",
          },
          datalabels: {
            display: false, 
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: columna1_selec + ' - ' + columna2_selec,
            },
          },
          y: {
            title: {
              display: false,
            },
          },
        },
      },
      plugins: [htmlLegendPlugin1, htmlLegendPlugin2],
    });
  }

  getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector("ul");

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

  createCustomLegendItems = (chart, options) => {
    const ul = this.getOrCreateLegendList(chart, options.containerID);

    // Limpiar los elementos de la leyenda anteriores
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item) => {
      const li = document.createElement("li");
      li.style.alignItems = "center";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.marginLeft = "10px";

      li.onclick = () => {
        const { type } = chart.config;
        if (type === "pie" || type === "doughnut") {
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement("span");
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.flexShrink = "0";
      boxSpan.style.height = "20px";
      boxSpan.style.marginRight = "10px";
      boxSpan.style.width = "20px";

      // Texto
      const textContainer = document.createElement("p");
      textContainer.style.color = item.fontColor;
      textContainer.style.margin = "0";
      textContainer.style.padding = "0";
      textContainer.style.textDecoration = item.hidden ? "line-through" : "";

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  };

  private getRandomColorWithOpacity(opacity: number) {
    const getRandomHex = () => Math.floor(Math.random() * 256).toString(16);

    let color;
    do {
      color = `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;
    } while (
      // Excluir colores oscuros (tonos de marrón, morado oscuro y negro)
      parseInt(color.substr(1), 16) < parseInt("444444", 16)
    );

    return `${color}${Math.round(opacity * 255).toString(16)}`;
  }

  createCustomLegendItems2 = (chart, options) => {
    const ul = this.getOrCreateLegendList(chart, options.containerID);

    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    if (
      this.originalData === null ||
      this.lastSelectedColumns.columna1 !== this.columna1_selec ||
      this.lastSelectedColumns.columna2 !== this.columna2_selec
    ) {
      this.originalData = chart.data.datasets.map((dataset) => [
        ...dataset.data,
      ]);
      // Actualiza las últimas columnas seleccionadas
      this.lastSelectedColumns.columna1 = this.columna1_selec;
      this.lastSelectedColumns.columna2 = this.columna2_selec;
    }

    const labels = chart.data.labels;

    labels.forEach((label, index) => {
      const li = document.createElement("li");
      li.style.alignItems = "center";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.marginLeft = "10px";

      li.onclick = () => {
        chart.data.datasets.forEach((dataset) => {
          const datasetIndex = chart.data.datasets.indexOf(dataset);

          if (dataset.data[index] === null) {
            dataset.data[index] = this.originalData[datasetIndex][index];
          } else {
            dataset.data[index] = null;
          }
        });

        chart.update();
      };

      
      const textContainer = document.createElement("p");
      textContainer.style.color = label.fontColor;
      textContainer.style.margin = "0";
      textContainer.style.padding = "0";
      textContainer.style.textDecoration = chart.data.datasets.some(dataset => dataset.data[index] === null) ? "line-through" : "";
      const text = document.createTextNode(label);
      textContainer.appendChild(text);

      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  };
  showTooltip() {
    if (!this.tooltip.disabled) {
      this.tooltip.show();
    }
  }

  ngAfterViewInit() {
    this.renderer.listen(this.tooltipIcon.nativeElement, "click", () => {
      this.showTooltip();
    });
  }
}
