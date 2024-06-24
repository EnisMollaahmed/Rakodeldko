import React from 'react';
import productApi, { Product } from '../services/products-api';
import { User } from '../services/clients-api';
import { useLoaderData, useNavigate } from 'react-router-dom';
import ProductWidget from './ProductWidget';

export async function loader({params}:any):Promise<{products:Product[]}>{
    const item = sessionStorage.getItem('act-user') as string;
    const user: User = JSON.parse(item);
    if (item && user.id){
        const products: Product[]= await productApi.readFilteredData(user.id);
        return {products}
    }
    else{
        const products:Product[] = [];
        return {products}
    }
}

export default function MyProducts(){
    const {products} = useLoaderData() as {products:Product[]};
    const navigate = useNavigate();
    return (
        <section className='products-container'>
            <button className='add-prod-btn' type='button' onClick={()=>navigate('/man-product/add/x')}>Add product</button>
            {
                products.length > 0 ? products.map((product:Product)=>{ return product.id && <ProductWidget name={product.name} image={product.image} id={product.id} isOwned={true}/>}) : <p>There is no any products</p>
            }
        </section>
    );
}