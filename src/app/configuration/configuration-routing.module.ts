import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

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
    path: 'administration',
    loadChildren: 'app/admin/admin.module#AdminModule'
  }];
// const appRouting = RouterModule.forChild(APP_ROUTES);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {
}
