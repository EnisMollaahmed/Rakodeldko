const ordersEndpoint = 'http://localhost:8000/orders';


export class Order{
    id?:string;
    clientId:string;
    craftsmanId:string;
    productName:string;
    quantity:number;
    totalPrice:number;
    paymentMethod: "cash" | "card";
    status: 'pending'|'finished';
    address:string;
    constructor(clientId:string, craftsmanId:string, productName:string,quantity:number, price:number, address:string, paymentMethod: 'cash' | 'card'){
        this.clientId = clientId;
        this.craftsmanId = craftsmanId;
        this.productName = productName;
        this.quantity = quantity;
        this.totalPrice = quantity * price;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.status = 'pending';
    }
}

export class OrderDto{
    static async readAll():Promise<Order[]>{
        const data:Response = await fetch(ordersEndpoint);
        if(!data.ok){
            throw Error ('error while reading data in readAll method from class OrderDto');
        }
        const orders:Order[] = await data.json();
        return orders;
    }
    static async readSpecificOrder(id:string):Promise<Order>{
        const data:Response = await fetch(`${ordersEndpoint}/${id}`);
        if(!data.ok){
            throw Error('error while reading data in readSpecificOrder from class OrderDto');
        }
        const order:Order = await data.json();
        return order
    }
    static async readFilteredOrders(property:string, value:string|number):Promise<Order[]>{
        const data:Response = await fetch(`${ordersEndpoint}?${property}=${value}`);
        if(!data.ok){
            throw Error('error while reading data in readFilteredOrders from class OrderDto');
        }
        const orders:Order[] = await data.json();
        return orders;
    }
    static async createOrder(order:Order):Promise<Response>{
        const data = await fetch(ordersEndpoint, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(order),
        });
        if(!data.ok){
            throw Error('Error while writing data in createOrder methdod');
        }
        return await data.json();
    }
    static async updateOrder(order:Order):Promise<Response>{
        const data = await fetch(`${ordersEndpoint}/${order.id}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(order)
        });
        if(!data.ok){
            throw Error('Error while updating data in updateOrder methdod');
        }
        return await data.json();
    }
    static async deleteOrder(id:string):Promise<Response>{
        const data = await fetch(`${ordersEndpoint}/${id}`,{
            method:"POST"
        });
        if(!data.ok){
            throw Error('Error while deleting data in deleteOrder methdod');
        }
        return await data.json();
    }
}