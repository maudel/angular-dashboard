import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReadersComponent} from './readers/readers.component';
import {IoDevicesComponent} from './io-devices/io-devices.component';
import {ZonesComponent} from './zones/zones.component';
import {AntennasComponent} from './antennas/antennas.component';
import {InventoryWizardComponent} from './inventory-wizard/inventory-wizard.component';
import { HardwareRoutingModule } from './hardware-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule, MatTableModule, MatButtonModule, MatInputModule, MatSliderModule, MatSlideToggleModule,
  MatTabsModule, MatIconModule, MatSidenavModule} from '@angular/material';
import { HardwareComponent } from './hardware.component';

@NgModule({
  imports: [
    CommonModule,
    HardwareRoutingModule,
    NgxDatatableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTableModule


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
