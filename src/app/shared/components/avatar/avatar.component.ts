import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() height = 8;
  @Input() width= 8;
  @Input() photoURL: string | null | undefined;
  @Input() displayName: string | null | undefined;
  
  getUserInitials(displayName: string | null | undefined): string {
      const [firstName = '', lastName = ''] = (displayName || '').split(' ');
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }


}
