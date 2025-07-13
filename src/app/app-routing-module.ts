
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { RetailDashboard } from './pages/retail-dashboard/retail-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { HoldingDetails } from './pages/holding-details/holding-details';
const routes: Routes = [
  {path: '',component:Home},
  {path:'login',component:Login},
  {path:'signup',component:Signup},
  {path:'retail-dashboard',component:RetailDashboard},
  {path:'admin-dashboard',component:AdminDashboard},
  { path: 'holdings/:category/:email', component: HoldingDetails }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
