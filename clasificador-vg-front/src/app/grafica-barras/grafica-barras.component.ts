import { Component, OnInit, ElementRef, Renderer2, ViewChild ,HostListener} from "@angular/core";
import { Service } from "../service/service";
import { Chart, registerables } from "chart.js";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: "app-grafica-barras",
  templateUrl: "./grafica-barras.component.html",
  styleUrls: ["./grafica-barras.component.scss"],
})
export class GraficaBarrasComponent implements OnInit {
  @ViewChild(MatTooltip) tooltip: MatTooltip;
  @ViewChild("tooltipIcon") tooltipIcon: ElementRef;
  private dataframe: any[];
  public columnas: string[];
  public columna1_selec: string = "Selecciona una columna primero";
  public columna2_selec: string = "Selecciona una columna primero";
  tooltipContent =
    "En este gráfico de barras verticales interactivo, se presenta la opción de seleccionar dos variables. Al elegir las variables de interés, la visualización se ajusta dinámicamente, proporcionando un análisis comparativo entre las dos categorías seleccionadas. Al pasar el cursor sobre cada barra, se muestra la información detallada, incluyendo los valores numéricos asociados a cada categoría. Esta funcionalidad brinda una herramienta efectiva para explorar las relaciones y tendencias entre las dos variables seleccionadas, permitiendo una comprensión más profunda de la distribución y la interacción entre los datos.";
  originalData = null;
  lastSelectedColumns = { columna1: null, columna2: null };
  myChart: Chart<"bar", any[], any>;

  constructor(private service: Service, private renderer: Renderer2) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.service.obtenerDF().subscribe((result) => {
      this.dataframe = JSON.parse(result.dataframe);
      this.columnas = Object.keys(this.dataframe[0]);
      if (
        this.columna1_selec !== "Selecciona una columna primero" ||
        this.columna2_selec !== "Selecciona una columna primero"
      ) {
        this.crearGraficoBarras(this.columna1_selec, this.columna2_selec);
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
  actualizarGrafica() {
    console.log("se llama actualizar");
    if (this.myChart) {
      this.myChart.destroy(); // Destruye la gráfica anterior si existe
    }
    if (
      this.columna1_selec !== "Selecciona una columna primero" &&
      this.columna2_selec !== "Selecciona una columna primero"
    ) {
      this.crearGraficoBarras(this.columna1_selec, this.columna2_selec);
    }
  }

  private crearGraficoBarras(columna1_selec: string, columna2_selec: string) {
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

    // Generar una lista de colores aleatorios
    const colores = this.generarColoresAleatorios(valores.length);

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

    // Crear el gráfico de barras
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: eje2.map((item, index) => ({
          label: item,
          data: valores[index],
          backgroundColor: this.getRandomColorWithOpacity(0.5),
          borderWidth: 1,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: columna1_selec.length > 5 || columna2_selec.length > 5 ? `Gráfica de Barras verticales de la columna '${columna1_selec}' - '${columna2_selec}'` : `Gráfica de Líneas de la columna '${columna1_selec}' - '${columna2_selec}'`,
            font: {
              size: 18 
            }
          },
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
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              maxTicksLimit: 5,
            },
          },
          x: {
            title: {
              display: true,
              text: columna1_selec + " - " + columna2_selec,
            },
          },
        },
      },
      plugins: [htmlLegendPlugin1, htmlLegendPlugin2],
    });
  }

  private getRandomColorWithOpacity(opacity: number) {
    const getRandomHex = () => Math.floor(Math.random() * 256).toString(16);

    let color;
    do {
      color = `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;
    } while (parseInt(color.substr(1), 16) < parseInt("444444", 16));

    return `${color}${Math.round(opacity * 255).toString(16)}`;
  }

  private generarColoresAleatorios(cantidad: number): string[] {
    const colores = [];
    for (let i = 0; i < cantidad; i++) {
      const color = this.generarColorAleatorio();
      colores.push(color);
    }
    return colores;
  }

  private generarColorAleatorio(): string {
    const letras = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
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

    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.sort((a, b) => {
      if (typeof a.text === "string" && typeof b.text === "string") {
        return a.text.localeCompare(b.text);
      } else if (typeof a.text === "number" && typeof b.text === "number") {
        return a.text - b.text;
      }
      return 0;
    });

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

      const boxSpan = document.createElement("span");
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.flexShrink = "0";
      boxSpan.style.height = "20px";
      boxSpan.style.marginRight = "10px";
      boxSpan.style.width = "20px";

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
