import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent {
  @Input() width: number = 24;
  @Input() height: number = 24;
  
}
