import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardNavbarComponent } from './dashboard-navbar/dashboard-navbar.component'
import { MdToolbarModule,MdMenuModule, MdButtonModule,MdIconModule } from '@angular/material';
import { NavbarComponent } from './navbar/navbar.component';
// import { MaterialModule , MdDialog  } from '@angular/material';
import {RouterModule} from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule.forRoot(),
    MdToolbarModule,
    RouterModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    FlexLayoutModule
  ],
  declarations: [
    DashboardNavbarComponent,
    NavbarComponent
  ],
  exports: [
    DashboardNavbarComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
