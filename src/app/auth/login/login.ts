import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Auth } from "../../services/auth";
import { Router } from "@angular/router";



@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm:FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb :FormBuilder,private authService:Auth,private router:Router, ){
    this.loginForm = fb.group({
      email:['',[Validators.required,Validators.email]],
      password: ['',Validators.required],
    });
  }
onSubmit() {
  if (this.loginForm?.invalid) return;

  this.loading = true;
  this.errorMessage = '';

  const { email, password } = this.loginForm.value;

  this.authService.login({ email, password }).subscribe({
    next: (response) => {
      this.loading = false;

      if (response && (response.role === 'USER' || response.role === 'ADMIN')) {
        sessionStorage.setItem('userRole', response.role);

        if (response.role === 'USER') {
          this.router.navigate(['retail-dashboard']);
        } else if (response.role === 'ADMIN') {
          this.router.navigate(['admin-dashboard']);
        }
      } else {
        this.errorMessage = 'Invalid login credentials. Please try again.';
        console.error('Login failed: No valid role in response.');
      }
    },
    error: (error) => {
      this.loading = false;
      this.errorMessage = 'Invalid login credentials. Please try again.';
      console.error('Login Error:', error);
    }
  });
}
  onCancel() {
    this.router.navigate(['']);
  }
}

