import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';

import { GeneralComponent } from './general/general.component';
import { EmailComponent } from './email/email.component';
import { SecurityComponent } from './security/security.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { NetworkComponent } from './network/network.component';
import { SystemComponent } from './system.component';
import {MdToolbarModule,MdButtonModule, MdInputModule, MdSliderModule, MdSlideToggleModule, MdTabsModule, MdIconModule, MdSidenavModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
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
    GeneralComponent,
    EmailComponent,
    SecurityComponent,
    SchedulerComponent,
    NetworkComponent,
    SystemComponent
  ]
})
export class SystemModule { }
