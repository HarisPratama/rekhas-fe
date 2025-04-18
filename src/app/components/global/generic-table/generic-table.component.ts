import {Component, Input, Output, EventEmitter, TemplateRef, ContentChild} from '@angular/core';
import {TableModule, TableRowSelectEvent, TableRowUnSelectEvent} from 'primeng/table';
import {Skeleton} from 'primeng/skeleton';
import {Paginator} from 'primeng/paginator';
import {CommonModule} from '@angular/common';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {FormsModule} from '@angular/forms';

export interface Column {
  field: string;
  header: string;
  style?: any;
}

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css'],
  imports: [
    CommonModule,
    TableModule,
    Skeleton,
    Paginator,
    ToggleSwitch,
    FormsModule
  ]
})
export class GenericTableComponent<T = any> {
  @Input() data: T[] = [];
  @Input() cols: Column[] = [];
  @Input() first = 0;
  @Input() rows = 5;
  @Input() totalRecords = 0;
  @Input() loading = false;

  // Custom template support
  @ContentChild('rowTemplate') rowTemplate!: TemplateRef<any>;
  @Input() loadingTemplate!: TemplateRef<any>;

  @Output() lazyLoad = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() onSelectData = new EventEmitter<any>();

  isSelection: boolean = false;
  selectedData!: T[];

  onSelect(event: TableRowSelectEvent) {
    this.onSelectData.emit(this.selectedData);
  }

  onUnselect(event: TableRowUnSelectEvent<any>) {
    this.selectedData.filter((data: any) => data.id !== event.data.id);
    this.onSelectData.emit(this.selectedData);
  }
}
