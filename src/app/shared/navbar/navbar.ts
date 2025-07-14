import { Component, Input } from '@angular/core';

import { Auth } from '../../services/auth';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
 @Input() showUsername: boolean = true;
 userName: string = '';
 userRole: string = '';
 showBackButton = false;
 constructor(private router: Router, private auth: Auth) {}
 ngOnInit(): void {
   this.userName = this.auth.getUser() || '';
   this.userRole = this.auth.getUserRole() || 'User';
   this.router.events
     .pipe(filter(event => event instanceof NavigationEnd))
     .subscribe((event)=>{
      const navEnd: NavigationEnd = event as NavigationEnd;  
       this.updateBackButtonVisibility(navEnd.urlAfterRedirects);
     });
   this.updateBackButtonVisibility(this.router.url);
 }
 private updateBackButtonVisibility(url: string): void {
   this.showBackButton =
     url.includes('/holdings') ||
     (url.includes('/retail-dashboard') && this.userRole === 'ADMIN');
 }
 goToRetailDashboard(): void {
  const currentUrl = this.router.url;
  const userRole = this.auth.getUserRole();
  if (currentUrl.includes('/retail-dashboard') && userRole === 'ADMIN') {
   this.router.navigate(['/admin-dashboard']);
 }else{
  window.history.back();
 }
}
 logout(): void {
   this.auth.logout();
   this.router.navigate(['/login']);
 }
}