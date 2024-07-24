import { Component, inject, OnInit } from '@angular/core';
import { UserItem } from 'src/app/core/models/userItem.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { RankingService } from '../../services/ranking.service';
import { EMPTY, catchError, finalize, forkJoin, map } from 'rxjs';
import { initInvoice, number } from '@telegram-apps/sdk';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.scss']
})
export class RankingPageComponent implements OnInit {
  private invoice = initInvoice();
  rankingService = inject(RankingService);
  authService = inject(AuthService);
  paymentService = inject(PaymentService);
  profileService = inject(ProfileService);

  allLeaderboard: UserModel[] = [];
  weekLeaderboard: UserModel[] = [];
  monthLeaderboard: UserModel[] = [];
  startId = 0;
  isLoading = false;

  userData!: UserItem;
  openPaymentModal: boolean = false;
  openProfileModal: boolean = false;
  

  

  constructor() { }

  ngOnInit() {
    this.getLeaderboards();
    this.authService.userData$.subscribe(userData => {
      this.userData = UserModel.fromJson(userData);
      console.log('new data');
      console.log(userData);
    }
  );
  }

  startPayment(price: number) {
    this.paymentService.paymentRequest(price).subscribe(
      (response) => {
        if(response && response.url) {
          this.invoice.open(response.url, 'url').then((status)=> {
            if(status === 'paid') {
              this.profileService.getProfile().subscribe((response) => {
                if(response) {
                  this.openPaymentModal = false;
                  this.getLeaderboards();
                  this.authService.setUserData(response);
                }
              })
            }
        });
        
        }
        
      },
      (error) => {},
    );
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
    console.log(this.allLeaderboard);
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