import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface paymentData {
    url: string
}
interface PaymentParams {
    payment_amount: number
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends ApiService{
    private urlPath = 'payment' as const;

    constructor(http: HttpClient) {
        super(http);
    }

    paymentRequest(amount: number): Observable<paymentData> {
        const url = `${this.urlPath}/stars-invoice-link`
        const params = {
            "payment_amount": amount
        }
        return this.post<paymentData, PaymentParams>(url, params).pipe()
    }
}