import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusComponent } from './status.component';
import { ReaderStatisticsComponent } from './reader-statistics/reader-statistics.component';
import { ENodesStatisticsComponent } from './e-nodes-statistics/e-nodes-statistics.component';
import { AleStatisticsComponent } from './ale-statistics/ale-statistics.component';
import { SensorsStatisticsComponent } from './sensors-statistics/sensors-statistics.component';
const routes: Routes = [{
  path: '',
  component: StatusComponent,
  children: [{
    path: '',
    redirectTo: 'reader-statistics'
  }, {
    path: 'reader-statistics',
    component: ReaderStatisticsComponent
  }, {
    path: 'sensors-statistics',
    component: ReaderStatisticsComponent
  }, {
    path: 'ale-statistics',
    component: ReaderStatisticsComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
