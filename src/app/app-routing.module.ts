import {ModuleWithProviders, NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GenericFormComponent} from './generic-form/generic-form.component'
import {SidenavComponent} from './sidenav/sidenav.component';
import {Routes, RouterModule} from '@angular/router';
import {ComponentNavbarComponent} from './component-navbar/component-navbar.component'
import {HomepageComponent} from './homepage/homepage.component'
import {ReadersComponent} from './readers/readers.component'
import {IoDevicesComponent} from './io-devices/io-devices.component'
import {ZonesComponent} from './zones/zones.component'
import {AntennasComponent} from './antennas/antennas.component'
import {InventoryWizardComponent} from './inventory-wizard/inventory-wizard.component'
const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
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
  }, {
    path: '',
    component: HomepageComponent
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
  providers: []
})
export class AppRoutingModule {
}
