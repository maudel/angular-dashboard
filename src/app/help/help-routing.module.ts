import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {Star3000UpgradeComponent} from './star-3000-upgrade/star-3000-upgrade.component';
import {StarflexUpgradeComponent} from './starflex-upgrade/starflex-upgrade.component';
import {MconUpgradeComponent} from './mcon-upgrade/mcon-upgrade.component';

import {HelpComponent} from './help.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'about'
},
  {
    path: 'about',
    component: AboutComponent
  }, {
    path: 'star-3000-upgrade',
    component: Star3000UpgradeComponent
  }, {
    path: 'starflex-upgrade',
    component: StarflexUpgradeComponent
  }, {
    path: 'mcon-upgrade',
    component: MconUpgradeComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule {
}
