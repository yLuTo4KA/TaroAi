import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-block',
  templateUrl: './icon-block.component.html',
  styleUrls: ['./icon-block.component.scss']
})
export class IconBlockComponent {
  @Input() iconName: string = '';
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() small: boolean = false;
  @Input() big: boolean = false;
}
