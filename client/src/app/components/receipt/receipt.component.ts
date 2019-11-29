import { Component, OnInit, TemplateRef } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal/';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  receipt;
  receiptSearchText = '';

  modalRef: BsModalRef;

  constructor(
    private _orderService: OrderService,
    private _cartService: CartService,
    private _userService: UserService,
    private _router: Router,
    private modal: BsModalService
  ) { }

  ngOnInit() {
    this.orderDetails();
    this.checkOrderExists();
  }

  orderDetails() {
    this._orderService.getOrderDetails()
    .subscribe(
      res => this.receipt = res[0],
      err => {
        this._router.navigate(['/main']);
      }
    );
  }

  receiptCloseWarning(template: TemplateRef<any>) {
    this.modalRef = this.modal.show(template);
  }

  onReceiptDownload() {
    const opt = {
      margin:       0,
      filename:     'receipt.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3,  y: window.pageYOffset },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

   html2pdf().from(document.getElementById('download-content')).set(opt).save();
  }

  deleteCartAndRedirect() {
    this._cartService.deleteCart()
    .subscribe(
      res => {
        console.log(res);
        this._router.navigate(['/main']);
      },
      err => console.log(err)
    );
  }

  checkOrderExists() {
    this._orderService.checkOrderExist()
    .subscribe(
      res => console.log('order exists'),
      err => {
        this._router.navigate(['/main']);
        console.log('order not found');
      }
    );
  }

  userData() {
    this._userService.getUserData()
    .subscribe(
      res => console.log(res),
      err => {
        this._router.navigate(['/main']);
      }
    );
  }

  canDeactivate() {
    alert('Warning: Your cart will be deleted. Please renew it at the login page to continue shopping');
    this._cartService.deleteCart()
    .subscribe(
      res => {
        console.log(res);
        this._router.navigate(['/main']);
      },
      err => console.log(err)
    );
    return true;
  }
}
