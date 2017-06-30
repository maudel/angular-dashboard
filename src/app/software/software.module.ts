import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedundancyComponent } from './redundancy/redundancy.component';
import { ReportsComponent } from './reports/reports.component';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareComponent } from './software.component';
import {MdToolbarModule, MdButtonModule, MdInputModule, MdSliderModule, MdSlideToggleModule, MdTabsModule, MdIconModule, MdSidenavModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SoftwareRoutingModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdTabsModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdInputModule
  ],
  declarations: [
    RedundancyComponent,
    RulesEngineComponent,
    ReportsComponent,
    SoftwareComponent
  ]
})
export class SoftwareModule { }
