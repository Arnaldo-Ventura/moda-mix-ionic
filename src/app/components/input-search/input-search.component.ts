import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
})
export class InputSearchComponent implements OnInit {
  @ViewChild('searchInput', { static: false }) searchInput: {
    setFocus: () => void;
  };
  @Input() label: string = null;
  @Input() onFocus: boolean = null;
  @Output() inputKey = new EventEmitter();
  @Output() inputEmpty = new EventEmitter();
  form: FormGroup;
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const { key } = event;
    if (key.toLowerCase() === 'b') {
      this.searchFocus();
      return;
    }
  }
  ngOnInit() {
    this.form = new FormGroup({
      pesq: new FormControl(),
    });
    this.form.valueChanges
      .pipe(
        tap(() => {
          if (!this.form.value.pesq) {
            this.inputEmpty.emit();
          }
        }),
        map((value) => (value.pesq ? value.pesq.trim() : '')),
        filter((value) => value.length > 2),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((data) => this.inputKey.emit(data));
    setTimeout(() => {
      this.searchFocus();
    }, 400);
  }
  searchFocus() {
    setTimeout(() => {
      if (this.onFocus) {
        this.searchInput.setFocus();
      }
    }, 100);
  }
  reloadAccounts() {
    this.form.patchValue({ pesq: null });
    this.inputEmpty.emit();
  }
}
