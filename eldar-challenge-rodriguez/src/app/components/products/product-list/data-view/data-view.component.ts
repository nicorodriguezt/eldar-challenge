import { CommonModule, CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Product } from '../../../../interfaces/product';
import { ButtonModule } from 'primeng/button';
import { PaginatorInfo } from '../../../../interfaces/paginator-info';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    CurrencyPipe,
    PaginatorModule
  ],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css'
})
export class DataViewComponent {

  first: number = 0
  rows: number = 5
  products = input<Product[]>([])
  productsSize = input<number>(0)
  canCreate = input<boolean>(false)
  canEdit = input<boolean>(false)
  onPageChanged = output<PaginatorInfo>()
  onCreateProduct = output()
  onEditProduct = output<number>()


  getSeverity(product: Product) {
    if (product.quantity > 100) {
      return 'success'
    } else if (product.quantity > 50) {
      return 'warning'
    } else if (product.quantity == 0) {
      return 'secondary'
    } else {
      return 'danger'
    }
  }

  getQuantityText(quantity: number) {
    if (quantity === 0) {
      return 'Agotado'
    }
    return quantity.toString()
  }

  editProductClick(id: number) {
    this.onEditProduct.emit(id)
  }

  createProductClick() {
    this.onCreateProduct.emit()
  }

  onPageChange(event: any) {
    window.scrollTo(0, 0)
    this.onPageChanged.emit({ first: event.first, rows: event.rows })
  }
}
