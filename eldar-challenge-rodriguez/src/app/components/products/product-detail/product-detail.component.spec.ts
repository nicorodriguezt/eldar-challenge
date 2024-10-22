import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../services/product.service';
import { of } from 'rxjs';
import { Product } from '../../../interfaces/product';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent
  let fixture: ComponentFixture<ProductDetailComponent>
  let productService: ProductService
  const product: Product = { id: 2, name: 'Test', cost: 15.50, rate: 1, quantity: 25, category: 'Accesorios', imageUrl: 'http://www.test.com' }
  const invalidProduct: Product = { id: 2, name: '', cost: -15.50, rate: 7, quantity: -5, category: '', imageUrl: 'Texto que no es una url' }

  beforeEach(async () => {
    let messageServiceSpy = jasmine.createSpy('MessageService')
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageServiceSpy },
        ProductService
      ],
      imports: [ProductDetailComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ProductDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  });

  beforeEach(inject([ProductService], (service: any) => {
    productService = service;
  }));

  it('should create', () => {
    expect(component).toBeTruthy()
  });

  it('should correctly set selected product values onInit', fakeAsync(() => {
    component.id = product.id.toString()
    spyOn(productService, 'searchProductById').and.returnValue(of([product]))
    component.ngOnInit()
    tick();
    fixture.whenStable().then(() => {
      expect(component.selectedProduct()).toEqual(product)
      const productData = { ...component.productForm.value, id: component.selectedProduct()!.id }
      expect(productData).toEqual(product)
    })
  }));

  it('should have invalid inputs', () => {
    component.selectedProduct.set(invalidProduct)
    fixture.detectChanges()
    component.setProductValues()
    fixture.detectChanges()
    expect(component.productForm.controls.name.invalid).toBeTrue
    expect(component.productForm.controls.cost.invalid).toBeTrue
    expect(component.productForm.controls.cost.hasError('min')).toBeTrue
    expect(component.productForm.controls.quantity.invalid).toBeTrue
    expect(component.productForm.controls.quantity.hasError('min')).toBeTrue
    expect(component.productForm.controls.rate.invalid).toBeTrue
    expect(component.productForm.controls.rate.hasError('max')).toBeTrue
    expect(component.productForm.controls.category.invalid).toBeTrue
    expect(component.productForm.controls.imageUrl.invalid).toBeTrue
    expect(component.productForm.controls.imageUrl.hasError('pattern')).toBeTrue
    expect(component.productForm.valid).toBeFalse
  });

  it('should call create product', () => {
    const spy = spyOn(productService, 'createProduct').and.callThrough()
    fixture.detectChanges()
    component.setProductValues()
    fixture.detectChanges()
    component.onSubmit()
    expect(spy).toHaveBeenCalledTimes(1)
  });

  it('should call update product', () => {
    const spy = spyOn(productService, 'updateProduct').and.callThrough()
    component.selectedProduct.set(product)
    fixture.detectChanges()
    component.setProductValues()
    fixture.detectChanges()
    component.onSubmit()
    expect(spy).toHaveBeenCalledTimes(1)
  });

});
