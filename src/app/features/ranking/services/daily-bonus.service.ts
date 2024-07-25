import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { DailyBonus } from './models/daily-bonus.model';

@Injectable({
  providedIn: 'root'
})



export class DailyBonusService extends ApiService {
    private urlPath = 'daily-bonus' as const;

    constructor(http: HttpClient) {
        super(http);
    }

    getDailyBonus(): Observable<DailyBonus> {
        const url = `${this.urlPath}`;
        
        return this.get<DailyBonus>(url);
    }

    claimDailyBonus(): Observable<any> {
        const url = `${this.urlPath}/claim`;
        
        return this.post<any, {}>(url, {});
    }
}
