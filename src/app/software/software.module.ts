import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedundancyComponent } from './redundancy/redundancy.component';
import { ReportsComponent } from './reports/reports.component';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import { SoftwareRoutingModule } from './software-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SoftwareRoutingModule
  ],
  declarations: [
    RedundancyComponent,
    RulesEngineComponent,
    ReportsComponent
  ]
})
export class SoftwareModule { }
