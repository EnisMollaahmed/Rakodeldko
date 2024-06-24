import React, { useState } from "react";
import cartApi, { CartItem } from "../services/cart-api";
import { Product } from "../services/products-api";
import { useLoaderData, useNavigate } from "react-router-dom";
import CartWidget from "./CartWidget";

export function loader() : {products:Product[], cartItems:CartItem[]}{
    const cartItems:CartItem[] = cartApi.getElements();
    const products:Product[] = cartApi.readProducts();
    return { products, cartItems };
}

export default function Cart(){
    const { products, cartItems } = useLoaderData() as {products:Product[], cartItems:CartItem[]};
    const [items, setItems] = useState<Product[]>(products);
    const navigate = useNavigate();
    
    const handleRemove = (id:string) =>{
        const filteredItems = items.filter((item:Product)=>item.id !== id);
        setItems(filteredItems);
    };
    return (
        <section className='cart-container'>
            <p className='cart-caption'>Cart Items</p>
            <section className='cart'>
                {
                    items.map((product:Product)=>{
                        const quantity = cartItems.find(cartItem => cartItem.id === product.id)?.quantity as number;
                        return (
                            <section className="prod-in-cart">
                                <CartWidget prodId={product.id as string} image={product.image} name={product.name} price={product.price * quantity} quontity={quantity}/>
                                <button className="view" type='button' onClick={()=>navigate(`/product/${product.id}`)}>View</button>
                                <button className="remove" type='button' onClick={()=>handleRemove(product.id as string)}>Remove</button>
                            </section>
                        );
                    })   
                }
            </section>
            <button type='button' className="to-checkout" onClick={()=>{
                cartApi.prods = items;
                cartApi.updateProducts(items);
                navigate('/checkout');
            }}>Proceed to Checkout</button>
        </section>
    );
}