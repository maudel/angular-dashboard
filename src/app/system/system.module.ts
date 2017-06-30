import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';

import { GeneralComponent } from './general/general.component';
import { EmailComponent } from './email/email.component';
import { SecurityComponent } from './security/security.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { NetworkComponent } from './network/network.component';
@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule
  ],
  declarations: [
    GeneralComponent,
    EmailComponent,
    SecurityComponent,
    SchedulerComponent,
    NetworkComponent
  ]
})
export class SystemModule { }
