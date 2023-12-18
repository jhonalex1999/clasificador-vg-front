import { Routes } from "@angular/router";
import { PredictorComponent } from "app/predictor/predictor.component";
import { ModeloInfoComponent } from "app/modelo-info/modelo-info.component";
import { GraficaDonaComponent } from "app/grafica-dona/grafica-dona.component";
import { GraficaBarrasComponent } from "app/grafica-barras/grafica-barras.component";
import { GraficaBarrasHorizontalesComponent } from "app/grafica-barras-horizontales/grafica-barras-horizontales.component";
import { GraficaLineaComponent } from "app/grafica-linea/grafica-linea.component";
export const AdminLayoutRoutes: Routes = [
  { path: "predictor", component: PredictorComponent },
  { path: "grafica-dona", component: GraficaDonaComponent },
  { path: "grafica-barras", component: GraficaBarrasComponent },
  { path: "grafica-barras-horizontales", component: GraficaBarrasHorizontalesComponent },
  { path: "grafica-linea", component: GraficaLineaComponent },
  { path: "modelo-info", component: ModeloInfoComponent },
];
