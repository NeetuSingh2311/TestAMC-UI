import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdminService } from '../../services/admin-service';
import {MatTableDataSource} from '@angular/material/table';
import { PortfolioService } from '../../services/portfolio-service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, AfterViewInit{ 
  user:any[] = [];
  filteredUser:any[] =[];
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns:string[]=['fullName','email','pan','contactNumber','address','actions'];
  formControl = [];
  portfolioData:any = null;
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  constructor (private adminService:AdminService,private portfolioService:PortfolioService,private router:Router){}
 
  ngOnInit(): void {
   this.fetchUsers();
   this.searchControl.valueChanges.subscribe((query)=>this.filteredUsers(query|| ''));
  }
  ngAfterViewInit(){
    this.dataSource.paginator= this.paginator;
    }
  fetchUsers():void{
    this.adminService.getAllUsers().subscribe((data: any[])=>{
      this.user = data;
      this.dataSource.data = [...data];
    });
  }
  filteredUsers(query:string):void{
    debugger;
  const q = (query ?? '').trim().toLocaleLowerCase();
  if(!q){
    this.dataSource.data =[...this.user];
    return;
  }
  this.dataSource.data = this.user.filter(u => {
    const name = (u.fullName ?? '').toLocaleLowerCase();
   const email = (u.email ?? '').toLocaleLowerCase();
    const pan = (u.pan ?? '').toLocaleLowerCase();
   return name.includes(q)||email.includes(q)|| pan.includes(q);
  });
}
viewUserPortfolio(user:any):void{
  console.log('Viewing user Portfolio emai: ', user.email)
  sessionStorage.setItem('rowEmail',user.email);
  sessionStorage.setItem('rowUserName',user.fullName);
  this.router.navigate(['/retail-dashboard']);
}
}



