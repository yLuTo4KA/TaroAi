import { Component, OnInit, inject } from '@angular/core';
import { TelegramService } from '../../services/telegram.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  telegramService = inject(TelegramService);

  constructor() { }

  ngOnInit() {
    this.telegramService.log()
  }

}
