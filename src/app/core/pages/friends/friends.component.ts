import { Component, inject, OnInit } from '@angular/core';
import { ReferralsService } from '../../services/referrals.service';
import { Referral } from '../../models/referral.model';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit{
  private referralsService = inject(ReferralsService);
  public referrals: Referral[] | null = null;
  public totalBonus!: number;
  constructor(){}

  ngOnInit(): void {
      this.referralsService.getReferrals().subscribe(data => {
        this.referrals = data.referrals;
        this.totalBonus = data.totalBonus
      })
  }
}
