import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusRoutingModule } from './status-routing.module';
import { StatusComponent } from './status.component';
import { ReaderStatisticsComponent } from './reader-statistics/reader-statistics.component';
import { ENodesStatisticsComponent } from './e-nodes-statistics/e-nodes-statistics.component';
import { AleStatisticsComponent } from './ale-statistics/ale-statistics.component';
import { SensorsStatisticsComponent } from './sensors-statistics/sensors-statistics.component';
import {MatToolbarModule, MatTableModule, MatButtonModule, MatInputModule, MatSliderModule, MatSlideToggleModule,
  MatTabsModule, MatIconModule, MatSidenavModule} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    StatusRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTableModule

  ],
  declarations: [
    StatusComponent,
    ReaderStatisticsComponent,
    SensorsStatisticsComponent,
    AleStatisticsComponent,
    ENodesStatisticsComponent
  ]
})
export class StatusModule { }
