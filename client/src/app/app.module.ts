import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgHighlightModule } from 'ngx-text-highlight';
import { CookieService } from 'ngx-cookie-service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModule } from 'ngx-bootstrap/alert';


import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { LocationService } from './services/location.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';

import { ShoppingComponent } from './components/shopping/shopping.component';
import { AdminComponent } from './components/admin/admin.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { StreetSearchPipe } from './pipes/street-search.pipe';
import { OrderGuard } from './guards/order.guard';
import { RoleGuard } from './guards/role.guard';

const appRoutes: Routes = [
  { path: 'main', component: MainComponent},
  { path: 'signup', component: SignUpComponent },
  { path: 'shopping', component: ShoppingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'receipt', component: ReceiptComponent, canDeactivate: [CanDeactivateGuard]},
  { path: '', redirectTo: '/main', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SignUpComponent,
    ShoppingComponent,
    AdminComponent,
    ReceiptComponent,
    StreetSearchPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgHighlightModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UserService, ProductService, CartService, OrderService, LocationService, CookieService, CanDeactivateGuard, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
