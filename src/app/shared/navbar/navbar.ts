import { Component, Input } from '@angular/core';

import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input() userRole:'User' |'Admin' = 'User';
   userName:string |null = '';
 constructor(private auth:Auth,private router :Router) {
      this.userName = this.auth.getUser();

 }

 logout():void{
  window.location.href ='/login';
 }
}
