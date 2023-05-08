export interface Group {
    id: number,
    name: string,
    table_name: string,
    users: Users
}

export interface Users {

    root_admin: string,
    admins?: string[],
    guests?: string[]

}