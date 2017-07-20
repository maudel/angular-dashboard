import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReadersComponent} from './readers/readers.component';
import {IoDevicesComponent} from './io-devices/io-devices.component';
import {ZonesComponent} from './zones/zones.component';
import {AntennasComponent} from './antennas/antennas.component';
import {InventoryWizardComponent} from './inventory-wizard/inventory-wizard.component';
import {HardwareComponent} from './hardware.component';
const routes: Routes = [{
  path: '',
  component: HardwareComponent,
  children: [{
    path: '',
    redirectTo: 'readers',
  },
    {
      path: 'readers',
      component: ReadersComponent
    }, {
      path: 'zones',
      component: ZonesComponent
    }, {
      path: 'io-devices',
      component: IoDevicesComponent
    }, {
      path: 'antennas',
      component: AntennasComponent
    }, {
      path: 'inventory-wizard',
      component: InventoryWizardComponent
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HardwareRoutingModule {
}
