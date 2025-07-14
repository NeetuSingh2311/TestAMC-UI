import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

login(credential: { email: string; password: string }): Observable<any> {
  debugger
  return this.http.post<any>(`${this.baseUrl}/login`, credential).pipe(
    tap(response => {
      sessionStorage.setItem('userName', response.name);
      sessionStorage.setItem('authUserEmail', response.email);
      sessionStorage.setItem('authPass',credential.password)
      sessionStorage.setItem('userRole', response.role);
      console.log('User role set in sessionStorage:', response.role);
      console.log('Login successful:', response);
    })
  );
}

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, data);
  }
  getUserRole(): string | null {
    return sessionStorage.getItem('userRole'); 
   }
  getUser() {
    return sessionStorage.getItem('userName');
  }
  getEmail(){
    return sessionStorage.getItem('authUserEmail');
  }

  // Remove user info on logout
  logout(): void {
    sessionStorage.removeItem('authUser');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}

