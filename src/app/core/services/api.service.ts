import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParamsModel } from '../models/query-params-model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  get<R>(path: string): Observable<R> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${path}`;

    return this.http.get<R>(url, headers);
  }


  post<R, B>(path: string, body: B): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.post<R>(completeUrl, body, headers);
  }

  put<R, B>(path: string, body: B): Observable<R> {
    const headers = {}
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.put<R>(completeUrl, body, headers);
  }

  delete<R>(path: string): Observable<R> {
    const headers = this.getHeaders();
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.delete<R>(completeUrl, headers);
  }

  download(path: string): Observable<Blob> {
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.get(completeUrl, {
      responseType: 'blob'
    });
  }

  uploadDownload<B>(path: string, body: B): Observable<Blob> {
    const completeUrl = `${this.apiUrl}/${path}`;

    return this.http.post(completeUrl, body, {responseType: 'blob'});
  }

  generateQueryParams(paramsObj: QueryParamsModel): string {
    let params = new HttpParams();

    Object.entries(paramsObj)
      .filter(([_, value]) => typeof value !== 'undefined' && value !== null)
      .map(([key, value]) => (params = params.set(key, value!)));

    return params.toString();
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
       'Content-Type': 'application/json',
      })
    };
  }

}
