import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CustomerInterface} from "../types/customer.interface";
import {RequestCustomerInterface} from "../types/requestCustomer.interface";
import {ResponseCustomerInterface} from "../types/responseCustomer.interface";
import {catchError, Observable, of} from "rxjs";

const url = 'https://angular-server-work-default-rtdb.europe-west1.firebasedatabase.app/customers'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  customers: CustomerInterface[] = []

  constructor(private http: HttpClient) {
  }

  //Crud
  //Create => Post
  createData(customer: CustomerInterface): void {
    console.log(customer)
    this.http.post<RequestCustomerInterface>(`${url}.json`, customer, httpOptions).subscribe({
        next: (res: RequestCustomerInterface) => {
          this.customers.push({...{key: res.name}, ...customer})
        },
        error: (err) => catchError(this.errorHandler<RequestCustomerInterface>('Post'))
      }
    )
  }

  //Read => Get
  getData(): void {
    this.http.get<ResponseCustomerInterface>(`${url}.json`, httpOptions).subscribe({
      next: (res: ResponseCustomerInterface) => {
        Object.keys(res).forEach(key => {
          this.customers.push({key, ...res[key]})
        })
      },
      error: (err) => catchError(this.errorHandler<ResponseCustomerInterface>('get'))
    })
  }

  //Update => Put/ Patch
  updateData(customer: CustomerInterface, i: number): void {
    const {key, ...data} = customer
    this.http.put<CustomerInterface>(`${url}/${key}.json`, data, httpOptions).subscribe({
      next: (res) => this.customers[i] = customer,
      error: (err) => catchError(this.errorHandler<CustomerInterface>('Put'))
    })
  }

  //Delete => Delete
  deleteData(customer: CustomerInterface): void {
    this.http.delete(`${url}/${customer.key}.json`).subscribe({
      next: () => this.customers.splice(this.customers.indexOf(customer), 1),
      error: (err) => catchError(this.errorHandler('Delete'))
    })
  }

  private errorHandler<T>(operation: string, res?: T): any {
    return (err: any): Observable<T> => {
      console.error(`${operation} failed: ${err}`)
      return of(res as T)
    }
  }
}
