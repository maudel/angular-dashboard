import {ModuleWithProviders, NgModule} from '@angular/core';
import {HomepageComponent} from './homepage/homepage.component';
import {Routes, RouterModule} from '@angular/router';

// import { AuthGuard } from './core/guards/auth.guard';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: HomepageComponent
  }
];


const appRouting = RouterModule.forChild(APP_ROUTES);

@NgModule({
  imports: [appRouting],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {
}

