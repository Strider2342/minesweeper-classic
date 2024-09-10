import { Component, Input } from '@angular/core';

import { padNumberAsString } from '../../util/string-utils';

@Component({
  selector: 'app-three-digit-display',
  standalone: true,
  templateUrl: './three-digit-display.component.html',
})
export class ThreeDigitDisplayComponent {
  _value = padNumberAsString(0, 3, '0');

  @Input() set value(value: number | null) {
    if (value === null) return;
    this._value = padNumberAsString(value, 3, '0');
  };
}
