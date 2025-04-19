import { Component } from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SelectModule} from 'primeng/select';
import {FileSelectEvent, FileUploadModule} from 'primeng/fileupload';
import {PrimeNG} from 'primeng/config';
import {ToastModule} from 'primeng/toast';
import {ProgressBarModule} from 'primeng/progressbar';
import {BadgeModule} from 'primeng/badge';
import {MessageService} from 'primeng/api';
import {UserService} from '../../../services/user/user.service';
import {CheckpointService} from '../../../services/checkpoint/checkpoint.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-add-employee',
  imports: [DialogModule, ProgressBarModule, BadgeModule, ButtonModule, InputTextModule, SelectModule, ReactiveFormsModule, FileUploadModule, ToastModule, AsyncPipe],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
  providers: [MessageService]
})
export class AddEmployeeComponent {
  loading = false;
  showAddDialog = false;
  employeeForm: FormGroup;
  files: File[] = [];

  totalSize : number = 0;

  totalSizePercent : number = 0;

  roles = [
    { label: 'DIRECTOR', value: 'DIRECTOR' },
    { label: 'TAILOR', value: 'TAILOR' },
    { label: 'CUTTER', value: 'CUTTER' },
    { label: 'OFFICE', value: 'OFFICE' }
  ];

  constructor(
    private fb: FormBuilder,
    private config: PrimeNG,
    public userService: UserService,
    public checkpointService: CheckpointService,
    public messageService: MessageService,
  ) {
    this.employeeForm = this.fb.group({
      nickname: ['', Validators.required],
      name: ['', Validators.required],
      whatsapp_number: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      role_id: ['', Validators.required],
      checkpoint_id: ['', Validators.required]
    });
  }

  submitEmployee() {
    if (this.employeeForm.valid) {
      this.loading = true;
      const newEmployee = this.employeeForm.value;

      if (this.files.length > 0) {
        this.userService.addEmployeeWithProfile(newEmployee, this.files[0])
        .subscribe({
          next: () => {
            this.loading = false;
            this.employeeForm.reset();
            this.showAddDialog = false;
            this.messageService.add({detail:'Successfully submitted', severity: 'success', life: 3000});
            location.reload();
          },
          error: err => {
            this.loading = false;
            this.messageService.add({detail:err?.error?.message ?? 'Request Failed', severity: 'error', life: 3000});
          }
        });
      } else {
        this.userService.addEmployee(newEmployee)
          .subscribe({
            next: () => {
              this.loading = false;
              this.employeeForm.reset();
              this.showAddDialog = false;
              location.reload();
              this.messageService.add({detail:'Successfully submitted', severity: 'success', life: 3000});
            },
            error: err => {
              this.loading = false;
              this.messageService.add({detail:err?.error?.message ?? 'Request Failed', severity: 'error', life: 3000});
            }
          });
      }
    }
  }

  openDialog() {
    this.showAddDialog = true;
    this.userService.getRoles();
    this.checkpointService.getCheckpointDropdown()
  }

  choose(event:any, callback: () => void) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: File, removeFileCallback: (e: any, i: any) => void, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onSelectedFiles(event: FileSelectEvent) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes?.[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes?.[i]}`;
  }
}
