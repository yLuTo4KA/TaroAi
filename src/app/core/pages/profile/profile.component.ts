import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserData } from '../../models/userData.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  private authService = inject(AuthService);
  public userData!: UserData;
  private userDataSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.userDataSubscription = this.authService.userData$.subscribe(data => {
      if(data) {
        this.userData = data;
      }
    })
  }

  ngOnDestroy(): void {
    if(this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
