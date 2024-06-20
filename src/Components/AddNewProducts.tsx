import React from "react";
import {useForm} from 'react-hook-form';
import productApi, { Product } from "../services/products-api";
import { useLoaderData } from "react-router-dom";
import { User } from '../services/clients-api'

type FieldValues = {
    name:string;
    image:string;
    description:string;
    tags:string;
    price:number;
}

export async function loader({params}:any):Promise<Product|undefined>{
    const type = params.type;
    if(type === 'edit'){
        const {product}:{product:Product} = await productApi.readProduct(params.id);
        return product;
    }
    else if(type === 'add'){
        return undefined;
    }
}

export default function AddNewProducts(){
    const product = useLoaderData() as Product|undefined;
    const {register, handleSubmit, formState} = useForm<FieldValues>({
        defaultValues:{
            name:product? product.name : "",
            image:product? product.image : "",
            description:product? product.description : "",
            tags: product ? product.tags.join(" ") : "",
            price: product ? product.price:0
        }
    });
    const { errors } = formState;

    const handleDataSubmission = async (data:FieldValues) => {
        if(product){
            product.name = data.name;
            product.image = data.image;
            product.description = data.description;
            product.tags = data.tags.split(' ');
            product.price = data.price;
            await productApi.updateProduct(product, product.id as string);
        }
        else{
            const item = sessionStorage.getItem('act-user') as string;
            const user:User = JSON.parse(item);
            const newProduct = new Product(data.name, data.image, data.description, data.tags.split(" "), data.price, user.id as string);
            await productApi.createProduct(newProduct);
        }
    }

    return (
        <form className='prods-form' noValidate onSubmit={handleSubmit(handleDataSubmission)}>
            <input className='inp' type='text' {...register("name", {
                required:"Product name is required",
                minLength:{
                    value:5,
                    message:'Product name must have at least 5 characters'
                },
                maxLength:{
                    value:30,
                    message:'Product name can have max 5 characters'
                }
            })} placeholder='Product name'/>
            <p className='error'>{errors.name?.message}</p>
            <input className='inp' type='text' {...register("image",{
                required:"Image is required"
            })} placeholder='Product image'/>
            <p className='error'>{errors.name?.message}</p>
            <textarea className='inp' {...register("description", {
                required:'Product description is required.',
                minLength:{
                    value:50,
                    message:'Description must contains at least 50 characters'
                },
                maxLength:{
                    value:500,
                    message:'Description can have maximum 500 characters'
                }
            })} placeholder="Product description.."/>
            <p className='error'>{errors.name?.message}</p>
            <input className='inp' type='text' {...register("tags", {
                required:'Tags are required'
            })} placeholder="Tags"/>
            <p className='error'>{errors.name?.message}</p>
            <input className='inp' type='number' {...register("price", {
                required:'The price is required',
                min:{
                    value:1,
                    message:'The price cannot be lower than 1'
                }
            })} placeholder="Product price.."/>
            <p className='error'>{errors.name?.message}</p>
            <button className='submit' type='submit'>Submit</button>
        </form>
    );
}