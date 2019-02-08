import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DiscordService } from '../../providers/discord/discord.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public pending = false;
  public loginForm: FormGroup;
  private tokenControl: AbstractControl;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private discord: DiscordService,
    private snackbar: MatSnackBar) {
    const pattern = /^[a-z]{3}\.[\w-]{84}$/, token = localStorage.getItem('token');

    this.loginForm = formBuilder.group({
      token: ['', [Validators.required, Validators.pattern(pattern)]]
    });
    this.tokenControl = this.loginForm.get('token');

    if (pattern.test(token)) {
      this.tokenControl.setValue(token);
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const token = this.tokenControl.value;
      this.pending = true;
      this.discord.login(token).then(() => {
        localStorage.setItem('token', token);
        return this.router.navigate(['']);
      }).then(() => {
        this.snackbar.open('Giriş yapıldı', 'Yoksay', { duration: 3e3 });
      }).catch(error => {
        this.snackbar.open(error.message, 'Yoksay', { duration: 3e3 });
      }).then(() => {
        this.pending = false;
      });
    } else {
      this.snackbar.open('Token geçerli değil', 'Yoksay', { duration: 3e3 });
    }
  }
}

// "mfa.-S_gXya2YcPbC8LpF9GIwnutV21TEnPdmuRQRevmmexlPIOtZy7KvaJdGLuZxHrQJ6XgkL0MSMb534rC_-Rl"