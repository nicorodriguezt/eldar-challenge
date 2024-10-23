import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: '',
  styles: ''
})
export class NotFoundComponent {

  constructor(private router: Router, private messageService: MessageService) {
    messageService.add({ severity: 'error', summary: 'Ups', detail: 'Parece que esa ruta no existe!' })
    router.navigateByUrl('products')
  }
}
