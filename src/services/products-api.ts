export class Product{
    id?:string;
    name:string;
    image:string;
    description:string;
    tags:string[];
    price:number;
    userId:string;
    post?:number;
    constructor(name:string, image:string, description:string, tags:string[], price:number, userId:string){
        this.name = name;
        this.image = image;
        this.description = description;
        this.tags = tags;
        this.price = price;
        this.userId = userId;
    }
}

class ProductDto{
    async fetchAll() : Promise<Product[]>{
        const data = await fetch('/products/all');
        if(!data.ok){
            throw Error('Error while feching data in ProductDto fetchAll method');
        }
        const products:Product[] = await data.json();
        return products;
    }

    async fetchSpecificAmount(page:number):Promise<{products:Product[], nextPage:number|null}>{
        const data = await fetch(`/products/page/${page}`);
        if(!data.ok){
            throw Error('Error while feching data in ProductDto fetchSpecificAmount method');
        }
        const neededData = await data.json();
        const products:Product[] = neededData.data;
        const nextPage:number|null = neededData.next;
        return {products, nextPage};
    }

    async readFilteredData(userId:string):Promise<Product[]>{
        const data = await fetch(`/products/userId-${userId}`);
        if(!data.ok){
            throw Error('Error while reading products in ProductDto readFilteredData method');
        }
        const products:Product[] = await data.json();
        return products;
    }

    async createProduct(product:Product){
        const data= await fetch('/products/add', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(product)
        });
        if(!data.ok){
            throw Error('Error while feching data in ProductDto createProduct method');
        }
        const products = await data.json();
        return products; 
    }
    async updateProduct(product:Product, id:string){
        const data = await fetch(`/products/${id}`, {
            method:'PUT',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(product)
        });
        if(!data.ok){
            throw Error('Error while feching data in ProductDto updateProduct method');
        }
        const products = await data.json();
        return products; 
    }
    async deleteProduct(id:string){
        const data = await fetch(`/products/delete/${id}`,{
            method:"DELETE"
        });
        if(!data.ok){
            throw Error('Error while feching data in ProductDto deleteProduct method');
        }
        const product = await data.json();
        return product;
    }
    async readProduct(id:string):Promise<{product:Product}>{
        const data = await fetch(`/products/${id}`);
        const product = await data.json();
        return {product};
    }
}

const productApi = new ProductDto();

export default productApi;