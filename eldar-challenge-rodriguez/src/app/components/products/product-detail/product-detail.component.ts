import { Component, inject, Input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Product } from '../../../interfaces/product';
import { ProductService } from '../../../services/product.service';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    NavBarComponent,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  @Input() id?: string

  router = inject(Router)
  productService = inject(ProductService)
  messageService = inject(MessageService)
  selectedProduct = signal<Product | null>(null)

  urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  productForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      cost: new FormControl<number | null>(null, [Validators.required, Validators.min(Number.MIN_VALUE)]),
      quantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
      rate: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(5)]),
      category: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required, Validators.pattern(this.urlPattern)])
    }
  );

  ngOnInit() {
    if (this.id) {
      if (!isNaN(parseInt(this.id))) {
        this.productService.searchProductById(+this.id).subscribe({
          next: (res) => {
            if (!res.length) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Producto no encontrado' })
              this.router.navigateByUrl('products')
            } else {
              this.selectedProduct.set(res[0])
              this.setProductValues();
            }
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar el producto' })
            this.router.navigateByUrl('products')
          }
        })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Id de producto incorrecto' })
        this.router.navigateByUrl('products')
      }
    }
  }

  productIdError() {
    
  }

  goBack() {
    this.router.navigateByUrl('products')
  }


  setProductValues() {
    this.productForm.controls['name'].setValue(this.selectedProduct()?.name ?? '')
    this.productForm.controls['cost'].setValue(this.selectedProduct()?.cost ?? null)
    this.productForm.controls['quantity'].setValue(this.selectedProduct()?.quantity ?? null)
    this.productForm.controls['rate'].setValue(this.selectedProduct()?.rate ?? null)
    this.productForm.controls['category'].setValue(this.selectedProduct()?.category ?? '')
    this.productForm.controls['imageUrl'].setValue(this.selectedProduct()?.imageUrl ?? '')
  }

  onSubmit() {

    if (this.selectedProduct()) {
      const productData = { ... this.productForm.value, id: this.selectedProduct()!.id }
      this.productService.updateProduct(productData as Product).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Se modificó el producto' })
          this.router.navigateByUrl('products')
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al modificar el producto' })
        }
      })
    } else {
      const productData = { ... this.productForm.value }
      this.productService.createProduct(productData as Product).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Se creo el nuevo producto' })
          this.router.navigateByUrl('products')
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto' })
        }
      })
    }
  }

  get name() {
    return this.productForm.controls['name'];
  }

  get cost() {
    return this.productForm.controls['cost'];
  }

  get quantity() {
    return this.productForm.controls['quantity'];
  }

  get rate() {
    return this.productForm.controls['rate'];
  }

  get category() {
    return this.productForm.controls['category'];
  }

  get imageUrl() {
    return this.productForm.controls['imageUrl'];
  }
}
