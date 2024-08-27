import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserData } from 'src/app/core/models/userData.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit{
  private router = inject(Router);
  private authService = inject(AuthService);
  userData: UserData | null = null;
  private userDataSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.authService.userData$.subscribe(data => {
      this.userData = data;
    })
  }

  redirectToEarn(): void {
    this.router.navigate(['/shop'])
  }

  ngOnDestroy(): void {
    if(this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

}
