import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from '../interfaces/auth';
import { UserInfo } from '../interfaces/user-info';
import { ProductStore } from '../store/products.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  router = inject(Router)
  http = inject(HttpClient)
  store = inject(ProductStore)

  private token: string;
  private loggedUserInfo: UserInfo | null = null;
  private baseUrl = `${environment.apiUrl}/auth`;
  private loggedIn$ = new BehaviorSubject(false)

  constructor() {
    this.token = localStorage.getItem('token') ?? ''
    if (this.token) {
      this.loggedIn$.next(true)
      this.loggedUserInfo = this.decodeToken()
    } 
  }

  isLoggedIn() {
    return this.loggedIn$.asObservable()
  }

  getUserRole() {
    return this.loggedUserInfo?.role ?? ''
  }

  getUserName() {
    return this.loggedUserInfo?.email ?? ''
  }

  getUserToken() {
    return this.token
  }

  private decodeToken() {
    try {
      // Divide el token en sus partes
      const base64Url = this.token.split('.')[1];
      if (!base64Url) throw new Error('Token incorrecto');

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(atob(base64).split('').map((char) => {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      this.logout()
      return null
    }
  }

  logout() {
    this.token = ''
    this.loggedUserInfo = null
    this.store.resetStore()
    localStorage.removeItem('token')
    this.router.navigateByUrl('login')
  }

  login(authInfo: Auth) {
    return this.http.post<any>(`${this.baseUrl}/login`, authInfo).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token)
        this.token = res.access_token
        this.loggedIn$.next(true)
        this.loggedUserInfo = this.decodeToken()
      })
    )
  }

}
