import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'icon-button-component',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  providers: [],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  icon = input.required<string>();
  disabled = input<boolean>(false);
  buttonClick = output();

  click(): void {
    if (this.disabled()) return;

    this.buttonClick.emit();
  }
}
