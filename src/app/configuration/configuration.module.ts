import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import {MatToolbarModule, MatButtonModule, MatTableModule, MatInputModule, MatSliderModule, MatSlideToggleModule, MatTabsModule, MatIconModule, MatSidenavModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTableModule
  ],
  declarations: [ConfigurationComponent]
})
export class ConfigurationModule { }
