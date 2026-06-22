import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/accountService/account-service';

@Component({
  selector: 'app-admin-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-account.html',
  styleUrl: './admin-account.css',
})
export class AdminAccount {
  listOfUsers: any[] = [];
  filteredUsers: any[] = [];

  // Filter properties
  searchText: string = '';
  selectedRole: string = '';

  constructor(private _accountService:AccountService, private cd: ChangeDetectorRef){}

  ngOnInit(){
    this.loadUsers();
  }

  loadUsers(){
    this._accountService.getAllUsers().subscribe({
      next:(data) => {
        this.listOfUsers = data;
        this.applyFilters();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  applyFilters() {
    let result = this.listOfUsers;

    if (this.selectedRole) {
      result = result.filter(u => u.role?.toLowerCase() === this.selectedRole.toLowerCase());
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase().trim();
      result = result.filter(u => 
        u.fullName?.toLowerCase().includes(q) || 
        u.username?.toLowerCase().includes(q) || 
        u.email?.toLowerCase().includes(q) || 
        u.phone?.includes(q)
      );
    }

    this.filteredUsers = result;
    this.cd.detectChanges();
  }

  deleteUser(id:number){
    if(confirm("Bạn chắc chắn muốn xóa tài khoản này?")){
      this._accountService.deleteUser(id).subscribe({
        next:(data) => {
          alert("Xóa tài khoản thành công");
          this.loadUsers();
        },
        error:(err) => {
          alert("Error: " + err.error.message);
        }
      })
    }
  }

  getInitial(name:string):string {
    if(!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  getRoleBadge(role:string):{label:string, color:string} {
    switch(role?.toLowerCase()){
      case 'admin': return {label: 'QUẢN TRỊ VIÊN', color: '#ff3d5a'};
      case 'staff': return {label: 'NHÂN VIÊN', color: '#a78bfa'};
      default: return {label: 'KHÁCH HÀNG', color: '#00d4ff'};
    }
  }
}
