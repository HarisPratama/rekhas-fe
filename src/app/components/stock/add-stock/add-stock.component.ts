import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import {TextareaModule} from 'primeng/textarea';
import {InputNumber} from 'primeng/inputnumber';
import {Select} from 'primeng/select';
import {FileSelectEvent, FileUpload, FileUploadEvent} from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';
import {UploadDragDropComponent} from '../../global/micro/upload-drag-drop/upload-drag-drop.component';
import {TabsModule} from 'primeng/tabs';
import {ProductService} from '../../../services/product/product.service';
import {MessageService} from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-add-stock',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    TextareaModule,
    InputNumber,
    Select,
    FileUpload,
    ToastModule,
    UploadDragDropComponent,
    TabsModule,
  ],
  providers: [MessageService],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent implements OnInit {
  stockForm!: FormGroup;
  showModal = false;
  selectedImages: { [key: string]: File } = {};
  mainImage: File | undefined;

  types = [
    { name: 'Collection', code: 'COLLECTION' },
    { name: 'Regular', code: 'REGULAR' },
    { name: 'Ready to wear', code: 'READY-TO-WEAR' },
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      fabric: [''],
      type: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      description: [''],
    });
  }


  close() {
    this.showModal = false;
  }

  getImagePreview(key: string): string | null {
    const file = this.selectedImages[key];
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  onSelectMainImage(image: any[]) {
    this.mainImage = image[0] as File;
    console.log(this.mainImage);
  }

  onSelectedFiles(event: FileSelectEvent, key: string) {
    if (event.currentFiles && event.currentFiles.length > 0) {
      this.selectedImages[key] = event.currentFiles[0];
      console.log(`Selected image for ${key}:`, this.selectedImages[key]);
    }
    console.log(this.selectedImages, '<<< this.selectedImages')
  }

  removeSelectedImage(key: string): void {
    delete this.selectedImages[key];
  }

  clearForm() {
    this.stockForm.reset();
  }

  submitForm() {
      if (this.stockForm.valid && this.mainImage?.name) {
        const values = this.stockForm.value;

        // Handle API call here
        const formData = new FormData();

        Object.keys(values).forEach(key => {
          formData.append(key, values[key]);
        });

        if (this.mainImage) {
          formData.append('image', this.mainImage);
        }

        this.productService.uploadProduct(formData).subscribe({
          next: res => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success add product', life: 3000 });
            if (res.id) {
              const formDataImages = new FormData();

              for (const key in this.selectedImages) {
                  formDataImages.append(`files`, this.selectedImages[key], this.selectedImages[key]?.name);
                  formDataImages.append('angles', key);
                  formDataImages.append('remarks', key);
              }

              this.productService.bulkUploadProductImage(res.id, formDataImages).subscribe({
                next: res => {
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success upload product images', life: 3000 });
                  setTimeout(() => {
                    this.close()
                  }, 3000)
                },
                error: err => {
                  this.messageService.add({severity: 'error', summary: 'Error uploading product images', detail: err.message});
                }
              })
            }
          },
          error: err => {
            console.error('Error', err)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          },
        });

        // this.close();
      }
  }
}
