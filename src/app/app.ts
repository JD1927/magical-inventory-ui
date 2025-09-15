import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import type { IProduct } from './products/models/product.model';
import { ProductService } from './products/services/product/product.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private productService = inject(ProductService);
  protected readonly title = signal('magical-inventory-ui');

  products = toSignal(this.productService.getAll(), { initialValue: [] as IProduct[] });
}
