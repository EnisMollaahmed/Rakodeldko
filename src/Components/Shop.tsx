import React, {useState} from 'react';
import { useLoaderData } from 'react-router-dom';
import productApi, { Product } from '../services/products-api';
import ProductWidget from './ProductWidget';

export async function loader():Promise<{products:Product[], nextPage:number|null}>{
    const {products, nextPage}:{products:Product[], nextPage:number|null} = await productApi.fetchSpecificAmount(1);
    console.log(products)
    return {products, nextPage}
}

export default function Shop(){
    const {products, nextPage} = useLoaderData() as {products:Product[], nextPage:number|null};
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
                    return (item.id && <ProductWidget key={index} name={item.name} image={item.image} id={item.id}/>);
                })
            }
            <button type='button' className='load-button' hidden={loadsCount === null} disabled={isLoading} onClick={handleLoad}>{isLoading ?  'Loading...' : 'Load more'}</button>
        </section>
    );
}