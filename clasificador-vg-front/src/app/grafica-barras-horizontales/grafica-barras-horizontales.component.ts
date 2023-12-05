import { Component, OnInit } from "@angular/core";
import { Service } from "../service/service";
import { Chart, registerables } from "chart.js";
import { TraductorEtiquetas } from "../utils/traductor-etiquetas";

@Component({
  selector: "app-grafica-barras-horizontales",
  templateUrl: "./grafica-barras-horizontales.component.html",
  styleUrls: ["./grafica-barras-horizontales.component.scss"],
})
export class GraficaBarrasHorizontalesComponent implements OnInit {
  private dataframe: any[];
  public columnas: string[];
  public columna_selec: string;
  myChart: Chart<"bar", any[], any>;

  constructor(private service: Service) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.service.obtenerDF().subscribe((result) => {
      this.dataframe = JSON.parse(result.dataframe);
      this.columnas = Object.keys(this.dataframe[0]);
      this.crearGraficaBarrasHorizontal(this.columna_selec);
    });
  }

  actualizarGraficaHorizontal() {
    console.log("se llama actualizar");
    if (this.myChart) {
      this.myChart.destroy(); // Destruye la gráfica anterior si existe
    }
    this.crearGraficaBarrasHorizontal(this.columna_selec);
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
    const labels = chart.data.labels;

    // Separar las etiquetas en dos arrays: uno para las etiquetas alfabéticas y otro para las etiquetas numéricas
    const alphabeticalLabels = [];
    const numericalLabels = [];

    labels.forEach((label) => {
      if (isNaN(label)) {
        alphabeticalLabels.push(label);
      } else {
        numericalLabels.push(Number(label));
      }
    });

    // Ordenar las etiquetas alfabéticas a-z
    alphabeticalLabels.sort();

    // Ordenar las etiquetas numéricas de manera ascendente
    numericalLabels.sort((a, b) => a - b);

    // Combinar las etiquetas ordenadas en un solo array
    const sortedLabels = alphabeticalLabels.concat(numericalLabels);

    labels.forEach((label, index) => {
      const li = document.createElement("li");
      li.style.alignItems = "center";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.marginLeft = "10px";

      // Color box
      const boxSpan = document.createElement("span");
      boxSpan.style.background = chart.data.datasets[0].backgroundColor[index];
      boxSpan.style.borderColor = chart.data.datasets[0].borderColor[index];
      boxSpan.style.borderWidth = chart.data.datasets[0].borderWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.flexShrink = "0";
      boxSpan.style.height = "20px";
      boxSpan.style.marginRight = "10px";
      boxSpan.style.width = "20px";

      // Texto
      const textContainer = document.createElement("p");
      textContainer.style.color = chart.data.datasets[0].fontColor;
      textContainer.style.margin = "0";
      textContainer.style.padding = "0";
      /*textContainer.style.textDecoration = !chart.isDatasetVisible(index)
        ? "line-through"
        : "";*/

      const text = document.createTextNode(label);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  };

  private crearGraficaBarrasHorizontal(columna_selec: string) {
    // Obtener los valores
    console.log("VIEJO")
    console.log(this.dataframe);

    TraductorEtiquetas.traducirColumnas(this.dataframe);

    console.log("NUEVAS");
    console.log(this.dataframe);

    const datos = Array.from(
      new Set(this.dataframe.map((item) => item[columna_selec]))
    );

    // Contar la frecuencia de cada categoría
    const contador = new Map();
    this.dataframe.forEach((item) => {
      contador.set(
        item[columna_selec],
        (contador.get(item[columna_selec]) || 0) + 1
      );
    });

    // Obtener los datos para la gráfica de queso
    let etiquetas = datos;
    let valores = datos.map((x) => contador.get(x));

    // Generar una lista de colores aleatorios
    const colores = this.generarColoresAleatorios(datos.length);

    // Configuración del plugin htmlLegendPlugin
    const htmlLegendPlugin = {
      id: "htmlLegend",
      afterUpdate: (chart, args, options) => {
        // Cambio a función de flecha
        this.createCustomLegendItems(chart, options); // Uso de 'this' correctamente
      },
    };

    // Crear la gráfica de barras
    const ctx = document.getElementById("myChart2") as HTMLCanvasElement;
    const chartContainer = document.querySelector(
      ".chart-scroll-container"
    ) as HTMLElement;

    this.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: etiquetas,
        datasets: [
          {
            data: valores,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive:true,
        maintainAspectRatio:false,
        plugins: {
          legend: {
            display: false,
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          htmlLegend: {
            containerID: "legend-container",
          },
        },
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      plugins: [htmlLegendPlugin],
    });
  }

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
}
