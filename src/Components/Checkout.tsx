import React from 'react';
import cartApi, { CartItem } from '../services/cart-api';
import { Product } from '../services/products-api';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User } from '../services/clients-api';

export function loader() : {products:Product[], cartItems:CartItem[], user:User}{
    const cartItems:CartItem[] = cartApi.getElements();
    const products:Product[] = cartApi.readProducts();
    const item:string = sessionStorage.getItem('act-user') as string;
    const user:User = JSON.parse(item);
    return {products, cartItems, user};
}

type CheckoutData = {
    address:string;
    paymentMethod:"card"|"cash";
};

export default function Checkout(){
    const {products, cartItems, user} = useLoaderData() as {products:Product[], cartItems:CartItem[], user:User};
    const { register, handleSubmit } = useForm<CheckoutData>({
        defaultValues:{
            address:"",
            paymentMethod:"card"
        },
        mode:"onBlur"
    });
    const navigate = useNavigate();

    const calculateTotalPrice = ():number => {
        let totalPrice:number = 0;
        cartItems.forEach((cartItem:CartItem)=>{
            const targetProduct = products.find((product:Product)=>product.id === cartItem.id) as Product;
            totalPrice += targetProduct.price * cartItem.quantity;
        });
        return totalPrice;
    }

    const handleDataSubmission = (data:CheckoutData) => {
        cartApi.makeOrder(user.id as string, data.address, data.paymentMethod);
        navigate('/')
    }

    return (
        <section className='checkout-container'>
            <form className='checkout-data' noValidate onSubmit={handleSubmit(handleDataSubmission)}>
                <textarea className='address' {...register('address', {
                    required:'Address field is required',
                    minLength:{
                        value:10,
                        message:'Address must be at least 10 characters long'
                    },
                    maxLength:{
                        value:50,
                        message:'Address can be maximux 50 characters long', 
                    }
                })} placeholder='Address'></textarea>
                <input type="radio" id="card" {...register("paymentMethod")} value="card" checked/>
                <label htmlFor="card">card</label>
                <input type="radio" id="cash" {...register("paymentMethod")} value="cash"/>
                <label htmlFor="cash">cash</label>
                <button className='submit-btn' type='button'>Order</button>
            </form>
            <section className='cost-information'>
                <p className='cost-caption'>Total Cost</p>
                <p className='total-cost'>{calculateTotalPrice()}</p>
            </section>
        </section>
    );
}