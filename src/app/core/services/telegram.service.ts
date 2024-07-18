import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { WebAppUser } from '../models/webAppUser.model';
import { userMock } from '../mocks/user.mock';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
    private window;
    tg;
    dummyResponse = true;

  constructor(@Inject(DOCUMENT) private _document: any) {
    this.window = this._document.defaultView;
    this.tg = this.window!.Telegram.WebApp;
  }

  initData(): WebAppUser {
    if(this.dummyResponse) {
      return userMock
    } else {
      return this.tg.initData;
    }
  }
}
