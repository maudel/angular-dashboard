import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatInputModule, MatTabsModule , MatButtonModule,MatSelectModule } from '@angular/material';
import { SharedModule  } from './../shared/shared.module';

// Components

import { SigninPageComponent } from './signin-page/signin-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    AppRoutingModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    SharedModule

  ],

  declarations: [
    SigninPageComponent,
    SignupPageComponent,
    AuthComponent
  ]
})
export class AuthModule { }
