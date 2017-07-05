import { NgModule } from '@angular/core';
import 'hammerjs';

import { CommonModule } from '@angular/common';
import { DashboardRoutingModule} from './dashboard-routing.module'
// import { ZonesComponent } from './zones/zones.component';
// import { IoDevicesComponent } from './io-devices/io-devices.component';
// import { AntennasComponent } from './antennas/antennas.component';
// import { InventoryWizardComponent } from './inventory-wizard/inventory-wizard.component';
import { SidenavComponent } from './sidenav/sidenav.component';
// import { ReadersComponent } from './readers/readers.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { MaterialModule , MdDialog  } from '@angular/material';
import {MdToolbarModule,MdButtonModule, MdInputModule, MdSliderModule, MdSlideToggleModule, MdTabsModule, MdIconModule, MdSidenavModule} from '@angular/material';
import { StarflexUpgradeComponent } from './starflex-upgrade/starflex-upgrade.component';
import { SaveRestoreComponent } from './save-restore/save-restore.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from  '../shared/shared.module';
import { DashboardNavbarComponent } from './dashboard-navbar/dashboard-navbar.component'
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxDatatableModule,
    // MaterialModule.forRoot(),
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdSidenavModule,
    FormsModule,
    SharedModule,
    MdTabsModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdInputModule,
    FlexLayoutModule

  ],
  declarations: [
    // ZonesComponent,
    // IoDevicesComponent,
    // AntennasComponent,
    // InventoryWizardComponent,
    SidenavComponent,
    // ReadersComponent,
    StarflexUpgradeComponent,
    SaveRestoreComponent,
    DashboardNavbarComponent
  ]
})
export class DashboardModule { }
