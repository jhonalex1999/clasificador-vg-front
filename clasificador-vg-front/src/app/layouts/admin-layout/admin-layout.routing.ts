import { Routes } from "@angular/router";
import { PredictorComponent } from "app/predictor/predictor.component";
import { ModeloInfoComponent } from "app/modelo-info/modelo-info.component";
import { GraficaCircularComponent } from "app/grafica-circular/grafica-circular.component";
import { GraficaBarrasComponent } from "app/grafica-barras/grafica-barras.component";
import { GraficaBarrasHorizontalesComponent } from "app/grafica-barras-horizontales/grafica-barras-horizontales.component";
import { GraficaDispersionComponent } from "app/grafica-dispersion/grafica-dispersion.component";
export const AdminLayoutRoutes: Routes = [
  { path: "predictor", component: PredictorComponent },
  { path: "grafica-circular", component: GraficaCircularComponent },
  { path: "grafica-barras", component: GraficaBarrasComponent },
  { path: "grafica-barras-horizontales", component: GraficaBarrasHorizontalesComponent },
  { path: "grafica-dispersion", component: GraficaDispersionComponent },
  { path: "modelo-info", component: ModeloInfoComponent },
];
