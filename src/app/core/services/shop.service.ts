import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ShopItem } from "../models/shop-item.model";

interface ShopItemsRespone {
    shopItems: ShopItem[]
}

@Injectable({
    providedIn: "root"
})

export class ShopService extends ApiService {
    private urlPath = "shop" as const;
    private shopItemsSubject: BehaviorSubject<ShopItem[] | null> = new BehaviorSubject<ShopItem[] | null>(null);
    public shopItems$: Observable<ShopItem[] | null> = this.shopItemsSubject.asObservable(); 

    constructor(http: HttpClient) {
        super(http);
    }

    getItems(): Observable<ShopItem[] | null> {
        const url = `${this.urlPath}/getItems`;
        if(!this.shopItemsSubject.value) {
            this.get<ShopItemsRespone>(url).pipe(
                tap(response => {
                    this.shopItemsSubject.next(response.shopItems);
                }) 
            ).subscribe();
        }
        return this.shopItemsSubject.asObservable();
    }
}