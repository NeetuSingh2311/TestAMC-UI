import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
private baseUrl = 'http://localhost:8080/api/portfolio/summary'
  constructor(private http:HttpClient) { }

  getOwnPortfolio():Observable<any>{
    const role = sessionStorage.getItem('userRole');
    let url;
    if(role === 'ADMIN'){
       const email = sessionStorage.getItem('rowEmail');
        url = `${this.baseUrl}?email=${email}`;
    }else{
      url = `${this.baseUrl}`;
    } 
    return this.http.get(url,{headers:this.authHeaders()});
  } 
  private authHeaders():HttpHeaders{
    const email = sessionStorage.getItem('authUserEmail');
    const password = sessionStorage.getItem('authPass');
    const basicAuth = btoa(`${email}:${password}`);
    const headers  = new HttpHeaders({
      'Authorization':`Basic ${basicAuth}`
    });
    console.log("Token : "+ headers );
    console.log("username : "+ email );
    console.log("password : "+ password);
    return headers
  }
}
