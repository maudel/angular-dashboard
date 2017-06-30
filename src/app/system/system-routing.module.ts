import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SystemComponent} from './system.component';
import { GeneralComponent } from './general/general.component';
import { EmailComponent } from './email/email.component';
import { SecurityComponent } from './security/security.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { NetworkComponent } from './network/network.component';
const routes: Routes = [{
  path: '',
  component: SystemComponent,
  children: [{
    path: '',
    redirectTo: 'general',
  },
    {
      path: 'general',
      component: GeneralComponent
    }, {
      path: 'email',
      component: EmailComponent
    }, {
      path: 'security',
      component: SecurityComponent
    }, {
      path: 'scheduler',
      component: SchedulerComponent
    }, {
      path: 'network',
      component: NetworkComponent
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
