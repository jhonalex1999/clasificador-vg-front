import { Component, OnInit } from "@angular/core";
import { Service } from "../service/service";
import { RegistroDto } from "app/dto/registro-dto";
import { Chart, registerables } from "chart.js";
import { TraductorEtiquetas } from "app/utils/traductor-etiquetas";
import { type } from "os";

@Component({
  selector: "app-grafica-dispersion",
  templateUrl: "./grafica-linea.component.html",
  styleUrls: ["./grafica-linea.component.scss"],
})
export class GraficaLineaComponent implements OnInit {
  public columnas: string[];
  private dataframe: any[];

  public columna1_selec: string;
  public columna2_selec: string;

  linearChart: any;
  public columnasIndep: string[];

  constructor(private service: Service) {}

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
      this.crearGraficoLinea(this.columna1_selec, this.columna2_selec);
    });
  }

  actualizarGraficoLinear() {
    console.log("se llama actualizar");
    if (this.linearChart) {
      this.linearChart.destroy(); // Destruye la gráfica anterior si existe
    }
    this.crearGraficoLinea(this.columna1_selec, this.columna2_selec);
  }

  private generarColorAleatorio(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private crearGraficoLinea(
    columna1_selec: string,
    columna2_selec: string
  ) {
    TraductorEtiquetas.traducirColumnas(this.dataframe);
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

    const htmlLegendPlugin = {
      id: "htmlLegend",
      afterUpdate: (chart, args, options) => {
        // Cambio a función de flecha
        this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
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
        datasets: eje2.map((sexo, index) => {
          const color = this.getRandomColorWithOpacity(0.5); // Color aleatorio con opacidad 0.2

          return {
            label: sexo,
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
          htmlLegend: {
            containerID: "legend-container",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: columna1_selec,
            },
          },
          y: {
            title: {
              display: true,
              text: columna2_selec,
            },
          },
        },
      },
      plugins: [htmlLegendPlugin],
    });
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

    console.log(items);

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

function retornarEtiqueta(sexo: any): any {
  console.log();
  if (sexo === "semana") {
    return "prueba";
  }
}
