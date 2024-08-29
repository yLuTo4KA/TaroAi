export interface Referral {
    _id: string,
    referral: {
        username: string,
        avatar: string | null,
    }
    bonus: number
}