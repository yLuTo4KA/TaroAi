import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TelegramService } from './telegram.service';
import { UserData } from '../models/userData.model';
import { Router } from '@angular/router';

interface AuthData {
  "accessToken": string,
  "userData": UserData
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl: string = "https://proj-2x-78a0ca7fa5b0.herokuapp.com/auth/sign-in";

  telegramService = inject(TelegramService);

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());
  private userDataSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  token$: Observable<string | null> = this.tokenSubject.asObservable();
  userData$: Observable<UserData | null> = this.userDataSubject.asObservable();

  tokenMock: string = "jJJFSn238dsjfJNSJKDnsfuNJDNSKDNjdfsjkdnmm";
  fakeData: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isLoggin(): boolean {
    return !!this.getToken();
  }

  auth(): Observable<AuthData> {
    let params;
    if(this.fakeData){
      params = {
        "InitData": "query_id=AAH1wKJ0AgAAAPXAonRQHerI&user=%7B%22id%22%3A6251790581%2C%22first_name%22%3A%22Boba%22%2C%22last_name%22%3A%22Bongo%22%2C%22username%22%3A%22bobabonga%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1721516536&hash=239c49a9e3fbc2c0b4fdc28d4ab45dbed96bf1fa21bd54c4dc1476754b2f3a73"
      }
    } else {
      params = {
        "InitData": this.telegramService.initData()
      }
    }
    this.loadingSubject.next(true);
    return this.http.post<AuthData>(this.apiUrl, params).pipe(
      tap(response => {
        if (response) {
          this.setToken(response.accessToken);
          this.userDataSubject.next(response.userData);
          console.log('response');
          console.log(response);
        }
      }), 
      finalize(() => {
        this.loadingSubject.next(false);
        this.router.navigate(['/ranking']);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => "error");
      }
      )
    )
  }

}

