import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Referral } from '../models/referral.model';

interface ReferralsResponse {
  referrals: Referral[],
  totalBonus: number
}

@Injectable({
  providedIn: 'root',
})

export class ReferralsService extends ApiService{
    private urlPath = "getReferrals" as const;

    constructor(http: HttpClient) {
        super(http);
    }

    getReferrals(): Observable<ReferralsResponse> {
      return this.get<ReferralsResponse>(this.urlPath)
    }
}