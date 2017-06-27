import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { CoreModule } from './../core/core.module'
import { HomeRoutingModule } from './home-routing.module'
// import { MaterialModule , MdDialog  } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MdDialogModule, MdMenuModule,MdDialog, MdToolbarModule,MdButtonModule, MdCardModule} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    HomeRoutingModule,
    // MaterialModule.forRoot(),
    FlexLayoutModule,
    MdDialogModule,
    MdToolbarModule,
    MdCardModule

  ],
  declarations: [
    HomepageComponent
  ]
})
export class HomeModule { }
