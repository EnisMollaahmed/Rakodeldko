import React, {useState} from "react";
import { OrderDto, Order } from "../services/order-api";
import { User } from '../services/clients-api';
import { useLoaderData, useNavigate } from "react-router-dom";
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleFinsish = async (id:string)=>{
        const targetIndex = orders.findIndex((order:Order)=>order.id === id);
        orders[targetIndex].status='finished';
        await OrderDto.updateOrder(orders[targetIndex]);
        navigate(0);
    }
    const handleShowAll = () => {
        setIsLoading(true);
        setVisibleOrders(orders);
        setIsLoading(false);
    }
    const handleShowFinished = () =>{
        setIsLoading(true);
        const toVisualize = orders.filter((order:Order)=>order.status === 'finished');
        setVisibleOrders(toVisualize);
        setIsLoading(false);
    }
    return (
        <section className="orders-container">
            <button className='show-all' hidden={isLoading} onClick={handleShowAll}>Sholl All</button>
            <button className='show-finished' hidden={isLoading} onClick={handleShowFinished}>Show Finished</button>
            {
                visibleOrders.map((order:Order)=>{return (<section className="widget-and-button"><OrderWidget order={order}/><button type='button' hidden={order.status === 'finished'} className='type-btn' onClick={()=>handleFinsish(order.id as string)}>Finished</button></section>);})
            }
        </section>
    )
}