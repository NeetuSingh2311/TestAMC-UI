import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './pages/home/home';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Navbar } from './shared/navbar/navbar';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { RetailDashboard } from './pages/retail-dashboard/retail-dashboard';
import { HoldingDetails } from './pages/holding-details/holding-details';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../shared/material-module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    App,
    Home,
    Login,
    Signup,
    Navbar,
    AdminDashboard,
    RetailDashboard,
    HoldingDetails
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule, 
    ReactiveFormsModule,
     HttpClientModule,  
     NgChartsModule 
  ],
  providers: [

  ],
  bootstrap: [App]
})
export class AppModule { 
}

