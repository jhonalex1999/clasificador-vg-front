import { Component, OnInit ,  ElementRef, Renderer2, ViewChild,HostListener} from "@angular/core";
import { Service } from "../service/service";
import { RegistroDto } from "app/dto/registro-dto";
import { Chart, registerables } from "chart.js";
import { NgFor } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TraductorEtiquetas } from "app/utils/traductor-etiquetas";
import { MatTooltip } from '@angular/material/tooltip';
@Component({
  selector: "app-grafica-dona",
  templateUrl: "./grafica-dona.component.html",
  styleUrls: ["./grafica-dona.component.scss"],
})
export class GraficaDonaComponent implements OnInit {
  @ViewChild(MatTooltip) tooltip: MatTooltip;
  @ViewChild('tooltipIcon') tooltipIcon: ElementRef;
  public registroDTO: RegistroDto;
  public definicion: any;
  public prediccion: any;
  private dataframe: any[];
  public columnas: string[];
  public columna_selec = 'Selecciona una columna primero';
  myChart: Chart<"doughnut", any[], any>;
  tooltipContent = 'En esta gráfica de dona, al seleccionar una variable específica, se habilita la visualización detallada de la cantidad de registros asociados a cada valor de la variable. Al desplazar el puntero sobre cada porción, se revela el número exacto de registros correspondientes a esa categoría. Esta funcionalidad permite una exploración más detallada y una comprensión precisa de la distribución de datos, brindando una experiencia interactiva que facilita la identificación de patrones y la toma de decisiones informada basada en los valores numéricos asociados a cada valor de la variable seleccionada.';

  constructor(private service: Service,private renderer: Renderer2) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.service.obtenerDF().subscribe((result) => {
      this.dataframe = JSON.parse(result.dataframe);
      this.columnas = Object.keys(this.dataframe[0]);
      console.log(this.columnas);
      if(this.columna_selec != 'Selecciona una columna primero'){
        this.crearGraficaQueso(this.columna_selec);
      }
    });
  }
  @HostListener('window:beforeunload', ['$event'])
  @HostListener('window:pagehide', ['$event'])
  beforeunloadHandler(event: Event) {
    // Borrar la clave del localStorage al cerrar la pestaña
    localStorage.removeItem('primerCarga');
  }
  actualizarGraficaQueso() {
    console.log("se llama actualizar");
    if (this.myChart) {
      this.myChart.destroy(); // Destruye la gráfica anterior si existe
    }
    this.crearGraficaQueso(this.columna_selec);
  }

  private crearGraficaQueso(columna_selec: string) {
    // Obtener los valores
    console.log(this.dataframe);
    TraductorEtiquetas.traducirColumnas(this.dataframe);
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

    if (columna_selec === "nom_upgd") {
      const { etiquetas: nuevasEtiquetas, valores: nuevosValores } =
        this.filtrarEtiquetas(etiquetas, valores, contador);
      etiquetas = nuevasEtiquetas;
      valores = nuevosValores;
    }

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

    // Crear la gráfica de queso
    const ctx = document.getElementById("myChart2") as HTMLCanvasElement;
    const chartContainer = document.querySelector(
      ".chart-scroll-container"
    ) as HTMLElement;

    this.myChart = new Chart(ctx, {
      type: "doughnut",
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
  showTooltip() {
    if (!this.tooltip.disabled) {
      this.tooltip.show();
    }
  }

  ngAfterViewInit() {
    this.renderer.listen(this.tooltipIcon.nativeElement, 'click', () => {
      this.showTooltip();
    });
  }
}
