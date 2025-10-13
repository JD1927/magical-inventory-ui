import { Injectable } from '@angular/core';
import type { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidations {
  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(control?.invalid && (control.touched || control.dirty));
  }
}
