import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusRoutingModule } from './status-routing.module';
import { StatusComponent } from './status.component';
import { ReaderStatisticsComponent } from './reader-statistics/reader-statistics.component';

@NgModule({
  imports: [
    CommonModule,
    StatusRoutingModule,

  ],
  declarations: [StatusComponent,
    ReaderStatisticsComponent]
})
export class StatusModule { }
