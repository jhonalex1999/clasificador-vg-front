import { Component, OnInit } from "@angular/core";
import { Service } from "../service/service";
import { Chart, registerables } from "chart.js";

@Component({
  selector: "app-grafica-barras",
  templateUrl: "./grafica-barras.component.html",
  styleUrls: ["./grafica-barras.component.scss"],
})
export class GraficaBarrasComponent implements OnInit {
  private dataframe: any[];
  public columnas: string[];

  public columna1_selec: string;
  public columna2_selec: string;

  myChart: Chart<"bar", any[], any>;

  constructor(private service: Service) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.service.obtenerDF().subscribe((result) => {
      this.dataframe = JSON.parse(result.dataframe);
      this.columnas = Object.keys(this.dataframe[0]);
      this.crearGraficoBarras(this.columna1_selec, this.columna2_selec);
    });
  }

  actualizarGrafica() {
    console.log("se llama actualizar");
    if (this.myChart) {
      this.myChart.destroy(); // Destruye la gráfica anterior si existe
    }
    this.crearGraficoBarras(this.columna1_selec, this.columna2_selec);
  }

  private crearGraficoBarras(columna1_selec: string, columna2_selec: string) {
    const data = this.dataframe;
    console.log(this.dataframe);
    console.log(columna1_selec);
    console.log(columna2_selec);
    // Obtener los valores únicos de grupo edad edad y sexo
    const eje1 = Array.from(new Set(data.map((item) => item[columna1_selec])));
    const eje2 = Array.from(new Set(data.map((item) => item[columna2_selec])));

    // Contar el número de registros por combinación de edad y sexo
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

    // Ordenar los datos por edad ascendente
    datos.sort((a, b) => a.columna1_selec - b.columna2_selec);

    // Obtener los valores de edad y sexos
    const etiquetas = datos.map((item) => item.columna1_selec);
    const valores = eje2.map((columna2_selec) =>
      datos.map((item) => item[columna2_selec])
    );

    // Generar una lista de colores aleatorios
    const colores = this.generarColoresAleatorios(valores.length);

    const htmlLegendPlugin = {
      id: "htmlLegend",
      afterUpdate: (chart, args, options) => {
        // Cambio a función de flecha
        this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
      },
    };

    const colors = ["rgba(0, 0, 255, 0.2)", "rgba(0, 128, 0, 0.2)"];

    // Crear el gráfico de barras
    let delayed;
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: eje2.map((sexo, index) => ({
          label: sexo,
          data: valores[index],
          backgroundColor: [colors[index % colors.length]], // Usar colores intercalados
          borderColor: [colors[index % colors.length]], // Usar colores intercalados
          borderWidth: 1,
        })),
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          // @ts-ignore
          htmlLegend: {
            containerID: "legend-container",
          },
        },
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              maxTicksLimit: 5, // Limita el número máximo de etiquetas en el eje Y
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
      plugins: [htmlLegendPlugin],
    });
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

    // Generar elementos de leyenda personalizados
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
}
