import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Any necessary initialization logic here
  }

  onSubmit(loginForm: NgForm): void {
    if (!loginForm.valid) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const email = loginForm.value.uname;
    const password = loginForm.value.psw;

    this.authService.loginUser({ email, password }).subscribe(
      response => {
        console.log('Login Successful', response);
        localStorage.setItem('userId', response.id);
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (response.role === 'USER') {
          this.router.navigate(['/user']);
        } else {
          alert('Invalid role');
        }
      },
      error => {
        console.error('Login failed', error);
        // Handle login failure (e.g., incorrect username/password)
        alert('Invalid username or password');
      }
    );
  }
}
