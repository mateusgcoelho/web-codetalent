import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'input-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
  providers: [],
  templateUrl: './input.component.html',
})
export class InputComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  name = input<string>();
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  type: 'text' | 'date' = 'text';
  mask = input<string>();
  prefix = input<string>('');
  thousandSeparator = input<string>('');

  @ViewChild('input') _input?: ElementRef;

  formControl = input.required<FormControl>();
  formSubmitted = input<boolean>(false);

  get input(): ElementRef | undefined {
    return this._input;
  }

  set input(value: ElementRef) {
    this._input = value;
  }
}
