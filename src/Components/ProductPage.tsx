import React from "react";
import productApi, { Product } from "../services/products-api";
import {useLoaderData} from 'react-router-dom';
import { User } from '../services/clients-api';
import cartApi from "../services/cart-api";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

export async function loader({params}:any):Promise<{product:Product, user:User|null}>{
    console.log(params.productId)
    const {product}:{product:Product} = await productApi.readProduct(params.productId);
    console.log(product)
    const item:string|null = sessionStorage.getItem('act-user');
    console.log(item)
    const user:User|null = item ? JSON.parse(item) : null;
    return {product, user}; 
}

type Quantity = {quantity:number};

export default function ProductPage(){
    const {product, user} = useLoaderData() as {product:Product, user:User|null};
    const navigate = useNavigate();
    const { register, formState, handleSubmit } = useForm<Quantity>({
        defaultValues:{quantity:1},
        mode:'onBlur'
    });
    const { errors } = formState;

    const handleAddToCart = ({quantity}:Quantity) => {
        if(user){
            const id:string = product.id as string;
            cartApi.addToCart({id, quantity});
            navigate(-1);
        }
        else{
            navigate('/log-in');
        }
    }

    return (
        <section className='product-page'>
            <img src={product.image} alt={product.name}/>
            <p className="prod-name">{product.name}</p>
            <p className='prod-price'>{product.price}</p>
            {(product.userId !== user?.id) && 
            <form noValidate onSubmit={handleSubmit(handleAddToCart)}>
                <input type='number' {...register('quantity', {
                    required:'Quantity field is required',
                    min:{
                        value:1,
                        message:"Min quantity is 1"
                    },
                    max:{
                        value:20,
                        message:"Max quantity is 20"
                    }
                })} placeholder="Quantity"/>
                <p className="error">{errors.quantity?.message}</p>
                <button className="cart-btn" type='button'>Add to Cart</button>    
            </form>}
            <p className="prod-description">{product.description}</p>
            <section className="tags-container">
                {
                    product.tags.map(tag=><span key={tag} className="tag">{tag}</span>)
                }
            </section>
        </section>
    );
}
