export class Product {
    constructor(
        public name: String,
        public category_id: String,
        public price: Number,
        public image_url?: String
    ) {}
}
