import {ModuleWithProviders, NgModule} from '@angular/core';
import {SidenavComponent} from './sidenav/sidenav.component';
import {Routes, RouterModule} from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {ReadersComponent} from './readers/readers.component';
import {ZonesComponent} from './zones/zones.component';

const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: SidenavComponent,
    children: [{
      path: '',
      redirectTo: 'configuration/attendants',
      pathMatch: 'full'
    }
      , {
        path: 'configuration/attendants',
        component: ReadersComponent
      }, {
        path: 'configuration/zones',
        component: ZonesComponent
      }]
  }, {
    path: '',
    component: HomepageComponent
  }
];


const appRouting = RouterModule.forRoot(APP_ROUTES, {
  useHash: true,
  // enableTracing: true,
  // preloadingStrategy: PreloadAllModules
});

@NgModule({
  imports: [appRouting],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}

