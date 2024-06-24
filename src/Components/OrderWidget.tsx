import React from "react";
import { Order } from "../services/order-api";

export default function OrderWidget({order}:{order:Order}){
    return (
        <section className='widgetName'>
            <p className="product-name">{order.productName}</p>
            <p className="quantity">{order.quantity}</p>
            <p className="total-price">{order.totalPrice}</p>
            <p className="addrss">{order.address}</p>
            <p className="payment-method">{order.paymentMethod}</p>
        </section>
    );
}