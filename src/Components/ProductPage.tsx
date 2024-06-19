import React from "react";
import productApi, { Product } from "../services/products-api";
import {useLoaderData} from 'react-router-dom';

export async function loader({params}:any):Promise<{product:Product}>{
    const {product}:{product:Product} = await productApi.readProduct(params.productId);
    return {product}; 
}

export default function ProductPage(){
    const {product} = useLoaderData() as {product:Product};
    return (
        <section className='product-page'>
            <img src={product.image} alt={product.name}/>
            <p className="prod-name">{product.name}</p>
            <p className='prod-price'>{product.price}</p>
            <button className="cart-btn" type='button'>Add to Cart</button>
            <p className="prod-description">{product.description}</p>
            <section className="tags-container">
                {
                    product.tags.map(tag=><span className="tag"><p className="tag-capt">{tag}</p></span>)
                }
            </section>
        </section>
    );
}
