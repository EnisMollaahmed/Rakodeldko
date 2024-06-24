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
    private getProducts(){
        if(this.prods.length){
            products.forEach(async (pr:CartItem)=>{
                let {product} = await productApi.readProduct(pr.id) as {product:Product};
                this.prods.push(product);
            })   
        }
    }
    private prepareOrder(customerId:string, address:string, paymentMethod: 'cash' | 'card'):void{
        this.getProducts();
        this.prods.forEach((prod:Product)=>{
            this.orders.push(new Order(customerId, prod.userId, prod.name, products.find(product=>product.id === prod.id)?.quantity as number, prod.price, address, paymentMethod));
        })
    }
    makeOrder(customerId:string, address:string, paymentMethod:'card' | 'cash'){
        this.prepareOrder(customerId, address, paymentMethod);
        this.orders.forEach(async (order:Order)=>{
            OrderDto.createOrder(order);
        });
    }
    readProducts():Product[]{
        if(this.prods.length === 0){
            this.getProducts();
        }
        return this.prods;
    }
    updateProducts(items:Product[]){
        products = products.filter((product:CartItem)=>items.find(item=> item.id === product.id) !== undefined)
    }
}

const cartApi = new Cart();

export default cartApi;