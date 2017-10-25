import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { CoreModule } from './../core/core.module';
import { HomeRoutingModule } from './home-routing.module';
import {SharedModule} from './../shared/shared.module';
// import { MaterialModule , MdDialog  } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatDialogModule, MatMenuModule, MatDialog, MatToolbarModule, MatButtonModule, MatCardModule} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    HomeRoutingModule,
    // MaterialModule.forRoot(),
    FlexLayoutModule,
    MatDialogModule,
    MatToolbarModule,
    MatCardModule,
    SharedModule

  ],
  declarations: [
    HomepageComponent
  ]
})
export class HomeModule { }
