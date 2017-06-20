import {ModuleWithProviders, NgModule} from '@angular/core';
import {SidenavComponent} from './sidenav/sidenav.component';
import {Routes, RouterModule} from '@angular/router';
import {ReadersComponent} from './readers/readers.component'
import {IoDevicesComponent} from './io-devices/io-devices.component'
import {ZonesComponent} from './zones/zones.component'
import {AntennasComponent} from './antennas/antennas.component'
import {InventoryWizardComponent} from './inventory-wizard/inventory-wizard.component'

import { AuthGuard } from './core/guards/auth.guard';

const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children: [{
      path: '',
      redirectTo: 'configuration/readers',
      pathMatch: 'full'
    }
      , {
        path: 'configuration/readers',
        component: ReadersComponent
      }, {
        path: 'configuration/zones',
        component: ZonesComponent
      }, {
        path: 'configuration/io-devices',
        component: IoDevicesComponent
      }, {
        path: 'configuration/antennas',
        component: AntennasComponent
      }, {
        path: 'configuration/inventory-wizard',
        component: InventoryWizardComponent
      }]
  }, {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    loadChildren: 'app/home/home.module#HomeModule'
  }, {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  }
];


const appRouting = RouterModule.forRoot(APP_ROUTES, {
  useHash: true,
  // enableTracing: true,
  // preloadingStrategy: PreloadAllModules
});

@NgModule({
  imports: [appRouting],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}

