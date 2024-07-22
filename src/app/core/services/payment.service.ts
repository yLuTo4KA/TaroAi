import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { initUtils, initInvoice } from '@telegram-apps/sdk';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class PaymentService {

    private apiUrl: string = "https://proj-2x-78a0ca7fa5b0.herokuapp.com/api/payment/stars-invoice-link";
    private utils = initUtils();
    private invoice = initInvoice();

    constructor(private http: HttpClient) {}

    paymentRequest(amount: number): Observable<any> {
        const params = {
            "payment_amount": amount
        }
        return this.http.post<any>(this.apiUrl, params).pipe()
    }
}