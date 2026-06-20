import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/authService/auth-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!:FormGroup;
  
  constructor(private fb: FormBuilder, private route: Router, private _authService: AuthService){

  }

  ngOnInit(){
    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      RememberMe: ['']
    });
  }
  
  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    
    const payload = {
      Username: this.loginForm.value.Username,
      Password: this.loginForm.value.Password
    }

    this._authService.login(payload).subscribe({
      next:(data) => {
        localStorage.setItem('userInfo', JSON.stringify(data));
        alert("Chào mừng " + data.fullName + " quay trở lại DreamTech");

        const role = data.role.toLowerCase();
        if(role == "admin"){
          this.route.navigate(['/admin']);
        }
        else if(role == "user"){
          this.route.navigate(['/user']);
        }
        else
          this.route.navigate(['/home']);
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })

  }
}
