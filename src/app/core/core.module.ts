import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// services

import { AiaConfigService} from './services/aia-config.service';
import { AuthService} from './services/auth.service'
import { GenericService } from './services/generic.service'
// http related

import { HttpModule, RequestOptions } from '@angular/http';

import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [

  ],
  providers: [
    AiaConfigService,
    GenericService
  ]
})
export class CoreModule { }
