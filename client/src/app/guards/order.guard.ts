import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from '../services/order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderGuard implements CanActivate {
  constructor(private orderService: OrderService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.orderService.getOrderDetails) {
      return true;
    } else {
      this.router.navigate(['/main']);
      return false;
    }
  }
}
