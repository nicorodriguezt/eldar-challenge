import { Component , inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../services/auth.service';
import { Auth } from '../../../interfaces/auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, FormsModule, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authService = inject(AuthService)
  router = inject(Router)
  messageService = inject(MessageService)

  login: Auth = {email: '', password: ''}

  onLogin() {
    this.authService.login(this.login).subscribe({
      next: (res) => {
        this.router.navigateByUrl('products')
      },
      error: (error) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message})
      }
  })
  }

}
