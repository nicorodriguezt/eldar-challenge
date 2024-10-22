import { Component, inject, model, Signal, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ProductService } from '../../../services/product.service';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DataViewComponent } from './data-view/data-view.component';
import { PaginatorInfo } from '../../../interfaces/paginator-info';
import { ProductStore } from '../../../store/products.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NavBarComponent,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DataViewComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  store = inject(ProductStore)
  productService = inject(ProductService)
  authService = inject(AuthService)
  router = inject(Router)
  searchValue = model<string>('')

  ngOnInit() {
    this.store.loadProducts();
  }

  searchProducts() {
    this.store.searchProduts(this.searchValue())
  }

  createProduct() {
    this.router.navigateByUrl('products/create')
  }

  editProduct(id: number) {
    this.router.navigateByUrl(`products/${id}`)
  }

  pageChanged(paginatorInfo: PaginatorInfo) {
    this.store.changePage(paginatorInfo)
  }


}

