import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SelectOptionModel } from './view-models/select-option.model';

@Component({
  selector: 'select-input-component',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './select-input.component.html',
})
export class SelectInputComponent {
  label = input.required<string>();
  placeholder = input<string>();
  name = input<string>();
  required = input<boolean>(false);
  formSubmitted = input<boolean>(false);

  options = input<SelectOptionModel<any>[]>([]);

  @ViewChild('input') _input?: ElementRef;

  formControl = input.required<FormControl>();

  get input(): ElementRef | undefined {
    return this._input;
  }

  set input(value: ElementRef) {
    this._input = value;
  }
}
