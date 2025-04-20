import {Component, EventEmitter, Input, Output} from '@angular/core';
import { PrimeNG } from 'primeng/config';
import {FileSelectEvent, FileUpload} from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-upload-drag-drop',
  imports: [FileUpload, ButtonModule, BadgeModule, ProgressBar, ToastModule, CommonModule],
  templateUrl: './upload-drag-drop.component.html',
  styleUrl: './upload-drag-drop.component.css'
})
export class UploadDragDropComponent {
  @Output() selectedFile: EventEmitter<File[]> = new EventEmitter();
  @Output() onUpload: EventEmitter<File[]> = new EventEmitter();
  @Input() acceptedFiles: string = 'image/*';
  @Input() fileType: string = 'image';
  files: File[] = [];

  totalSize : number = 0;

  totalSizePercent : number = 0;


  constructor(private config: PrimeNG) {}


  choose(event: any, callback: () => void): void {
    callback();
  }

  onRemoveTemplatingFile(event:any, file:any, removeFileCallback: (event:any, index:any) => void, index:any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: () => void) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
  }

  onSelectedFiles(event:FileSelectEvent) {
    this.files = event.currentFiles;
    this.files.forEach((file:any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
    this.selectedFile.emit(this.files);
  }

  uploadEvent(callback: () => void ) {
    callback();
    this.onUpload.emit(this.files);
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes ? sizes : [0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes ? sizes[i] : 'kb'}`;
  }
}
