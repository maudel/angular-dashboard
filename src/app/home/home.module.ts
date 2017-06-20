import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { CoreModule } from './../core/core.module'
import { HomeRoutingModule } from './home-routing.module'
import { MaterialModule , MdDialog  } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    HomeRoutingModule,
    MaterialModule.forRoot(),
    FlexLayoutModule


  ],
  declarations: [
    HomepageComponent
  ]
})
export class HomeModule { }
