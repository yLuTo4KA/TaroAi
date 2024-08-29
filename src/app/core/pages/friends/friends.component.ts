import { Component, inject, OnInit } from '@angular/core';
import { ReferralsService } from '../../services/referrals.service';
import { Referral } from '../../models/referral.model';
import { TelegramService } from '../../services/telegram.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit{
  private authService = inject(AuthService);
  private referralsService = inject(ReferralsService);
  private tgService = inject(TelegramService);

  private refKey!: string;
  private userDataSubscription: Subscription | undefined;
  public referrals: Referral[] | null = null;
  public totalBonus!: number;
  constructor(){}

  ngOnInit(): void {
      this.userDataSubscription = this.authService.userData$.subscribe(data => {
        if(data) {
          this.refKey = data.ref_key;
        }
      })
      this.referralsService.getReferrals().subscribe(data => {
        this.referrals = data.referrals;
        this.totalBonus = data.totalBonus
      })
  }

  openInviteModal(): void {
    this.tgService.shareRefLink(this.refKey); 
  }

  ngOnDestroy(): void {
    if(this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
