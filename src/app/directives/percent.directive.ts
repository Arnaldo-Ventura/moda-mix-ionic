import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appPercent]',
})
export class PercentDirective implements OnInit {
  @Input() initalValue = '0,00';
  countInput = 0;
  backspace = false;
  constructor(private el: ElementRef) {}

  @HostListener('keyup') onKeyup() {
    let value = this.el.nativeElement.value;
    if (this.countInput === 1) {
      const length = this.el.nativeElement.value.toString().length;
      const lastInput = this.el.nativeElement.value.toString()[length - 1];
      value = '00' + lastInput + '%';
    }
    const onlyNumbers = this.clearValue(value);
    const newValue = this.includeDecimal(onlyNumbers);
    this.setElementValue(newValue);
  }

  ngOnInit(): void {
    this.setElementValue(this.initalValue);
  }

  setElementValue(value) {
    const valueFormated = `${value}%`;
    this.countInput++;
    this.el.nativeElement.value = valueFormated;
  }

  clearValue(value: any) {
    if (!value.includes('%')) {
      value = value.substr(0, value.length - 1);
    }
    let clearValue = '';
    for (const i of value) {
      if (!isNaN(i)) {
        clearValue = clearValue + i;
      }
    }
    return clearValue;
  }

  includeDecimal(value: any) {
    let newValue = (value / 100).toFixed(2);
    if (+newValue > 100) {
      newValue = '100.00';
    }
    return newValue.toString().replace('.', ',');
  }
}
