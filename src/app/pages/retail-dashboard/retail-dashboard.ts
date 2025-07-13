import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio-service';
import { HoldingService } from '../../services/holding-service';
import { Auth } from '../../services/auth';
import { Holding } from '../../../shared/Holding';
import { Router } from '@angular/router';
import { ChartData, ChartType } from 'chart.js';



@Component({
  selector: 'app-retail-dashboard',
  standalone: false,
  templateUrl: './retail-dashboard.html',
  styleUrls: ['./retail-dashboard.css']
})
export class RetailDashboard implements OnInit {
  totalMarket = 0;
  equityTotal = 0;
  fixedTotal = 0;
  selectedCategory: 'Equity' | 'Fixed Income' | null = null;
  selectedHoldings: Holding[] = [];
  userName: string | null = '';
  portfolio: any = '';
  email: any = '';
  chartLabels: string[] = ['Equity', 'Fixed Income', 'Total Market'];
chartData: ChartData<'pie', number[], string | string[]> = {
  labels: this.chartLabels,
  datasets: [
    { data: [this.equityTotal, this.fixedTotal,this.totalMarket] }
  ]
};
chartType: ChartType = 'pie';



  constructor(
    private portfolioService: PortfolioService,
    private holdingService: HoldingService,
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userName = this.auth.getUser();
    this.email = this.auth.getEmail();

    this.portfolioService.getOwnPortfolio().subscribe({
      next: (response) => {
        this.portfolio = response;
        this.totalMarket = this.portfolio?.totalMarketValue || 0;
        if (this.portfolio?.categories && Array.isArray(this.portfolio.categories)) {
          this.portfolio.categories.forEach((category: any) => {
            if (category.categoryName === 'Equity') {
              this.equityTotal = category.marketValue || 0;
            }
            if (category.categoryName === 'Fixed Income') {
              this.fixedTotal = category.marketValue || 0;
            }
          });
          debugger;
          this.chartData = {
            labels: this.chartLabels,
            datasets: [
              { data: [this.equityTotal, this.fixedTotal,this.totalMarket]
               }
            ]
          };
        }
      },
      error: (err) => console.log('Error loading portfolio', err)
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  async hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async onCardClick(category: 'Equity' | 'Fixed Income') {
    if (this.email) {
      const hashedEmail = await this.hashEmail(this.email);
      this.router.navigate(['/holdings', category, hashedEmail]);
    }
  }
}