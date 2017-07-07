import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReadersComponent} from '../dashboard/readers/readers.component';
import {IoDevicesComponent} from '../dashboard/io-devices/io-devices.component';
import {ZonesComponent} from '../dashboard/zones/zones.component';
import {AntennasComponent} from '../dashboard/antennas/antennas.component';
import {InventoryWizardComponent} from '../dashboard/inventory-wizard/inventory-wizard.component';
import { HardwareRoutingModule } from './hardware-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import {DataSource} from '@angular/cdk';
import {MdToolbarModule, MdTableModule, MdButtonModule, MdInputModule, MdSliderModule, MdSlideToggleModule, MdTabsModule, MdIconModule, MdSidenavModule} from '@angular/material';
import { HardwareComponent } from './hardware.component';

@NgModule({
  imports: [
    CommonModule,
    HardwareRoutingModule,
    NgxDatatableModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdTabsModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdInputModule,
    FormsModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    MdTabsModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdInputModule,
    MdTableModule


  ],
  declarations: [
    IoDevicesComponent,
    ZonesComponent,
    InventoryWizardComponent,
    AntennasComponent,
    ReadersComponent,
    HardwareComponent
  ]
})
export class HardwareModule { }
