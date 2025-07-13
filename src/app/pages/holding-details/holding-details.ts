import { Component, Input, OnInit } from '@angular/core';

import { HoldingService } from '../../services/holding-service';
import { Auth } from '../../services/auth';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-holding-details',
  standalone: false,
  templateUrl: './holding-details.html',
  styleUrl: './holding-details.css'
})
export class HoldingDetails implements OnInit {
  holdings: any[] = [];
 category : 'Equity' | 'Fixed Income' | ''='';
 displayedColumns: string[] = ['instrumentName', 'ticker', 'description', 'quantity', 'marketValue'];
  loading = false;
  error: string | null = null;
  userName:string |null = '';


  constructor(
    private route: ActivatedRoute,
    private holdingService: HoldingService,
    private auth:Auth,
    private router:Router,
  ) {}

  ngOnInit(): void {
   this.userName = this.auth.getUser();
   this.route.paramMap.subscribe(params => {
     this.category = (params.get('category' ) as 'Equity' | 'Fixed Income')?? '';
     if (this.category) {
       this.getHoldings(this.category );
     }
     });
  }

  async getHoldings(category: 'Equity' | 'Fixed Income') {
  this.loading = true;
  this.error = null;
  const holdingsObservable = await this.holdingService.fetchHoldings(category);
  holdingsObservable.subscribe({
    next: (data: any) => {
      this.holdings = data;
      console.log("holdings : ", this.holdings);
      this.loading = false;
    },
    error: (err: any) => {
      this.error = 'Failed to load holdings';
      this.loading = false;
    }
  });
}
logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  
}
