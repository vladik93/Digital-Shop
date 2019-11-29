import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal/';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  session = false;
  user = {};
  cart = {};
  lastOrder;
  loginError;

  loginData = {
    email: '',
    password: ''
  };

  productCount = [];
  orderCount = [];

  modalRef: BsModalRef;
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  };

  constructor(
    private _userService: UserService,
    private _productService: ProductService,
    private _cartService: CartService,
    private _orderService: OrderService,
    private _router: Router,
    private modal: BsModalService
  ) { }

  ngOnInit() {
    this.cartCheck();
    this.loginCheck();
    this.getProductCount();
    this.getOrderCount();
    setInterval(() => {
      this.checkLoggedOut();
    }, 50);
  }

  onLogin(data: NgForm) {
    this._userService.login(JSON.stringify(data.value)) // Important to stringify JSON data value
    .subscribe(
      success => {
        if (success.admin === true) {
          this._router.navigate(['/admin']);
          this._userService.isLoggedIn = true;
          this._userService.isAdmin = true;
          sessionStorage.setItem('username', success.name + ' ' + success.last_name);
        } else {
          this.session = true;
          this._userService.isLoggedIn = true;
          this.loginCheck();
          this.cartCheck(); // CHECK CART ONLY AFTER USER LOGIN (DOH!)
          sessionStorage.setItem('username', success.name + ' ' + success.last_name);
        }
      },
      err => {
        this._userService.isLoggedIn = false;
        this.loginError = 'Email and/or password is invalid';
        console.log(err);
      }
    );
  }

  loginCheck() {
    this._userService.getUserData()
    .subscribe(
      res => {
        this.session = true;
        this.user = res;
        console.log('User logged in');
      },
      err => {
        console.log('No user logged in');
      }
    );
  }

  cartCheck() {
    this._cartService.getCartData()
    .subscribe(
      res => this.cart = res,
      err => {
        this.cart = undefined;
        this.lastOrderCheck();
      }
    );
  }

  getProductCount() {
    this._productService.getProductCount()
    .subscribe(
      res => this.productCount = res[0],
      err => console.log(err)
    );
  }

  getOrderCount() {
    this._orderService.getOrderCount()
    .subscribe(
      res => this.orderCount = res[0],
      err => console.log(err)
    );
  }

  onStartShopping(template: TemplateRef<any>) {
    this._cartService.getAllCartItems()
    .subscribe(
      res => {
        this._router.navigate(['/shopping']);
    },
      err => this.modalRef = this.modal.show(template, this.config)
    );
  }

  onCreateCart() {
    this._cartService.createCart()
    .subscribe(
      res => {
        this.modalRef.hide();
        this._router.navigate(['/shopping']);
      },
      err => console.log(err)
    );
  }

  lastOrderCheck() {
    this._orderService.getLastOrderByUser()
    .subscribe(
      res => this.lastOrder = res[0],
      err => this.lastOrder = undefined
    );
  }

  checkLoggedOut() {
    if (sessionStorage.getItem('username') === null) {
      this.session = false;
    } else {
      this.session = true;
    }
  }
}


