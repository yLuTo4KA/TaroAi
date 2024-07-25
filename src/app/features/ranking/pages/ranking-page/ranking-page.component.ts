import { Component, inject, OnInit } from '@angular/core';
import { UserItem } from 'src/app/core/models/userItem.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { RankingService } from '../../services/ranking.service';
import { EMPTY, catchError, finalize, forkJoin, map } from 'rxjs';
import { initInvoice, number } from '@telegram-apps/sdk';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { environment } from 'src/environments/environments';
import { DailyBonusService } from '../../services/daily-bonus.service';
import { DailyBonus } from '../../services/models/daily-bonus.model';

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.scss']
})
export class RankingPageComponent implements OnInit {
  // Inject
  rankingService = inject(RankingService);
  authService = inject(AuthService);
  paymentService = inject(PaymentService);
  profileService = inject(ProfileService);
  dailyBonusService = inject(DailyBonusService);

  // LeaderBordsData
  allLeaderboard: UserModel[] = [];
  topAllLeaderBoard!: UserModel[];
  weekLeaderboard: UserModel[] = [];
  topWeekLeaderBoard!: UserModel[];
  monthLeaderboard: UserModel[] = [];
  topMonthLeaderBoard!: UserModel[];

  // Data
  userData!: UserItem;
  dailyBonusData: DailyBonus | null = null;
  profileData: UserModel | null = null;

  // AnotherData
  startId = 0;
  isLoading = false;

  // ModalData
  viewPaymentModal: boolean = false;
  viewProfileModal: boolean = false;
  viewDailyModal: boolean = false;


  constructor() { }

  ngOnInit() {
    this.checkDailyBonus();
    this.getLeaderboards();
    this.authService.userData$.subscribe(userData => {
      this.userData = UserModel.fromJson(userData);
    }
    );
  }

  checkDailyBonus(): void {
    this.dailyBonusService.getDailyBonus().subscribe(
      {
        next: (response) => {
          if (response && response.is_available) {
            this.dailyBonusData = response;
            this.viewDailyModal = true;
            this.claimDailyBonus();
          }
        },
        error: (error) => console.log(error),
        
      }
    )
  }

  claimDailyBonus(): void {
    this.dailyBonusService.claimDailyBonus().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }



  startPayment(price: number) {
    this.paymentService.paymentRequest(price).subscribe(
      {
        next: (response) => {
          if (response && response.url) {
            if (environment.production) {
              const invoice = initInvoice();
              invoice.open(response.url, 'url').then((status) => {
                if (status === 'paid') {
                  this.profileService.getProfile().subscribe((response) => {
                    if (response) {
                      this.viewPaymentModal = false;
                      this.getLeaderboards();
                      this.authService.setUserData(response);
                    }
                  })
                }
              });
            } else {
              console.log(response);
            }

          }
        },
        error: (error) => {
          console.log(error)
        }
      }
    );
  }


  getLeaderboards() {
    this.isLoading = true;

    const allLeaderboard$ = this.rankingService.getAllLeaderboard().pipe(
      catchError(() => this.getLeaderboardsError()),
      map((data) => data.map((user) => ({ ...user, rank: this.idGenerator()} as UserModel))),
      finalize(() => this.startId = 0)
    );

    const weekLeaderboard$ = this.rankingService.getWeekLeaderboard().pipe(
      catchError(() => this.getLeaderboardsError()),
      map((data) => data.map((user) => ({ ...user, rank: this.idGenerator()} as UserModel))),
      finalize(() => this.startId = 0)
    );

    const monthLeaderboard$ = this.rankingService.getMonthLeaderboard().pipe(
      catchError(() => this.getLeaderboardsError()),
      map((data) => data.map((user) => ({ ...user, rank: this.idGenerator()} as UserModel))),
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
    this.topAllLeaderBoard = this.allLeaderboard.splice(0, 3);
    this.weekLeaderboard = [...payload.weekLeaderboard];
    this.topWeekLeaderBoard = this.weekLeaderboard.splice(0, 3);
    this.monthLeaderboard = [...payload.monthLeaderboard];
    this.topMonthLeaderBoard = this.monthLeaderboard.splice(0, 3);
    console.log(this.topAllLeaderBoard)

  }

  getLeaderboardsError() {
    return EMPTY;
  }

  idGenerator(): number {
    return ++this.startId;
  }

  setProfileData(profileData: UserModel): void {
    this.profileData = profileData;
    this.viewProfileModal = true;
  }

}



// TO BE DELETED

export class UserModel {
  constructor(
    public telegram_id: number = 123123,
    public user_name: string = "boba",
    public stars: number = 100,
    public avatar_url: string = "",
    public rank?: number
  ) { }

  public static fromJson(json: any): UserModel {
    return new UserModel(
      json.telegram_id,
      json.user_name,
      json.stars,
      json.avatar_url,
      json.rank
    );
  }

  public static fromArrayJson(json: any[]): UserModel[] {
    return json.map((user) => UserModel.fromJson(user));
  }
}
//