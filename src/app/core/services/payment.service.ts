import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface paymentData {
    url: string
}
interface PaymentParams {
    star_amount: number,
    div_amount: number
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends ApiService{
    private urlPath = 'payment' as const;

    constructor(http: HttpClient) {
        super(http);
    }

    paymentRequest(star_amount: number, div_amount: number): Observable<paymentData> {
        const url = `${this.urlPath}/getLink`
        const params = {star_amount, div_amount};
        return this.post<paymentData, PaymentParams>(url, params).pipe()
    }
}