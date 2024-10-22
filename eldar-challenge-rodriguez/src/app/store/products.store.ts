import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ProductService } from '../services/product.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Product } from '../interfaces/product';
import { PaginatorInfo } from '../interfaces/paginator-info';
import { ProductResponse } from '../interfaces/product-response';

interface ProductState {
  products: Product[];
  productsSize: number
  searchText: string
  currentPage: PaginatorInfo;
}

const initialState: ProductState = {
  products: [],
  productsSize: 0,
  searchText: '',
  currentPage: { first: 0, rows: 5 }
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ products, productsSize }) => ({
    productList: computed(() => products()),
    productSize: computed(() => productsSize())
  })),
  withMethods((store, productService = inject(ProductService)) => ({
    resetStore: () => {
      patchState(store, initialState)
    },
    loadProducts: rxMethod<void>(
      pipe(
        switchMap(() => {
          return productService.getProducts(store.currentPage.first(), store.currentPage.rows(), store.searchText()).pipe(
            tap((productResponse) => {
              const productResponseObject = productResponse as ProductResponse
              patchState(store, { products: productResponseObject.products, productsSize: productResponseObject.productsSize });
            })
          );
        })
      )
    ),
    searchProduts: rxMethod<string>(
      pipe(
        switchMap((searchValue) => {
          return productService.getProducts(0, store.currentPage.rows(), searchValue).pipe(
            tap((productResponse) => {
              const productResponseObject = productResponse as ProductResponse
              patchState(store, {
                products: productResponseObject.products,
                productsSize: productResponseObject.productsSize,
                searchText: searchValue
              });
            })
          );
        })
      )
    ),
    changePage: rxMethod<PaginatorInfo>(
      pipe(
        switchMap((pageInfo) => {
          return productService.getProducts(pageInfo.first, pageInfo.rows, store.searchText()).pipe(
            tap((productResponse) => {
              const productResponseObject = productResponse as ProductResponse
              patchState(store, {
                products: productResponseObject.products,
                productsSize: productResponseObject.productsSize,
                currentPage: { first: pageInfo.first, rows: pageInfo.rows }
              });
            })
          );
        })
      )
    ),
  }))
);