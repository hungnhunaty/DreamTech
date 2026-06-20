import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../services/authService/auth-service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!:FormGroup;

  constructor(private fb:FormBuilder, private route:Router, private _authService: AuthService){

  }

  ngOnInit(){
    this.registerForm = this.fb.group({
      FullName: ['', Validators.required],
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      Address: [''],
      Phone: ['', Validators.required],
      AcceptCheckBox: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }

    const data = {
      FullName: this.registerForm.value.FullName,
      UserName: this.registerForm.value.UserName,
      Password: this.registerForm.value.Password,
      Address: this.registerForm.value.Address,
      Phone: this.registerForm.value.Phone      
    }

    this._authService.register(data).subscribe(
    {
      next:(res: any) => {
        alert(res.message || 'Đăng ký thành công!');
        this.route.navigate(['/login']);
      },
      error:(err) => {
        alert("Error: " + (err.error.message || 'Có lỗi xảy ra'));
      }
    });
  }
}
