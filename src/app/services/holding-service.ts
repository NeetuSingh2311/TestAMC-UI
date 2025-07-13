
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Holding } from '../../shared/Holding';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HoldingService {
 private baseUrl = 'http://localhost:8080/api/holding';

  constructor(private http: HttpClient) {}

  fetchHoldings(category: 'Equity' | 'Fixed Income'): Observable<Holding[]> {
    const role = sessionStorage.getItem('userRole');
    let url, email;
    if(role === 'ADMIN'){
      email = sessionStorage.getItem('rowEmail');
    }else{
      email = sessionStorage.getItem('authUserEmail')
    }
     let params;
     if(email){
      params = new HttpParams()
      .set('email', email)
      .set('category', category);
     }


    return this.http.get<Holding[]>(this.baseUrl, { params ,headers:this.authHeaders()});
  }

  getEquity(email: string) {
    return this.fetchHoldings('Equity');
  }

  getFixedIncome(email: string) {
    return this.fetchHoldings('Fixed Income');
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

