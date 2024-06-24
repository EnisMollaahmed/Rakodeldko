import React, {useState} from 'react';
import { useLoaderData } from 'react-router-dom';
import productApi, { Product } from '../services/products-api';
import ProductWidget from './ProductWidget';
import {User} from '../services/clients-api'

export async function loader():Promise<{products:Product[], nextPage:number|null, user: User | undefined}>{
    const {products, nextPage}:{products:Product[], nextPage:number|null} = await productApi.fetchSpecificAmount(1);
    console.log(products);
    const item = sessionStorage.getItem('act-user');
    const user:User|undefined = item ? JSON.parse(item) : undefined;
    return {products, nextPage, user}
}

export default function Shop(){
    const {products, nextPage, user} = useLoaderData() as {products:Product[], nextPage:number|null, user:User | undefined};
    const [items, setItems] = useState<Product[]>(products);
    const [loadsCount, setLoadsCount] = useState<number|null>(nextPage);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLoad = async ()=>{
        if(loadsCount !== null){
            console.log(loadsCount);
            setIsLoading(true);
            const {products, nextPage} = await productApi.fetchSpecificAmount(loadsCount);
            console.log(products, nextPage);
            const totalData = items.concat(products);
            console.log(totalData);
            setItems(totalData);
            setLoadsCount(nextPage);
            setIsLoading(false);
        }
    }

    return (
        <section className='market-container'>
            {
                items.map((item:Product, index:number)=>{
                    return (item.id && <ProductWidget key={index} name={item.name} image={item.image} id={item.id} isOwned={false} isAdmin={user?.role==='admin'}/>);
                })
            }
            <button type='button' className='load-button' hidden={loadsCount === null} disabled={isLoading} onClick={handleLoad}>{isLoading ?  'Loading...' : 'Load more'}</button>
        </section>
    );
}