import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedundancyComponent } from './redundancy/redundancy.component';
import { ReportsComponent } from './reports/reports.component';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareComponent } from './software.component';
import {MatToolbarModule, MatButtonModule, MatInputModule, MatSliderModule, MatSlideToggleModule, MatTabsModule, MatIconModule, MatSidenavModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SoftwareRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule
  ],
  declarations: [
    RedundancyComponent,
    RulesEngineComponent,
    ReportsComponent,
    SoftwareComponent
  ]
})
export class SoftwareModule { }
