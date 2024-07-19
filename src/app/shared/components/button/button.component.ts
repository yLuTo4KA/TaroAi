import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostBinding,
  Input,
} from '@angular/core';


@Component({
  selector: 'button[customButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent implements OnInit , IButtonProps {
  @Input()
  iconPosition: 'left' | 'right' = 'left';

  @Input()
  color: 'primary' | 'secondary' =  'primary';

  @HostBinding('class.custom-button')
  _customButtom = true;

  @HostBinding('class.custom-button--primary')
  get dark(): boolean {
    return this.color === 'primary'
  }

  @HostBinding('class.custom-button--secondary')
  get light(): boolean {
    return this.color === 'secondary'
  }


  constructor() {}

  ngOnInit(): void {}
}

export default interface IButtonProps {
  iconPosition: string;
  color: string;
}