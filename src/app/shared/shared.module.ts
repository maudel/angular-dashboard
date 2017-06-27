import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardNavbarComponent} from './dashboard-navbar/dashboard-navbar.component'
import {MdDialogModule, MdMenuModule,MdDialog, MdToolbarModule,MdButtonModule, MdCardModule, MdInputModule,MdTabsModule, MdIconModule} from '@angular/material';

// import { MaterialModule , MdDialog  } from '@angular/material';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule.forRoot(),
    MdToolbarModule,
    RouterModule
  ],
  declarations: [
    DashboardNavbarComponent
  ],
  exports: [
    DashboardNavbarComponent
  ]
})
export class SharedModule { }
