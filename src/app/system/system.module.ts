import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';

import { GeneralComponent } from './general/general.component';
import { EmailComponent } from './email/email.component';
import { SecurityComponent } from './security/security.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { NetworkComponent } from './network/network.component';
import { SystemComponent } from './system.component';
import {MatToolbarModule, MatButtonModule, MatCardModule, MatRadioModule, MatInputModule, MatSliderModule, MatSlideToggleModule, MatTabsModule, MatIconModule, MatSidenavModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatRadioModule

  ],
  declarations: [
    GeneralComponent,
    EmailComponent,
    SecurityComponent,
    SchedulerComponent,
    NetworkComponent,
    SystemComponent
  ]
})
export class SystemModule { }
