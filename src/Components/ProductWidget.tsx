import React from "react";
import {useNavigate} from 'react-router-dom';

export default function ProductWidget({name, image, id}:{name:string, image:string, id:string}){//TODO add to cart products
    const navigate = useNavigate();
    return (
        <section className='product-widget'>
            <img className='image' src={image} alt={`product:{name}`}/>
            <p className='prod-name'>{name}</p>
            <button type='button' onClick={()=>navigate(`/product/${id}`)}>View</button>
            <button className="cart-btn" type='button'>Add to Cart</button>
        </section>
    );
}