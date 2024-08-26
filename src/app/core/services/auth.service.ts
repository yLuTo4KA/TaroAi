import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TelegramService } from './telegram.service';
import { UserData } from '../models/userData.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

interface AuthData {
  "success": string,
  "data": {
    "token": string,
    "userData": UserData
  }
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl: string = "https://taroai-546ac6a4db3b.herokuapp.com/auth";

  telegramService = inject(TelegramService);

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());
  private userDataSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  token$: Observable<string | null> = this.tokenSubject.asObservable();
  userData$: Observable<UserData | null> = this.userDataSubject.asObservable();


  constructor(private http: HttpClient, private router: Router) {

  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  setUserData(userData: UserData | null): void {
    this.userDataSubject.next(userData);
  }
  

  isLoggin(): boolean {
    return !!this.getToken();
  }

  auth(): Observable<AuthData> {
    let params;
    if(!environment.production){
      params = {
        "initData": environment.initData
      }
    } else {
      params = {
        "initData": this.telegramService.initData()
      }
    }
    console.log(params);
    this.loadingSubject.next(true);
    return this.http.post<AuthData>(this.apiUrl, params).pipe(
      tap(response => {
        if (response) {
          this.setToken(response.data.token);
          this.setUserData(response.data.userData);
        }
      }), 
      finalize(() => {
        this.loadingSubject.next(false);
        this.router.navigate(['/ranking']);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }
      )
    )
  }
  deauth(): void {
    localStorage.removeItem("token");
    this.tokenSubject.next(null);
    this.userDataSubject.next(null);
  }

}

