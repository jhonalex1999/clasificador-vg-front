import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { PredictorComponent } from '../../predictor/predictor.component';
import { GraficaDonaComponent } from '../../grafica-dona/grafica-dona.component';
import { GraficaBarrasComponent } from '../../grafica-barras/grafica-barras.component';
import { GraficaLineaComponent } from '../../grafica-linea/grafica-linea.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';

import { MatDividerModule } from '@angular/material/divider';
import { ModeloInfoComponent } from '../../modelo-info/modelo-info.component';
import { GraficaBarrasHorizontalesComponent } from '../../grafica-barras-horizontales/grafica-barras-horizontales.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ScrollingModule,  
    MatCardModule,
    MatDividerModule  
  ],
  declarations: [
    PredictorComponent,
    GraficaDonaComponent,
    GraficaBarrasComponent,
    GraficaLineaComponent,
    ModeloInfoComponent,
    GraficaBarrasHorizontalesComponent
  ]
})

export class AdminLayoutModule {}
