import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { CurrencyService } from '../shared/currency.service';

@Directive({
  selector: '[appCurrency]',
})
export class CurrencyDirective implements OnInit {
  @Input() initalValue: any = 0;
  countInput = 0;
  constructor(
    private el: ElementRef,
    private currencyService: CurrencyService
  ) {}

  @HostListener('keyup') onKeyup() {
    let value = this.el.nativeElement.value;
    if (this.countInput === 1) {
      const length = this.el.nativeElement.value.toString().length;
      const lastInput = this.el.nativeElement.value.toString()[length - 1];
      value = '0.0' + lastInput;
    }
    this.setElementValue(value);
  }

  ngOnInit(): void {
    const initalValue = this.currencyService.transformCurrency(
      this.initalValue
    );
    this.setElementValue(initalValue);
  }

  setElementValue(value) {
    const valueFormated = this.currencyService.retransformCurrency(value);
    this.countInput++;
    this.el.nativeElement.value = valueFormated;
  }
}
