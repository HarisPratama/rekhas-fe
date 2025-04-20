import {Component, OnInit, ViewChild} from '@angular/core';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {AddEmployeeComponent} from '../../components/employee/add-employee/add-employee.component';
import {UserService} from '../../services/user/user.service';
import {Column, GenericTableComponent} from '../../components/global/generic-table/generic-table.component';
import {PaginationReq} from '../../../shared/models/pagination-req.model';
import {User} from '../../services/user/shared/interface/user.interface';
import {PaginatorState} from 'primeng/paginator';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {TabsModule} from 'primeng/tabs';
import {SearchInputComponent} from '../../components/shared/components/search-input/search-input.component';
import { ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';

@Component({
  selector: 'app-employee',
  imports: [TabsModule, AvatarModule, AvatarGroupModule, CardModule, IconFieldModule, InputIconModule, ButtonModule, TableModule, InputTextModule, AddEmployeeComponent, GenericTableComponent, SearchInputComponent, ToastModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  providers:[MessageService],
})
export class EmployeeComponent implements OnInit {
  @ViewChild('addEmployeeModal') addEmployeeModal!: AddEmployeeComponent;

  virtualEmployee: User[] = [];
  selectedEmployee: User[] = [];
  loading = false;
  first = 0;
  rows = 5;
  totalRecords = 0;

  cols: Column[] = [
    { field: 'name', header: 'Employee Name' },
    { field: 'role', header: 'Role' },
    { field: 'nick_name', header: 'Nick Name' },
    { field: 'placement', header: 'Placement' },
    { field: 'detail', header: 'Detail' },
  ];

  params: PaginationReq = {
    page: 1,
    limit: 5,
    order: '',
    orderBy: '',
    search: '',
    role: ''
  };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.virtualEmployee = Array.from({ length: 5 });
  }

  showAddEmployee() {
    this.addEmployeeModal.openDialog();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (event) {
      this.first = event.first ?? 0;
      this.rows = event.rows ?? 5;
      this.params.page = Math.floor(this.first / this.rows) + 1;
      this.params.limit = this.rows;

      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    this.loading = true;

    this.userService.getEmployee(this.params)
    this.userService.employees.subscribe(employee => {
      this.virtualEmployee = employee;
      this.loading = false;
    })

    this.userService.pagination.subscribe(pagination => {
      this.totalRecords = pagination.total;
    });
  }

  onSelectEmployee(employee: User[]): void {
    this.selectedEmployee = employee;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.params.page = Math.floor(this.first / this.rows) + 1;
    this.params.limit = this.rows;

    this.virtualEmployee = Array.from({ length: this.rows });
    this.loadEmployee();
  }

  onSearchUser(e: string) {
    this.params.search = e;
    this.loadEmployee();
  }
}
