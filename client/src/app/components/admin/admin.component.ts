import { Component, OnInit, OnDestroy, OnChanges, ElementRef, TemplateRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy, OnChanges {
  categories = [];
  products = [];

  updateInProgress = false;

  productModel = {
    _id: '',
    name: '',
    category_id: '',
    price: null,
    image: 'images/no_image.jpg'
  };

  productById = {};

  modalRef: BsModalRef;
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  };

  constructor(
    private _productService: ProductService,
    private _userService: UserService,
    private _router: Router,
    private modal: BsModalService) { }

  ngOnInit() {
    this.fetchCategories();
    this.fetchAllProducts();
    this.userData();

    setInterval(() => {
      this.fetchCategories();
    }, 2000);
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

  checkAdmin() {
    this._userService.getUserData()
    .subscribe(
      res => {
        if (res.admin === true) {
          this._router.navigate(['/admin']);
        }
      },
      err => console.log(err)
    );
  }

  fetchCategories() {
    this._productService.getProductCategories()
    .subscribe(
      res => this.categories = res,
      err => console.log(err)
    );
  }

  fetchAllProducts() {
    this._productService.getProducts()
    .subscribe(
      res => this.products = res,
      err => console.log(err)
    );
  }

  onNewProductSubmit(form) {
    this._productService.postProduct(form.value)
    .subscribe(
      res => {
        console.log(res);
        this.fetchAllProducts();
      },
      err => console.log(err)
    );
  }

  newCategoryModal(template: TemplateRef<any>) {
    this.modalRef = this.modal.show(template, this.config);
  }

  onNewCategory(form) {
    this._productService.postCategory(form.value)
    .subscribe(
      res => {
        this.modalRef.hide();
        console.log(res);
      },
      err => console.log(err)
    );
  }

  productByIdData(data) {
    this._productService.getProductById(data)
    .subscribe(
      res => {
        this.updateInProgress = true;
        this.productById = res;
      },
      err => console.log(err)
    );
  }

  onProductUpdate(form) {
    this._productService.updateProductById(form.value._id, form.value)
    .subscribe(
      res => {
        this.updateInProgress = false;
        this.fetchAllProducts();
      },
      err => console.log(err)
    );
  }

  onNewProductLink() {
    this.updateInProgress = false;
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

  canDeactivate() {
    if (this._userService.logout()) {
      this._router.navigate(['/main']);
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    console.log('Route Destroyed');
  }

  ngOnChanges() {
   console.log('Change occured');
  }
}
