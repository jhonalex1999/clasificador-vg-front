import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
  HostListener,
} from "@angular/core";
import { Service } from "../service/service";
import { Chart, registerables } from "chart.js";
import { TraductorEtiquetas } from "app/utils/traductor-etiquetas";
import { MatTooltip } from "@angular/material/tooltip";
@Component({
  selector: "app-grafica-barras-horizontales",
  templateUrl: "./grafica-barras-horizontales.component.html",
  styleUrls: ["./grafica-barras-horizontales.component.scss"],
})
export class GraficaBarrasHorizontalesComponent implements OnInit {
  @ViewChild(MatTooltip) tooltip: MatTooltip;
  @ViewChild("tooltipIcon") tooltipIcon: ElementRef;
  private dataframe: any[];
  public columnas: string[];
  public columna_selec = "Selecciona una columna primero";
  myChart: Chart<"bar", any[], any>;
  tooltipContent =
    "En este gráfico de barras horizontales interactivo, se ofrece la capacidad de seleccionar una variable específica. Al elegir la variable de interés, la visualización se adapta dinámicamente, mostrando la distribución de las categorías asociadas a esa variable en el eje horizontal. Al desplazar el cursor sobre cada barra, se despliega información detallada, incluyendo los valores numéricos correspondientes a cada categoría. Esta funcionalidad proporciona una herramienta efectiva para explorar y comparar la distribución de una variable particular, facilitando la identificación de patrones y tendencias dentro de los datos.";
  constructor(private service: Service, private renderer: Renderer2) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.service.obtenerDF().subscribe((result) => {
      this.dataframe = JSON.parse(result.dataframe);
      this.columnas = Object.keys(this.dataframe[0]);
      if (this.columna_selec != "Selecciona una columna primero") {
        this.crearGraficaBarrasHorizontal(this.columna_selec);
      }
    });
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

  actualizarGraficaHorizontal() {
    console.log("se llama actualizar");
    if (this.myChart) {
      this.myChart.destroy(); // Destruye la gráfica anterior si existe
    }
    this.crearGraficaBarrasHorizontal(this.columna_selec);
  }

  private crearGraficaBarrasHorizontal(columna_selec: string) {
    const data = this.dataframe;
    console.log(this.dataframe);
    console.log(columna_selec);

    // Obtener los valores únicos de la columna seleccionada
    const eje1 = Array.from(new Set(data.map((item) => item[columna_selec])));

    // Contar el número de registros por valor de la columna seleccionada
    const contador = new Map();
    data.forEach((item) => {
      const clave = item[columna_selec];
      contador.set(clave, (contador.get(clave) || 0) + 1);
    });

    // Preparar los datos para el gráfico de líneas horizontales
    const datos = eje1.map((valor) => ({
      valor,
      count: contador.get(valor) || 0,
    }));

    // Ordenar los datos por valor ascendente
    datos.sort((a, b) => a.valor - b.valor);

    // Obtener los valores y etiquetas
    const etiquetas = datos.map((item) => item.valor);
    const valores = datos.map((item) => item.count);

    const htmlLegendPlugin = {
      id: "htmlLegend",
      afterUpdate: (chart, args, options) => {
        // Cambio a función de flecha
        this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
      },
    };

    // Crear el gráfico de líneas horizontales
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: eje1.map((valor, index) => {
          const dataPorValor = datos.find((item) => item.valor === valor);
          const data = etiquetas.map((etiqueta) =>
            etiqueta === valor ? dataPorValor?.count || 0 : 0
          );
          return {
            label: valor,
            data: data,
            backgroundColor: this.getRandomColorWithOpacity(0.5),
            hidden: false,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Gráfica de Barras Horizontales de la columna '${columna_selec}'`,
            font: {
              size: 18,
            },
          },
          legend: {
            display: false,
            onClick: function (event, legendItem) {
              const dataset = this.chart.data.datasets[legendItem.datasetIndex];
              dataset.hidden = !dataset.hidden;
              this.chart.update();
            },
          },
          // @ts-ignore
          htmlLegend: {
            containerID: "legend-container",
          },
          datalabels: {
            display: false,
          },
        },
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
            stacked: true, // Apilar las barras para evitar espacio en blanco
          },
          x: {
            stacked: true,
          },
        },
      },
      plugins: [htmlLegendPlugin],
    });
  }
  // Función para obtener o crear la lista de elementos de la leyenda HTML personalizada
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

  // Función para crear los elementos de la leyenda HTML personalizada
  createCustomLegendItems = (chart, options) => {
    const ul = this.getOrCreateLegendList(chart, options.containerID);

    // Limpiar los elementos de la leyenda anteriores
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Obtener las etiquetas personalizadas de la columna seleccionada
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    // Ordenar las etiquetas alfabéticamente o numéricamente
    items.sort((a, b) => {
      if (typeof a.text === "string" && typeof b.text === "string") {
        return a.text.localeCompare(b.text); // Orden alfabético
      } else if (typeof a.text === "number" && typeof b.text === "number") {
        return a.text - b.text; // Orden numérico ascendente
      }
      return 0; // No se cambia el orden si los tipos son diferentes
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

  private filtrarEtiquetas(etiquetas, valores, contador) {
    const otrosEtiqueta = "Otros";

    const etiquetasAgrupadas = etiquetas.filter(
      (etiqueta) => contador.get(etiqueta) < 20
    );

    let totalValoresOtros = 0;
    const valoresFiltrados = valores.filter((valor, index) => {
      if (etiquetasAgrupadas.includes(etiquetas[index])) {
        totalValoresOtros += valor;
        return false;
      }
      return true;
    });

    etiquetas = etiquetas.filter(
      (etiqueta) => !etiquetasAgrupadas.includes(etiqueta)
    );
    valores = valoresFiltrados;

    etiquetas.push(otrosEtiqueta);
    valores.push(totalValoresOtros);

    return { etiquetas, valores };
  }

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
