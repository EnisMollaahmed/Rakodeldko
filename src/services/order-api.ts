export class Order{
    id:string;
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
        this.id = id;
    }
}

export class OrderDto{
    static async readAll():Promise<Order[]>{
        const data:Response = await fetch('/orders/all');
        if(!data.ok){
            throw Error ('error while reading data in readAll method from class OrderDto');
        }
        const orders:Order[] = await data.json();
        return orders;
    }
    static async readSpecificOrder(id:string):Promise<Order>{
        const data:Response = await fetch(`/orders/${id}`);
        if(!data.ok){
            throw Error('error while reading data in readSpecificOrder from class OrderDto');
        }
        const order:Order = await data.json();
        return order
    }
    static async readFilteredOrders(property:string, value:string|number):Promise<Order[]>{
        const data:Response = await fetch(`/orders/${property}-${value}`);
        if(!data.ok){
            throw Error('error while reading data in readFilteredOrders from class OrderDto');
        }
        const orders:Order[] = await data.json();
        return orders;
    }
    static async createOrder(order:Order):Promise<Response>{
        const data = await fetch('/orders/add', {
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
        const data = await fetch(`/orders/${order.id}`,{
            method:"PUT",
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
        const data = await fetch(`/orders/delete/${id}`,{
            method:"DELETE"
        });
        if(!data.ok){
            throw Error('Error while deleting data in deleteOrder methdod');
        }
        return await data.json();
    }
}