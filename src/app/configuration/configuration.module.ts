import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import {MdToolbarModule, MdButtonModule, MdTableModule, MdInputModule, MdSliderModule, MdSlideToggleModule, MdTabsModule, MdIconModule, MdSidenavModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdTabsModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdInputModule,
    MdTableModule
  ],
  declarations: [ConfigurationComponent]
})
export class ConfigurationModule { }
