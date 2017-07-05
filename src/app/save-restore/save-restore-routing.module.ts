import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaveRestoreComponent} from './save-restore.component'

const routes: Routes = [{
  path: '',
  redirectTo: 'save-restore'
},
  {
    path: 'save-restore',
    component: SaveRestoreComponent
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaveRestoreRoutingModule { }
