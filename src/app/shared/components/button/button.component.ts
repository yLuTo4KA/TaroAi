import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() small: boolean = false;
  @Input() paddingX: number = 20;
  @Input() paddingY: number = 7;
  @Input() disabled: boolean = false;

  
}
