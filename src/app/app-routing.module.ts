import { UserComponent } from './user/user.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';  // Your main component
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component:AdminComponent},
  { path: 'user', component:UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Import the RouterModule with your routes
  exports: [RouterModule]  // Export the RouterModule for use in your app
})
export class AppRoutingModule { }
