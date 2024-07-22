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

  tokenMock: string = "jJJFSn238dsjfJNSJKDnsfuNJDNSKDNjdfsjkdnmm";
  fakeData: boolean = true;

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
        "InitData": "query_id=AAG2oygfAAAAALajKB_sDxlt&user=%7B%22id%22%3A522757046%2C%22first_name%22%3A%22%F0%9F%92%8E%22%2C%22last_name%22%3A%22Vladimir%22%2C%22username%22%3A%22PsihBoss%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1721628148&hash=c130cce7a04edbeee6f849822a5d729f8f8003c65e9eb3d364d8e4e10bc4dc1c"
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