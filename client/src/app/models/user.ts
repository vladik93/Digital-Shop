export class User {
    constructor(
        public _id: string,
        public name: string,
        public last_name: string,
        public email: string,
        public password: string,
        public password_confirm?: string,
        public admin?: boolean,
        public city?: string,
        public street?: string
    ) {}
}


