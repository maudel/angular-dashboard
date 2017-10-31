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
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {
}
