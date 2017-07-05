import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { AboutComponent } from './about/about.component';
import { Star3000UpgradeComponent } from './star-3000-upgrade/star-3000-upgrade.component';
import { StarflexUpgradeComponent } from './starflex-upgrade/starflex-upgrade.component';
import { MconUpgradeComponent } from './mcon-upgrade/mcon-upgrade.component';
import { HelpComponent } from './help.component';
@NgModule({
  imports: [
    CommonModule,
    HelpRoutingModule
  ],
  declarations: [
    AboutComponent,
    Star3000UpgradeComponent,
    StarflexUpgradeComponent,
    MconUpgradeComponent,
    HelpComponent,
  ]
})
export class HelpModule { }
