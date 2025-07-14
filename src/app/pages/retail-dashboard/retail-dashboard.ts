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
  userName: string | null = '';
  portfolio: any = '';
  email: any = '';
  userRole: string | null = '';
  
  equityHoldings: Holding[] = [];
  fixedIncomeHoldings: Holding[] = [];
  
  chartLabels: string[] = ['Equity', 'Fixed Income'];
  chartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.chartLabels,
    datasets: [
      { 
        data: [this.equityTotal, this.fixedTotal],
        backgroundColor: ['#0078d4', '#2b88d8'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBackgroundColor: ['#106ebe', '#0078d4'],
        hoverBorderWidth: 3
      }
    ]
  };
  
  legendPosition: 'top' | 'left' | 'bottom' | 'right' | 'center' | 'chartArea' = 'bottom';
  
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: this.legendPosition,
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      }
    }
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
    this.userRole = this.auth.getUserRole();
    if(this.userRole === "ADMIN") {
      this.userName = sessionStorage.getItem('rowUserName') || '';
     console.log('Admin Dashboard - User Name:', this.userName);
    }
    this.email = this.auth.getEmail();
    this.loadPortfolioData();
    this.loadHoldingsData();
  }

  private loadPortfolioData(): void {
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
          this.updateChartData();
        }
      },
      error: (err) => console.log('Error loading portfolio', err)
    });
  }

  private loadHoldingsData(): void {
    this.holdingService.getEquity('').subscribe({
      next: (equityData: Holding[]) => {
        this.equityHoldings = equityData || [];
      },
      error: (err) => console.log('Error loading equity holdings', err)
    });

    this.holdingService.getFixedIncome('').subscribe({
      next: (fixedData: Holding[]) => {
        this.fixedIncomeHoldings = fixedData || [];
      },
      error: (err) => console.log('Error loading fixed income holdings', err)
    });
  }

  private updateChartData(): void {
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        { 
          data: [this.equityTotal, this.fixedTotal],
          backgroundColor: ['#0078d4', '#2b88d8'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverBackgroundColor: ['#106ebe', '#0078d4'],
          hoverBorderWidth: 3
        }
      ]
    };
  }

  getEquityPercentage(): number {
    if (this.totalMarket === 0) return 0;
    return (this.equityTotal / this.totalMarket) * 100;
  }

  getFixedIncomePercentage(): number {
    if (this.totalMarket === 0) return 0;
    return (this.fixedTotal / this.totalMarket) * 100;
  }

  getTotalHoldings(): number {
    return this.equityHoldings.length + this.fixedIncomeHoldings.length;
  }

  getTopEquityHoldings(): Holding[] {
    return this.equityHoldings
      .sort((a, b) => parseFloat(b.marketValue) - parseFloat(a.marketValue))
      .slice(0, 5);
  }

  getTopFixedIncomeHoldings(): Holding[] {
    return this.fixedIncomeHoldings
      .sort((a, b) => parseFloat(b.marketValue) - parseFloat(a.marketValue))
      .slice(0, 5);
  }

  async onCardClick(category: 'Equity' | 'Fixed Income') {
    if (this.email) {
      const hashedEmail = await this.hashEmail(this.email);
      this.router.navigate(['/holdings', category, hashedEmail]);
    }
  }

  private async hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}