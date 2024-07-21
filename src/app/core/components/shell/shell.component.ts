import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TelegramService } from '../../services/telegram.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  authService = inject(AuthService);
  tgService = inject(TelegramService);

  constructor() { }

  ngOnInit() {
    this.tgService.expand();
    this.authService.auth().subscribe();
  }

}
