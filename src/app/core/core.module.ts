import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from 'angularfire2';

// services

import { AuthService} from './services/auth.service'
import { AttendantService } from './services/attendant.service'
import { ItemsService } from './services/items.service'
import { GenericService } from './services/generic.service'
import { ZonesService } from './services/zones.service'
import { ReadersConfigurationService } from './services/readers-configuration.service'
// http related

import { HttpModule, RequestOptions } from '@angular/http';

import { StoreModule } from '@ngrx/store';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyAW6_gady9XHegVN94Cs8oTpOzM978BJ04",
  authDomain: "angularmcon.firebaseapp.com",
  databaseURL: "https://angularmcon.firebaseio.com",
  storageBucket: "angularmcon.appspot.com",
  messagingSenderId: "850875400239"
};

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  declarations: [

  ],
  providers: [
    GenericService,
    ReadersConfigurationService,
    ZonesService,
    ItemsService,
    AttendantService,
    AuthService
  ]
})
export class CoreModule { }
