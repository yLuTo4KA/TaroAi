import { UserModel } from "../../pages/ranking-page/ranking-page.component";

export class LeaderboardModel {
    constructor(public leaderbord: UserModel[], public rank: number) { }
}