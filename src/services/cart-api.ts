import productApi from "./products-api";
import{ Product } from "./products-api";
import {Order} from './order-api';
import { OrderDto } from "./order-api";

export type CartItem = {
    id:string,
    quantity:number
}

let products:CartItem[] = [];

class Cart{
    orders:Order[];
    prods:Product[];
    constructor(){
        this.orders = [];
        this.prods = [];
    }
    addToCart({id, quantity}:{id:string, quantity:number}):void{
        products.push({id, quantity});
    }
    removeFromCart(id:string):void{
        products = products.filter((product:CartItem)=>product.id !== id);
    }
    getElements():CartItem[]{
        return [...products];
    }

    async readProduct(pr:CartItem){
        
        let {product} = await productApi.readProduct(pr.id) as {product:Product};
        this.prods.push(product);
        
    }

    private async getProducts(){
        if(this.prods.length === 0){
            //products.forEach((pr:CartItem) => await this.readProduct(pr))   
            for(let i:number = 0; i < products.length; i++){
                await this.readProduct(products[i]);
            }
        }
    }
    private prepareOrder(customerId:string, address:string, paymentMethod: 'cash' | 'card'):void{
        this.getProducts();
        this.prods.forEach((prod:Product)=>{
            this.orders.push(new Order(customerId, prod.userId, prod.name, products.find(product=>product.id === prod.id)?.quantity as number, prod.price, address, paymentMethod));
        })
    }
    async makeOrder(customerId:string, address:string, paymentMethod:'card' | 'cash'){
        this.prepareOrder(customerId, address, paymentMethod);
        for (let index = 0; index < this.orders.length; index++) {
            await OrderDto.createOrder(this.orders[index]);
        }
    }
    async readProducts():Promise<Product[]>{
        if(this.prods.length === 0){
            this.getProducts();
        }
        console.log(this.prods)
        return this.prods;
    }
    updateProducts(items:Product[]){
        products = products.filter((product:CartItem)=>items.find(item=> item.id === product.id) !== undefined)
    }
}

const cartApi = new Cart();

export default cartApi;