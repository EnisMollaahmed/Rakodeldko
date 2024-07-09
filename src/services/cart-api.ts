import productApi from "./products-api";
import{ Product } from "./products-api";
import {Order} from './order-api';
import { OrderDto } from "./order-api";
import { generateHexId } from "./utility";

export type CartItem = {
    id:string,
    quantity:number
}


class Cart{
    orders:Order[];
    prods:Product[];
    constructor(){
        this.orders = [];
        this.prods = [];
    }
    addToCart({id, quantity}:{id:string, quantity:number}):void{
        localStorage.setItem(id, JSON.stringify(quantity));
    }
    removeFromCart(id:string):void{
        const filteredObjects:CartItem[] = [];
        Object.keys(localStorage).forEach(
            (key) => {
                if(key !== id){
                    filteredObjects.push({id:key, quantity:JSON.parse(localStorage.getItem(key) as string)});
                }
            }
        )
        localStorage.clear();
        filteredObjects.map(obj => this.addToCart(obj));
    }
    getElements():CartItem[]{
        const products:CartItem[] = [];
        Object.keys(localStorage).forEach((key) => {
            products.push({id:key, quantity:JSON.parse(localStorage.getItem(key) as string)});
        })
        return products;
    }

    async readProduct(pr:CartItem){
        
        let {product} = await productApi.readProduct(pr.id) as {product:Product};
        this.prods.push(product);
        
    }

    private async getProducts(){
        if(this.prods.length === 0 || this.prods.length !== localStorage.length){
            //products.forEach((pr:CartItem) => await this.readProduct(pr))   
            const products:CartItem[] = this.getElements();
            this.prods = [];
            for(let i:number = 0; i < products.length; i++){
                await this.readProduct(products[i]);
            }
        }
    }
    private prepareOrder(customerId:string, address:string, paymentMethod: 'cash' | 'card'):void{
        this.getProducts();
        const products:CartItem[] = this.getElements();
        this.prods.forEach((prod:Product)=>{
            this.orders.push(new Order(customerId, prod.userId, prod.name, products.find(product=>product.id === prod.id)?.quantity as number, prod.price, address, paymentMethod, generateHexId()));
        })
    }
    async makeOrder(customerId:string, address:string, paymentMethod:'card' | 'cash'){
        this.prepareOrder(customerId, address, paymentMethod);
        localStorage.clear();
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
        //products = products.filter((product:CartItem)=>items.find(item=> item.id === product.id) !== undefined);
        const keys:string[] = Object.keys(localStorage);
        keys.forEach((key) => {
            if(items.find(item => item.id === key) === undefined){
                localStorage.removeItem(key);
            }
        })
    }
}

const cartApi = new Cart();

export default cartApi;