import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService{

  private baseUrl = 'http://localhost:8080/api/admin/users'
  constructor(private http:HttpClient) { }
    getAllUsers():Observable<any[]> {
      const email = sessionStorage.getItem('authUserEmail');
      const password = sessionStorage.getItem('authPass');
      const basicAuth = btoa(`${email}:${password}`);
      const headers  = new HttpHeaders({
        'Authorization':`Basic ${basicAuth}`
      });
      console.log("Token : "+ headers );
      console.log("username : "+ email );
      console.log("password : "+ password);
      return this.http.get<any[]>(`${this.baseUrl}`,{headers});
    }
}
