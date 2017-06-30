import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReadersComponent} from '../dashboard/readers/readers.component';
import {IoDevicesComponent} from '../dashboard/io-devices/io-devices.component';
import {ZonesComponent} from '../dashboard/zones/zones.component';
import {AntennasComponent} from '../dashboard/antennas/antennas.component';
import {InventoryWizardComponent} from '../dashboard/inventory-wizard/inventory-wizard.component';

const routes: Routes = [{
  path: '',
  component: ReadersComponent,
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
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HardwareRoutingModule { }
