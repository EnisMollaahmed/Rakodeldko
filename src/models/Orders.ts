import { getDb } from "../database";
import { ObjectId } from "mongodb";

class Order{
    _id:ObjectId;
    clientId:string;
    craftsmanId:string;
    productName:string;
    quantity:number;
    totalPrice:number;
    paymentMethod: "cash" | "card";
    status: 'pending'|'finished';
    address:string;
    constructor(clientId:string, craftsmanId:string, productName:string,quantity:number, price:number, address:string, paymentMethod: 'cash' | 'card', id:string){
        this.clientId = clientId;
        this.craftsmanId = craftsmanId;
        this.productName = productName;
        this.quantity = quantity;
        this.totalPrice = quantity * price;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.status = 'pending';
        this._id = new ObjectId(id);
    }

    async save(){
        const db = getDb();
        const data = await db?.collection<Order>('orders').insertOne(this);
        if(data?.acknowledged){
            return {message:'Order was saved', code:200};
        }
        else{
            return {message:'Order was not saved', code:500};
        }
    }

    static async readAll(){
        const db = getDb();
        const orders:Order[] | null = await db?.collection<Order>('orders').find().toArray() ?? null;
        if(orders){
            return orders;
        }
        else{
            return null;
        }
    }

    static async readOne(id:string){
        const db = getDb();
        const order:Order | null = await db?.collection<Order>('orders').findOne({_id: new ObjectId(id)}) ?? null;
        if(order){
            return order;
        }
        else{
            return null;
        }
    }

    static async readSpecificPage(page:number){
        const db = getDb();
        const orders:Order[] | null = await db?.collection<Order>('orders').find().skip(page * 10).limit(10).toArray() ?? null;
        const count:number | null = await db?.collection<Order>('orders').countDocuments() ?? null;
        const next:number | null = count as number > (page*10) ? (page + 1) : null
        return {orders, next};
        
    }

    static async updateOrder(id:string, order:Order){
        const db = getDb();
        const data = await db?.collection<Order>('orders').updateOne({_id: new ObjectId(id)}, {$set: order});
        if(data?.acknowledged){
            return {message:'Order is updated', code:200};
        }
        else{
            return {message: 'Order is not updated', code:500};
        }
    }

    static async deletedOrder(id:string){
        const db = getDb();
        const data = await db?.collection<Order>('orders').deleteOne({_id:new ObjectId(id)});
        if(data?.acknowledged){
            return {message:'Order is deleted', code:200};
        }
        else{
            return {message: 'Order is not deleted', code:500};
        }
    }

    static async readFilteredData(property:string, value:string){
        const db = getDb();
        const query = {[property] : value};
        const data: Order[] | null = await db?.collection<Order>('orders').find(query).toArray() ?? null;
        if(data){
            return data;
        }
        else{
            return null;
        }
    }
}

export default Order;