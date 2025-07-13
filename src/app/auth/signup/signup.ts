import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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
      fullName: '', address: '', email: '', contactNumber: '', pan: '', password: ''
    });
  }
  onSubmit() {
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
