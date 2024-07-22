import { Component, inject, OnInit } from '@angular/core';
import { UserItem } from 'src/app/core/models/userItem.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { RankingService } from '../../services/ranking.service';
import { EMPTY, catchError, finalize, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.scss']
})
export class RankingPageComponent implements OnInit {
  rankingService = inject(RankingService);

  allLeaderboard: UserModel[] = [];
  weekLeaderboard: UserModel[] = [];
  monthLeaderboard: UserModel[] = [];
  startId = 0;
  isLoading = false;

  userData!: UserItem;
  openPaymentModal: boolean = false;
  openProfileModal: boolean = false;
  

  

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getLeaderboards();
    this.authService.userData$.subscribe(userData => this.userData = {
      "user_name": userData!.name,
      "telegram_id": userData!.telegram_id,
      "avatar_url": userData!.avatar_url,
      "stars": userData!.start_total,
      "global_rank": userData!.global_rank
    });
  }
  getLeaderboards() {
    this.isLoading = true;

    const allLeaderboard$ = this.rankingService.getAllLeaderboard().pipe(
      catchError(() => this.getLeaderboardsError()),
      map((data) => data.map((user) => ({ ...user, userRank: this.idGenerator().next().value } as UserModel))),
      finalize(() => this.startId = 0)
    );

    const weekLeaderboard$ = this.rankingService.getWeekLeaderboard().pipe(
      catchError(() => this.getLeaderboardsError()),
      map((data) => data.map((user) => ({ ...user, userRank: this.idGenerator().next().value } as UserModel))),
      finalize(() => this.startId = 0)
    );

    const monthLeaderboard$ = this.rankingService.getMonthLeaderboard().pipe(
      catchError(() => this.getLeaderboardsError()),
      map((data) => data.map((user) => ({ ...user, userRank: this.idGenerator().next().value } as UserModel))),
      finalize(() => this.startId = 0)
    );

    forkJoin([allLeaderboard$, weekLeaderboard$, monthLeaderboard$]).subscribe(
      ([allLeaderboard, weekLeaderboard, monthLeaderboard]) => {
        this.getLeaderboardsSuccess({
          allLeaderboard,
          weekLeaderboard,
          monthLeaderboard,
        });
        this.isLoading = false; // Set loading to false after the API calls are complete
      },
      (error) => {
        this.getLeaderboardsError();
        this.isLoading = false; // Set loading to false even if there's an error
      }
    );
  }

  getLeaderboardsSuccess(payload: { allLeaderboard: UserModel[], weekLeaderboard: UserModel[], monthLeaderboard: UserModel[] }) {
    this.allLeaderboard = [...payload.allLeaderboard];
    this.weekLeaderboard = [...payload.weekLeaderboard];
    this.monthLeaderboard = [...payload.monthLeaderboard];
  }

  getLeaderboardsError() {
    return EMPTY;
  }

  *idGenerator() {
    let id = this.startId;
    while(true){
      yield ++id;
    }
  }

}


// TO BE DELETED

export class UserModel {
  constructor(
    public telegram_id: number = 123123,
    public user_name: string = "boba",
    public avatar_url: string = "",
    public stars: number = 100
  ) { }

  public static fromJson(json: any): UserModel {
    return new UserModel(
      json.telegram_id,
      json.user_name,
      json.stars,
      json.avatar_url,
    );
  }

  public static fromArrayJson(json: any[]): UserModel[] {
    return json.map((user) => UserModel.fromJson(user));
  }
}
//