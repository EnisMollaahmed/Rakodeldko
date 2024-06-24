import React from "react";
import productApi, { Product } from "../services/products-api";
import {useLoaderData} from 'react-router-dom';
import { User } from '../services/clients-api';

export async function loader({params}:any):Promise<{product:Product, user:User}>{
    const {product}:{product:Product} = await productApi.readProduct(params.productId);
    const item:string = sessionStorage.getItem('act-user') as string;
    const user:User = JSON.parse(item);
    return {product, user}; 
}

export default function ProductPage(){
    const {product, user} = useLoaderData() as {product:Product, user:User};

    return (
        <section className='product-page'>
            <img src={product.image} alt={product.name}/>
            <p className="prod-name">{product.name}</p>
            <p className='prod-price'>{product.price}</p>
            {product.userId !== user.id && <button className="cart-btn" type='button'>Add to Cart</button>}
            <p className="prod-description">{product.description}</p>
            <section className="tags-container">
                {
                    product.tags.map(tag=><span className="tag"><p className="tag-capt">{tag}</p></span>)
                }
            </section>
        </section>
    );
}
