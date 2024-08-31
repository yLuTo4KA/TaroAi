import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-block',
  templateUrl: './product-block.component.html',
  styleUrls: ['./product-block.component.scss']
})
export class ProductBlockComponent {
  @Input() iconName: string = '';
  @Input() width: number = 24;
  @Input() height: number = 24;
  @Input() buttonName: string = '';
  @Input() small: boolean = false;
  @Input() active: boolean = false;
  @Output() clickButton = new EventEmitter<void>();

  buttonClick(): void {
    this.clickButton.emit();
  }
}
