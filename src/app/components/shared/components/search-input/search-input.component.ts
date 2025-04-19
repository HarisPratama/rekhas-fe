import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  imports: [IconFieldModule, InputIconModule, FormsModule, InputTextModule]
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Search';
  @Input() model: string = '';
  @Output() modelChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(value => {
      this.search.emit(value);
    });
  }

  onInput(value: string) {
    this.model = value;
    this.modelChange.emit(this.model);
    this.searchSubject.next(value);
  }
}
