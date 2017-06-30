import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReaderStatisticsComponent } from './reader-statistics/reader-statistics.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'reader-statistics'
},{
  path: 'reader-statistics',
  component: ReaderStatisticsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
