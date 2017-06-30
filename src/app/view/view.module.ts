import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { TagViewerComponent } from './tag-viewer/tag-viewer.component';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
@NgModule({
  imports: [
    CommonModule,
    ViewRoutingModule
  ],
  declarations: [
    TagViewerComponent,
    ReportViewerComponent
  ]
})
export class ViewModule { }
