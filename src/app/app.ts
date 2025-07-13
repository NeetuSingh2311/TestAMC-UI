import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'amctest-frontend';
constructor(private router:Router){}
 goBack(){
    this.router.navigate(['/retail-dashboard'])
  }
}