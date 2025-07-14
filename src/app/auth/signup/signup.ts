import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Auth } from "../../services/auth";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
@Output() close = new EventEmitter<void>();
  signupForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: Auth, private router:Router) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required], 
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      contactNumber: ['', Validators.required], 
      pan: ['', Validators.required], 
      password: ['', [Validators.required,Validators.minLength(5)]]
    });
  }
  onSubmit() {
    if (this.signupForm?.invalid){
      console.info('Form is invalid');
      return;
    }
    this.auth.signup(this.signupForm.value).subscribe(() => {
      this.close.emit();
      this.router.navigate(['/login']);
    });
  }
 onLogin(event: Event): void {
  event.preventDefault();    
  this.router.navigate(['/login']);
  }
   onCancel() {
    this.router.navigate(['']);
  }
}
