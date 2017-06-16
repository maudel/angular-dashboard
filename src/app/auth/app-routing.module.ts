import {ModuleWithProviders, NgModule} from '@angular/core';
import {SigninPageComponent} from './signin-page/signin-page.component'
import {AuthComponent} from './auth.component'
import {SignupPageComponent} from './signup-page/signup-page.component'
import {Routes, RouterModule} from '@angular/router';

// import { AuthGuard } from './core/guards/auth.guard';

const APP_ROUTES: Routes = [
  {
  path: 'signIn',
  component: AuthComponent,
  children: [
  {
    path: 'signIn',
    component: SigninPageComponent,
  },
  {
    path: 'signUp',
    component: SignupPageComponent
  }]
  }
];


const appRouting = RouterModule.forChild(APP_ROUTES);

@NgModule({
  imports: [appRouting],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}

