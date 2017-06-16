import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule , MdDialog  } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Components

import { SigninPageComponent } from './signin-page/signin-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule.forRoot(),
    FormsModule,
    FlexLayoutModule

  ],

  declarations: [
    SigninPageComponent,
    SignupPageComponent,
    AuthComponent
  ]
})
export class AuthModule { }
