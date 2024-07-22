import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { UserModel } from '../pages/ranking-page/ranking-page.component';
import { Observable, map } from 'rxjs';
import { LeaderboardModel } from './models/leaderboard-model';

@Injectable({
  providedIn: 'root'
})


export class RankingService extends ApiService {
  private urlPath = 'leaderboard' as const;

  constructor(http: HttpClient) {
    super(http);
  }

  getAllLeaderboard(): Observable<UserModel[]> {
    const url = `${this.urlPath}/all-time`;

    return this.get<LeaderboardModel>(url).pipe(
      map((response) => {
        const users = UserModel.fromArrayJson(response.leaderbord);

        return users;
      })
    );
  }

  getWeekLeaderboard(): Observable<UserModel[]> {
    const url = `${this.urlPath}/week`;

    return this.get<LeaderboardModel>(url).pipe(
      map((response) => {
        const users = UserModel.fromArrayJson(response.leaderbord);

        return users;
      })
    );
  }

  getMonthLeaderboard(): Observable<UserModel[]> {
    const url = `${this.urlPath}/month`;

    return this.get<LeaderboardModel>(url).pipe(
      map((response) => {
        const users = UserModel.fromArrayJson(response.leaderbord);

        return users;
      })
    );
  }


}
