import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserData } from "../models/userData.model";

@Injectable({
    providedIn: 'root',
  })
  export class ProfileService extends ApiService{
    private urlPath = 'profiles' as const;

    constructor(http: HttpClient){
        super(http);
    }

    getProfile(): Observable<UserData> {
        const url = `${this.urlPath}/my_profile/`;
        return this.get<UserData>(url);
    }
  }