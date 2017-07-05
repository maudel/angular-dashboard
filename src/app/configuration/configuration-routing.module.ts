import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ConfigurationComponent} from './configuration.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'hardware',
  },
  {
    path: 'hardware',
    loadChildren: 'app/hardware/hardware.module#HardwareModule'
  },
  {
    path: 'software',
    loadChildren: 'app/software/software.module#SoftwareModule'
  },
  {
    path: 'system',
    loadChildren: 'app/system/system.module#SystemModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  }];
// const appRouting = RouterModule.forChild(APP_ROUTES);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {
}
