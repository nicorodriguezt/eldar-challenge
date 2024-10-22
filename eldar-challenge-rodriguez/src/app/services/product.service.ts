import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product';
import { ProductResponse } from '../interfaces/product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient)

  baseUrl = `${environment.apiUrl}/products`;

  getProducts(start: number, limit: number, search: string) {
    const searchParam = search ? `&name_like=${search}` : ''
    return this.http.get<ProductResponse>(`${this.baseUrl}?_start=${start}&_limit=${limit}${searchParam}`, { observe: 'response' }).pipe(
      map(res => {
        return { products: res.body ?? [], productsSize: parseInt(res.headers.get('x-total-count') ?? '0') }
      })
    )
  }

  searchProductById(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}?id=${id}`)
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${product.id}`, product)
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product)
  }

}