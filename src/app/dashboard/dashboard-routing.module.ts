import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SidenavComponent} from './sidenav/sidenav.component';
import {ReadersComponent} from './readers/readers.component';
import {IoDevicesComponent} from './io-devices/io-devices.component';
import {ZonesComponent} from './zones/zones.component';
import {AntennasComponent} from './antennas/antennas.component';
import {InventoryWizardComponent} from './inventory-wizard/inventory-wizard.component';

// import { AuthGuard } from './core/guards/auth.guard';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: SidenavComponent,
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
  },
];


const appRouting = RouterModule.forChild(APP_ROUTES);

@NgModule({
  imports: [appRouting],
  exports: [RouterModule],
  providers: []
})
export class DashboardRoutingModule {
}

