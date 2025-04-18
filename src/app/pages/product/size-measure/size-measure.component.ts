import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectChangeEvent, SelectModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {AccordionModule} from 'primeng/accordion';
import {FloatLabelModule} from 'primeng/floatlabel';
import {TextareaModule} from 'primeng/textarea';
import {Button, ButtonModule} from 'primeng/button';
import {CustomerService} from '../../../services/customer/customer.service';
import {ProductService} from '../../../services/product/product.service';
import {ActivatedRoute} from '@angular/router';
import {Product} from '../../../models/stock.model';
import {CurrencyPipe, Location} from '@angular/common';
import {CartService} from '../../../services/cart/cart.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {AddToCartModalComponent} from '../../../components/cart/add-to-cart-modal/add-to-cart-modal.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

interface SizeMeasurement {
  id: string | null;
  code: string; // e.g. VUHOH
  length?: number,
  waist?: number,
  chest?: number,
  collar?: number,
  shoulder?: number,
  sleeveLength?: number,
  upperSleeveRim?: number,
  lowerSleeveRim?: number,
  thigh?: number,
  knee?: number,
  foot?: number,
  hip?: number,
  armLength?: number,
  cuff?: number,
  kriss?: number,
}

interface Photo {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-size-measure',
  templateUrl: './size-measure.component.html',
  styleUrls: ['./size-measure.component.css'],
  providers: [MessageService, ConfirmationService],
  imports: [FormsModule, AddToCartModalComponent, ConfirmDialogModule, ButtonModule, ToastModule, SelectModule, InputTextModule, AccordionModule, FloatLabelModule, TextareaModule, CurrencyPipe, ReactiveFormsModule],
})
export class SizeMeasureComponent implements OnInit {
  @ViewChild('addToCartModal') public addToCartModal!: AddToCartModalComponent;
  isAddingNewCustomer: boolean = false;
  selectedCustomer = new FormControl('');
  selectedSizeMeasurement: any = {};
  customers: any[] = [];
  photos: (Photo | null)[] = Array(6).fill(null);
  onAddToCart = false;

  sizeFields = [
    { key: 'length', label: 'Length', value: 0 },
    { key: 'waist', label: 'Waist', value: 0 },
    { key: 'chest', label: 'Chest', value: 0 },
    { key: 'collar', label: 'Collar', value: 0 },
    { key: 'shoulder', label: 'Shoulder', value: 0 },
    { key: 'sleeveLength', label: 'Sleeve Length', value: 0 },
    { key: 'upperSleeveRim', label: 'Upper Sleeve Rim', value: 0 },
    { key: 'lowerSleeveRim', label: 'Lower Sleeve Rim', value: 0 },
    { key: 'thigh', label: 'Thigh', value: 0 },
    { key: 'knee', label: 'Knee', value: 0 },
    { key: 'foot', label: 'Foot', value: 0 },
    { key: 'kriss', label: 'Kriss', value: 0 },
    { key: 'hip', label: 'Hip', value: 0 },
    { key: 'armLength', label: 'Arm Length', value: 0 },
    { key: 'cuff', label: 'Cuff', value: 0 },
  ];

  newCustomer = {
    name: '',
    address: '',
    phone: '',
    email: '',
  };

  formMeasurement: FormGroup = new FormGroup({});

  notes = ''

  product: Product | null = null;
  productId: string | null = null;
  params = {
    page: 1,
    limit: 10,
    orderBy: '',
    order: '',
    search: '',
  }

  constructor(
    private customerService: CustomerService,
    private cartService: CartService,
    private productService: ProductService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.formMeasurement = this.fb.group({
      measurements: this.fb.array([] as FormGroup[]) // ✅ didefinisikan sebagai FormArray of FormGroup
    });

    if (this.productId) {
      this.customerService.getCustomers(this.params)
      this.customerService.customers.subscribe(cust => {
        this.customers = cust;
      })
      this.productService.getProductDetail(Number(this.productId));
      this.productService.product.subscribe(product => {
        this.product = product

        if(this.addToCartModal) this.addToCartModal.product = product;
      })

      this.customerService.measurements.subscribe(measurement => {
        if(measurement.length > 0) this.setMeasurements(measurement);
      })
    }

  }

