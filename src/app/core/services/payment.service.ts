import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { initUtils } from '@telegram-apps/sdk';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class PaymentService {

    private apiUrl: string = "https://proj-2x-78a0ca7fa5b0.herokuapp.com/api/payment/stars-invoice-link";
    // private utils = initUtils();

    constructor(private http: HttpClient) {}

    paymentRequest(amount: number): Observable<any> {
        const params = new HttpParams().set('payment_amount', amount.toString());
        console.log(123);
        return this.http.get<any>(this.apiUrl, {params}).pipe(
            tap((response) => {
                // this.utils.openTelegramLink(response.url);
            }),
            finalize(() => {
                console.log(123);
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => "error");
              }
        ))
    }
}