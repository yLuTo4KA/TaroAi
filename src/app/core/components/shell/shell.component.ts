import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TelegramService } from '../../services/telegram.service';
import {Router, NavigationEnd} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UserData } from '../../models/userData.model';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {

  authService = inject(AuthService);
  tgService = inject(TelegramService);
  showFooter: boolean = true;
  userData: UserData | null = null;
  private userDataSubscription: Subscription | undefined;

  constructor(private router: Router) { 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showFooter = this.router.url !== '/notAuth';
    });
  }
  

  ngOnInit() {
    this.authService.deauth();
    this.tgService.expand();
    this.authService.auth().subscribe();

    this.userDataSubscription = this.authService.userData$.subscribe(data => {
      this.userData = data;
    })
  }

  ngOnDestroy(): void {
    this.authService.deauth();

    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
