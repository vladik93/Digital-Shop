import { Component, OnInit, ElementRef, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { LocationService } from '../../services/location.service';
import { Product } from '../../models/product';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal/';
import { DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  user = {};
  products: Product[] = [];
  categories = [];
  // tslint:disable-next-line:max-line-length
  creditCardRegex = '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$';

  orderInProcess = false;
  orderSubmitAttempted = false;

  productByNameModel = '';
  orderFormModel = {
    city: '',
    street: '',
    shipping_date: '',
    credit_card: '4123456789012345'
  };

  productByName: Product[] = [];
  items = [];

  cities;

  streets;


  shippingDates: DatepickerDateCustomClasses[] = [
    {date: new Date('2019-11-21'), classes: ['bg-primary', 'text-white']},
    {date: new Date('2019-09-29'), classes: ['bg-primary', 'text-white']},
    {date: new Date('2019-10-11'), classes: ['bg-primary', 'text-white']},
  ];

  datesDisabled = [];

  dateError;
  creditCardError;
  deleteMessage;


  // Modal Config
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
    private _locationService: LocationService,
    private _http: HttpClient,
    private _router: Router,
    private el: ElementRef,
    private modal: BsModalService) { }

  ngOnInit() {
    this.userData();
    this.allProducts();
    this.allCategories();
    this.allCartItems();
    this.dateCheck();
    this.fetchAllCities();

    setInterval(() => {
      this.allCartItems();
    }, 2000);
  }

  userData() {
    this._userService.getUserData()
    .subscribe(
      data => console.log(data),
      err => {
        this._router.navigate(['/main']);
      }
    );
  }

  allProducts() {
    this._productService.getProducts()
    .subscribe(
      res => this.products = res,
      err => console.log(err)
    );
  }

  allCategories() {
    this._productService.getProductCategories()
    .subscribe(
      res => this.categories = res,
      err => console.log(err)
    );
  }

  onCollapseCart() {
    document.getElementById('cart-section')
    .style.display = 'none';

    document.getElementById('product-section')
    .className = 'col-md-10';

    document.getElementById('hide-cart')
    .style.display = 'none';

    document.getElementById('show-cart')
    .style.display = 'block';


  }

  onExpandCart() {
    document.getElementById('cart-section')
    .style.display = 'block';

    document.getElementById('product-section')
    .className = 'col-md-6';

    document.getElementById('show-cart')
    .style.display = 'none';

    document.getElementById('hide-cart')
    .style.display = 'block';
  }

  onProductSearch(value: string) {
    if (value === '') {
      this._productService.getProducts()
      .subscribe(
        res => this.products = res,
        err => console.log(err)
      );
    } else {
      this._productService.getProductsByName(value)
      .subscribe(
        res => this.products = res,
        err => console.log(err)
      );
    }
  }

  onCategorySelect(data) {
    this._productService.getProductsByCategory(data)
    .subscribe(
      res => this.products = res,
      err => console.log(err)
    );
  }

  onAllCategorySelect() {
    this._productService.getProducts()
    .subscribe(
      res => this.products = res,
      err => console.log(err)
    );
  }

  // CART REQUESTS
  allCartItems() {
    this._cartService.getAllCartItems()
    .subscribe(
      res => this.items = res[0],
      err => console.log(err)
    );
  }

  addNewItem(data: NgForm) { // All this time you simply weren't passing the data correctly (dumbass)
    console.log(data.value); // trying to pass only the product_id instead of the whole data body ...
    this._cartService.postNewCartItem(data.value) // sd
    .subscribe(
      res => {
        this.modalRef.hide();
        console.log(res);
      },
      err => console.log(err)
    );
  }

  productQuantityModal(template: TemplateRef<any>) {
    this.modalRef = this.modal.show(template, this.config);
  }

  toOrderForm() {
    this.orderInProcess = true;
  }

  onBackToShop() {
    this.orderInProcess = false;
  }

  onCompleteOrder(form: NgForm) {
    if (form.controls['credit_card'].valid === false) {
      console.log('Enter valid credit number');
      this.creditCardError = 'Credit card number is not valid';
      this.orderSubmitAttempted = true;

    } else {
      // console.log(form.value.shipping_date);
      const data = {
        shipping_city: form.value.shipping_city,
        shipping_street: form.value.shipping_street,
        shipping_date: new Date(form.value.shipping_date).setHours(0, 0, 0, 0), // Set hours accordingly to accound for timezone
        credit_card: form.value.credit_card.substr(form.value.credit_card.length - 4)
      };

      if (this.shippingDates.find(item => item.date.setHours(0, 0, 0, 0) === data.shipping_date)) {
        this._orderService.postNewOrder(data)
        .subscribe(
          res => {
            console.log(res);
            this.orderSubmitAttempted = true;
            console.log('valid date' + data.shipping_date + ' ' + this.shippingDates);
            this._router.navigate(['/receipt']);
          },
          err => {
            console.log(err);
            this.orderSubmitAttempted = true;
          }
        );
      } else {
        this.dateError = 'This date is not valid';
        this.orderSubmitAttempted = true;
      }
    }
  }


  dateCheck() {
    for (let i = 0; i < this.shippingDates.length; i++) {
      this._orderService.getShippingDateCount(this.shippingDates[i].date)
      .subscribe(
        res => {
          if (res[0].shipping_count === 3) {
            this.shippingDates[i].classes = ['bg-danger', 'text-white'];
            this.datesDisabled.push(this.shippingDates[i].date);
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  onCalClose() {
    this.dateError = undefined;
  }

  fetchAllCities() {
    this._locationService.getCities()
    .subscribe(
      res => this.cities = res,
      err => console.log(err)
    );
  }

  onCitySelect(name) {
    this._locationService.getStreetsByCity(name)
    .subscribe(
      res => this.streets = res,
      err => console.log(err)
    );
  }

  onItemDelete(id) {
    this._cartService.deleteItemById(id)
    .subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

  deleteItemsModal(template: TemplateRef<any>) {
    this.modalRef = this.modal.show(template, this.config);
  }

  onDeleteAllItems() {
    this._cartService.deleteAllItems()
    .subscribe(
      res => {
        if (res.deletedCount === 0) {
          this.deleteMessage = 'The cart is already empty';
        } else {
          this.modalRef.hide();
          console.log(res);
        }
      },
      err => console.log(err)
    );
  }

  onDeleteModalClose() {
    this.deleteMessage = undefined;
  }
}
