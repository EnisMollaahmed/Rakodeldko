import React, {useState} from "react";
import { OrderDto, Order } from "../services/order-api";
import { User } from '../services/clients-api';
import { useLoaderData } from "react-router-dom";
import OrderWidget from "./OrderWidget";

export async function loader() : Promise<{orders:Order[]}>{
    const item:string = sessionStorage.getItem('act-user') as string;
    const user:User = JSON.parse(item);
    const orders:Order[] = await OrderDto.readFilteredOrders("craftsmanId", user.id as string);
    return {orders};
}

export default function IncomingOrder(){
    const {orders} = useLoaderData() as {orders:Order[]};
    const [visibleOrders, setVisibleOrders] = useState<Order[]>(orders.filter((order:Order)=>order.status==='pending'));
    const handleFinsish = async (id:string)=>{
        const targetIndex = orders.findIndex((order:Order)=>order.id === id);
        orders[targetIndex].status='finished';
        await OrderDto.updateOrder(orders[targetIndex]);
        const newFilteredElements = orders.filter((order:Order)=>order.status === 'pending');
        setVisibleOrders(newFilteredElements);
    }
    return (
        <section className="orders-container">
            {
                visibleOrders.map((order:Order)=>{return (<section className="widget-and-button"><OrderWidget order={order}/><button type='button' className='type-btn' onClick={()=>handleFinsish(order.id as string)}>Finished</button></section>);})
            }
        </section>
    )
}