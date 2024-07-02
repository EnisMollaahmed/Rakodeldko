import React, {useState} from 'react';
import { useLoaderData } from 'react-router-dom';
import productApi, { Product } from '../services/products-api';
import ProductWidget from './ProductWidget';
import {User} from '../services/clients-api'
import { useForm } from 'react-hook-form';

export async function loader():Promise<{products:Product[], nextPage:number|null, user: User | undefined}>{
    const {products, nextPage}:{products:Product[], nextPage:number|null} = await productApi.fetchSpecificAmount(1);
    console.log(products);
    const item = sessionStorage.getItem('act-user');
    const user:User|undefined = item ? JSON.parse(item) : undefined;
    return {products, nextPage, user};
}

type FilterInfo = {
    filterInp:string;
}

export default function Shop(){
    const {products, nextPage, user} = useLoaderData() as {products:Product[], nextPage:number|null, user:User | undefined};
    const [items, setItems] = useState<Product[]>(products);
    const [loadsCount, setLoadsCount] = useState<number|null>(nextPage);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState } = useForm<FilterInfo>({
        defaultValues:{
            filterInp:""
        },
        mode:"onBlur"
    });
    const { errors } = formState;
    let filters:string|undefined = undefined;

    const handleLoad = async ()=>{
        if(loadsCount !== null && filters === undefined){
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
        else{
            const filterTags = filters?.split(" "); 
            setIsLoading(true);
            const products:Product[] = await productApi.fetchAll();
            const filteredItems = products.filter((item:Product)=>item.tags.find((tag:string)=>filterTags?.includes(tag)));
            setLoadsCount(null);
            setItems(filteredItems);
        }
    }

    const handleFilters = async (data:FilterInfo) =>{
        filters = data.filterInp;
        await handleLoad();
    }

    return (
        <section className='market-container'>
            <form noValidate onSubmit={handleSubmit(handleFilters)}>
                <label htmlFor='filt-inp'  className='label'>Enter the tags separated by spaces</label>
                <input id='filt-inp' type='text' className='filter-inp' {...register('filterInp', {
                    minLength:{
                        value:3,
                        message:'filter must be at least 3 characters',
                    },
                    maxLength:{
                        value:20,
                        message:'Filters can be maximum 20 characters long'
                    },
                })} placeholder='Tags'/>
                <p className='error'>{errors.filterInp?.message}</p>
                <button className='filter-btn' type='submit'>Search</button>
            </form>
            {
                items.map((item:Product, index:number)=>{
                    return (item.id && <ProductWidget isRegistered={user ? true : false} key={index} name={item.name} image={item.image} id={item.id} isOwned={user ? user.id === item.userId : false} isAdmin={user?.role==='admin'}/>);
                })
            }
            <button type='button' className='load-button' hidden={loadsCount === null} disabled={isLoading} onClick={handleLoad}>{isLoading ?  'Loading...' : 'Load more'}</button>
        </section>
    );
}