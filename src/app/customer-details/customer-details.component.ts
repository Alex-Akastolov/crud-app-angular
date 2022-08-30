import {Component, OnInit} from '@angular/core';
import {HttpService} from "../shared/services/http.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerInterface} from "../shared/types/customer.interface";
import {DEFAULT_CUSTOMER} from "../shared/data/mock.data";

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  form!: FormGroup
  controls!: { [key: string]: AbstractControl }

  constructor(private httpService: HttpService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initializeForm()

    // this.httpService.createData()
  }

  onSubmit(): void {
    this.httpService.createData(this.form.value)
    this.clearForm()
  }

  private setControlValue(customer: CustomerInterface | null) {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].setValue(customer?.[key as keyof CustomerInterface] || null)

    })
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.minLength(8)]],
      location: ['', [Validators.required]],
    })
    this.controls = this.form.controls
    this.setControlValue(DEFAULT_CUSTOMER)
  }

  private clearForm(): void {
    this.setControlValue(null)
  }


}