  get measurements(): FormArray {
    return this.formMeasurement.get('measurements') as FormArray;
  }

  getMeasurementKeys(group: any): string[] {
    const measurementKeys = [
      'length', 'waist', 'chest', 'collar', 'shoulder',
      'sleeveLength', 'upperSleeveRim', 'lowerSleeveRim',
      'thigh', 'knee', 'foot', 'hip', 'armLength',
      'cuff', 'kriss'
    ];

    return Object.keys(group.controls).filter(key => measurementKeys.includes(key));
  }

  getImagesFormArray(index: number): FormArray {
    return this.measurements.at(index).get('images') as FormArray;
  }

  setMeasurements(data: any[]): void {
    const formArray = this.fb.array([] as FormGroup[]);

    data.forEach(item => {
      const imageArray = this.fb.array(
        item.images?.map((img: any) =>
          this.fb.group({
            id: [img.id],
            url: [img.url],
            full_image_url: [img.full_image_url],
            created_at: [img.created_at],
            updated_at: [img.updated_at],
          })
        ) || []
      );

      const group = this.fb.group({
        id: [item.id],
        code: [item.code],
        length: [item.length],
        waist: [item.waist],
        chest: [item.chest],
        collar: [item.collar],
        shoulder: [item.shoulder],
        sleeveLength: [item.sleeveLength],
        upperSleeveRim: [item.upperSleeveRim],
        lowerSleeveRim: [item.lowerSleeveRim],
        thigh: [item.thigh],
        knee: [item.knee],
        foot: [item.foot],
        hip: [item.hip],
        armLength: [item.armLength],
        cuff: [item.cuff],
        kriss: [item.kriss],
        images: imageArray,
      });

      formArray.push(group); // sekarang ini aman
    });

    this.formMeasurement.setControl('measurements', formArray);
  }

  onSelectCustomer(e: SelectChangeEvent) {
    if (e.originalEvent.type == 'click') {
      this.customerService.getMeasurements(e.value);
    }
  }

  goBack(): void {
    this.location.back();
  }

  addNewCustomer(val: boolean) {
    this.isAddingNewCustomer = val;
  }

  selectedMeasurementIndex: number = -1;
  selectMeasurement(index: number) {
    this.selectedSizeMeasurement = this.measurements.at(index)?.value;
    this.selectedMeasurementIndex = index;
  }


  editMeasurement(size: any) {
    console.log('Edit measurement:', size);
  }

  deleteMeasurement(event: Event, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        const measurementId = this.measurements.at(index)?.value?.id
        if (measurementId) {
          this.customerService.deleteMeasurement(measurementId)
            .subscribe({
              next: () => {
                if (this.selectedMeasurementIndex === index) {
                  this.selectedMeasurementIndex = -1;
                  this.selectedSizeMeasurement = null;
                }
                this.measurements.removeAt(index);
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
              },
              error: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Gagal karena ada pesanan/keranjang yg menggunakan measurement ini' });
              }
            })
        } else {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Id measurement not found' });
        }

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  get selectedCustomerData() {
    return this.customers.find(cust => cust.id == this.selectedCustomer.value) ?? { measurements: [] };
  }


  addNewMeasurement() {
    // Tambahkan ke FormArray
    const measurementFormGroup = this.fb.group({
      id: 'new-measurement',
      length: [0],
      waist: [0],
      chest: [0],
      collar: [0],
      shoulder: [0],
      sleeveLength: [0],
      upperSleeveRim: [0],
      lowerSleeveRim: [0],
      thigh: [0],
      knee: [0],
      foot: [0],
      hip: [0],
      armLength: [0],
      cuff: [0],
      kriss: [0],
    });

    this.selectedSizeMeasurement = {
      id: 'new-measurement',
      ...measurementFormGroup.value
    };

    (this.formMeasurement.get('measurements') as FormArray).push(measurementFormGroup);
  }

