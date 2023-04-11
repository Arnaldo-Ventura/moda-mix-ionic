import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefinePasswordComponent } from './define-password/define-password.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'definir-senha/:token',
    component: DefinePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
