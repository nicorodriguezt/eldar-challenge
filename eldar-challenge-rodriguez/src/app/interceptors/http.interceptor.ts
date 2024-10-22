import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const messageService = inject(MessageService)

  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getUserToken()}`
    }
  })
  return next(cloneReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == 401 && !error.url?.includes('login')) {
        messageService.add({ severity: 'error', summary: 'Error', detail: 'Credenciales Invalidas' })
        authService.logout()
      }
      return throwError(() => error)
    })

  );
};
