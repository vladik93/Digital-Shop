import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { LocationService } from '../../services/location.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  registerData: User = {
    admin: false,
    _id: '',
    email: '',
    password: '',
    password_confirm: '',
    city: '',
    street: '',
    name: '',
    last_name: ''
  };

  cities;
  streets;

  stageOneDone = false;
  formErrorsFound = false;
  serverErrors = {
    username: null,
    id: null,
    email: null
  };


  constructor(private _userService: UserService, private _locationService: LocationService, private _router: Router) { }

  ngOnInit() {
    this.fetchAllCities();
  }

  onFirstStageDone() {
    this.stageOneDone = true;
    document.getElementById('stage-1').style.display = 'none';
    document.getElementById('stage-2').style.display = 'block';
  }

  onRegister(data: NgForm) {
    this.serverErrors.email = null;
    this.serverErrors.id = null;
    this.serverErrors.username = null;

    this._userService.register(data.value)
    .subscribe(
      res => {
        this._router.navigateByUrl('/main');
        console.log(res);

      },
      err => {
        this.serverErrors.email = null;
        this.serverErrors.id = null;
        this.serverErrors.username = null;
        this.formErrorsFound = true;
        if ( (err.error.errors.last_name && err.error.errors.name) && err.error.errors.email && err.error.errors._id ) {
          this.serverErrors.email = 'Email aready taken';
          this.serverErrors.username = 'Name and Last Name already taken!';
          this.serverErrors.id = 'User ID already already exists!';
        } else if ((err.error.errors.last_name && err.error.errors.last_name) && err.error.errors._id) {
          this.serverErrors.id = 'User ID already already exists!';
          this.serverErrors.username = 'Name and Last Name already taken!';
          console.log(this.serverErrors);
        } else if ((err.error.errors.last_name && err.error.errors.last_name) && err.error.errors.email) {
          this.serverErrors.email = 'Email aready taken';
          this.serverErrors.username = 'Name and Last Name already taken!';
          console.log(this.serverErrors);
        } else if (err.error.errors.last_name && err.error.errors.name) {
          this.serverErrors.username = 'Name and Last Name already taken!';
          console.log(this.serverErrors);
        } else if (err.error.errors.email && err.error.errors._id) {
          this.serverErrors.email = 'Email aready taken';
          this.serverErrors.id = 'User ID already already exists!';
          console.log(this.serverErrors);
        } else if (err.error.errors._id) {
          this.serverErrors.id = 'User ID already already exists!';
          console.log(this.serverErrors);
        } else if (err.error.errors.email) {
          this.serverErrors.email = 'Email aready taken';
          console.log(this.serverErrors);
        }
      }
    );
  }

  fetchAllCities() {
    this._locationService.getCities()
    .subscribe(
      res => this.cities = res,
      err => console.log(err)
    );
  }

  onCitySelect(data) {
    this._locationService.getStreetsByCity(data)
    .subscribe(
      res => this.streets = res,
      err => console.log(err)
    );
  }

  onFormGoBack() {
    this.stageOneDone = false;
    document.getElementById('stage-1').style.display = 'block';
    document.getElementById('stage-2').style.display = 'none';
  }

  onTouchedField(data) {
     if (data === 'id') {
      this.serverErrors.id = null;
     } else if (data === 'email') {
       this.serverErrors.email = null;
     } else if (data === 'name' || data === 'lastName') {
       this.serverErrors.username = null;
     }
  }

}
