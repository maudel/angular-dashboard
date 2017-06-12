import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components

import { SigninPageComponent } from './signin-page/signin-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';

@NgModule({
  imports: [
    CommonModule,

  ],

  declarations: [
    SigninPageComponent,
    SignupPageComponent
  ]
})
export class AuthModule { }