  addImageToMeasurement(measurementIndex: number, image: any): void {
    const imageGroup = this.fb.group({
      id: [image.id],
      url: [image.url],
      created_at: [image.created_at],
      updated_at: [image.updated_at],
    });

    const imagesArray = this.getImagesFormArray(measurementIndex);
    imagesArray.push(imageGroup);
  }

  onPhotoSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photos[index] = {
          file: file,
          preview: reader.result as string
        };
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(measurementIndex: number, photoIndex: number): void {
    const imagesArray = this.getImagesFormArray(measurementIndex);
    imagesArray.removeAt(photoIndex);
  }

  removePhotoPreview(index: number) {
    this.photos[index] = null;
  }

  isDisabledBtn() {
    if (this.isAddingNewCustomer) {
      if (
        !this.newCustomer.name ||
        !this.newCustomer.address ||
        !this.newCustomer.email ||
        !this.newCustomer.phone
      ) {
        return true;
      }
    } else {
      if (!this.selectedCustomer.value || !this.selectedSizeMeasurement?.id) {
        return true;
      }
    }

    return false;
  }


  addToCart() {
    if (!this.productId) return;

    const customerId = Number(this.selectedCustomer.value);
    const productId = Number(this.productId);
    const quantity = 1;

    const sizes: { [key: string]: number } = {};
    this.sizeFields.forEach(size => {
      sizes[size.key] = Number(size.value);
    });

    if (this.selectedMeasurementIndex > -1) {
      this.selectedSizeMeasurement = this.measurements.at(this.selectedMeasurementIndex)?.value;
    }

    const files = this.photos.filter(photo => photo !== null);

    this.onAddToCart = true;
    const submitCart = (measurementId: number, targetCustomerId: number) => {
      if (files.length > 0) {
        const formData = new FormData();
        formData.append('productId', productId.toString());
        formData.append('quantity', quantity.toString());
        formData.append('customerMeasurementId', measurementId.toString());

        files.forEach(photo => {
          if (photo?.file) {
            formData.append('photos', photo.file);
          }
        });

        this.cartService.addToCartWithPhotos(targetCustomerId, formData).subscribe({
          next: (cart) => this.handleAddToCartSuccess(cart),
          error: () => this.messageService.add({ detail: 'Error adding to cart', severity: 'error' })
        });

      } else {
        this.cartService.createCart({
          customerId,
          productId,
          quantity,
          customerMeasurementId: measurementId.toString(),
        }).subscribe({
          next: (cart) => this.handleAddToCartSuccess(cart),
          error: (err) => this.messageService.add({ detail: err?.error?.message ?? 'Error adding to cart', severity: 'error' })
        });
      }
    };

    const createMeasurementAndSubmit = (targetCustomerId: number) => {
      const payload = this.selectedSizeMeasurement?.id ? this.selectedSizeMeasurement : sizes;
      this.customerService.createMeasurementCustomer(targetCustomerId, payload).subscribe({
        next: (measurement: any) => {
          this.messageService.add({ detail: 'Successfully added size measurement', severity: 'success' });
          submitCart(measurement.id, targetCustomerId);
        },
        error: (err) => {
          this.messageService.add({ detail: err?.error?.message ?? 'Error adding size measurement', severity: 'error' });
        }
      });
    };

    if (this.selectedSizeMeasurement?.id && this.selectedSizeMeasurement?.id !== 'new-measurement') {
      // Measurement sudah ada
      submitCart(this.selectedSizeMeasurement.id, customerId);
    } else {
      // Measurement baru, buat customer kalau perlu
      if (this.isAddingNewCustomer) {
        this.customerService.createCustomer(this.newCustomer).subscribe({
          next: (resp: any) => {
            if(resp.id) createMeasurementAndSubmit(resp.id);
          },
          error: (err) => {
            this.messageService.add({ detail: err?.error?.message ?? 'Error creating new customer', severity: 'error' });
          }
        });
      } else {
        createMeasurementAndSubmit(customerId);
      }
    }
  }

  private handleAddToCartSuccess(cart:any) {
    if (cart?.id) {
      this.addToCartModal.cart = cart;
    }
    this.messageService.add({ detail: 'Success add to cart', severity: 'success' });
    this.addToCartModal.visible = true;
    this.onAddToCart = false;
  }

}
