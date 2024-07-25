export interface Bonus {
    "day": number,
    "price": number
}

export interface DailyBonus {
    "current_day": number,
    "is_available": boolean,
    "bonuses": Bonus[]
}
