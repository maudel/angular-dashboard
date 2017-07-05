import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagViewerComponent } from './tag-viewer/tag-viewer.component';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'about'
},
  {
    path: 'tag-viewer',
    component: TagViewerComponent
  }, {
    path: 'report-viewer',
    component: ReportViewerComponent
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }
