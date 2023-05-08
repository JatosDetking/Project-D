export interface Expense {
    "group_name":string,
    "group_id":number,
    "product_name": string,
    "place": string,
    "should_track": boolean,
    "tags": string[],
    "price": number,
    "date": number,
    "id"?:number
}

export interface ShortExp {
    "product_name": string,
    "place": string,
    "tags": string,
    "price": number,
    "date": number
}