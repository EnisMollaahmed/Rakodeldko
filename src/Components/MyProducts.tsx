import React from 'react';
import productApi, { Product } from '../services/products-api';
import { User } from '../services/clients-api';
import { useLoaderData, Form } from 'react-router-dom';
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
    return (
        <section className='products-container'>
            <Form className='add-prod'>
                <button className='add-prod-btn'>Add product</button>
            </Form>
            {
                products.length > 0 ? products.map((product:Product)=>{ return product.id && <ProductWidget name={product.name} image={product.image} id={product.id} isOwned={true}/>}) : <p>There is no any elements</p>
            }
        </section>
    );
}