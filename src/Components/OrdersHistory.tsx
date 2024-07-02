import React from "react";
import { User } from '../services/clients-api';
import { Order, OrderDto } from "../services/order-api";
import { useLoaderData } from "react-router-dom";
import OrderWidget from "./OrderWidget";

export async function loader() : Promise<{orders:Order[]}>{
    const item:string = sessionStorage.getItem('act-user') as string;
    const user:User = JSON.parse(item);
    const data:Order[] = await OrderDto.readFilteredOrders('clientId', user.id as string);
    const orders = data.reverse();
    return {orders};
}

export default function OrderHistory(){
    const {orders} = useLoaderData() as {orders:Order[]};
    return (
        <section className='my-orders'>
            {
                orders.map((order:Order)=>{return <OrderWidget order={order}/>})
            }
        </section>
    );
}