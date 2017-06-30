import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedundancyComponent } from './redundancy/redundancy.component';
import { ReportsComponent } from './reports/reports.component';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import {SoftwareComponent} from './software.component'
const routes: Routes = [{
  path: '',
  component: SoftwareComponent,
  children: [{
    path: '',
    redirectTo: 'redundancy',
  },
    {
      path: 'redundancy',
      component: RedundancyComponent
    }, {
      path: 'reports',
      component: ReportsComponent
    }, {
      path: 'rules-engine',
      component: RulesEngineComponent
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoftwareRoutingModule { }
