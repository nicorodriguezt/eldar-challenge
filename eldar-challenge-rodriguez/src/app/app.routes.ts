import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'products',
                component: ProductListComponent,
                canActivate: [roleGuard(['user', 'admin'])]
            },
            {
                path: 'products/:id',
                component: ProductDetailComponent,
                canActivate: [roleGuard(['admin'])]
            },
            {
                path: 'products/create',
                component: ProductDetailComponent,
                canActivate: [roleGuard(['admin'])]
            }
        ]
    },
    {
        path: '**', component: NotFoundComponent

    }
    
];
