import React from 'react';
import {useForm} from 'react-hook-form';
import blogsApi, { Blog } from '../services/blogs-api';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { User } from '../services/clients-api';
import { generateHexId } from '../services/utility';

type FormData = {
    title:string,
    shortDescription:string,
    article:string,
    tags:string,
    image:string
}

export async function loader({params}:any):Promise<Blog | null>{
    const type = params.type;
    console.log(type)
    if(type === 'edit'){
        const blog:Blog = await blogsApi.readBlog(params.blogId);
        return blog;
    }
    console.log('add is here')
    return null;
}

export default function AddNewBlog(){
    const navigate = useNavigate();
    const blog = useLoaderData() as Blog|null;
    const { register, handleSubmit, formState, reset } = useForm<FormData>({
        defaultValues:{
            title: blog ? blog.title : "",
            shortDescription:blog? blog.shortDescription : "",
            article:blog?blog.article:"",
            tags:blog ? blog.tags.join(" ") : ""
        },
        mode:'onBlur'
    });
    const { errors } = formState;

    const handleDataSubmission = async (data:FormData) =>{
        if(blog){
            blog.image = data.image;
            blog.title = data.title;
            blog.shortDescription = data.shortDescription;
            blog.article = data.article;
            blog.tags = data.tags.split(" ");
            await blogsApi.updateBlog(blog.id as string, blog);
            navigate(-1);
        }
        else{
            const item = sessionStorage.getItem('act-user') as string;
            const user : User = JSON.parse(item);
            const date = new Date();
            const newBlog = new Blog(data.title, data.image,data.shortDescription, data.article, data.tags.split(" "), user.id as string, date.getMilliseconds());
            newBlog.id = generateHexId();
            await blogsApi.createBlog(newBlog);
        }
        reset();
    }

    return (
        <form className='blog-manipulation' noValidate onSubmit={handleSubmit(handleDataSubmission)}>
            <input className='inp' type='text' {...register("image",{
                required:'Image is required'
            })} placeholder='Image url..'/>
            <p className='error'>{errors.image?.message}</p>
            <input className='inp' type='text' {...register("title",{
                required:"Title is required",
                minLength:{
                    value:5,
                    message: "Title must contains at least 5 characters"
                }
            })} placeholder='Title'/>
            <p className='error'>{errors.title?.message}</p>
            <input className='inp' type='text' {...register("shortDescription",{
                required:"The blog must contain short description",
                minLength:{
                    value:10,
                    message:"Short description must have at least 10 charachter"
                }
            })} placeholder='Short description...'/>
            <p className='error'>{errors.shortDescription?.message}</p>
            <textarea className='article-inp' {...register("article", {
                required:'You have to write article',
                minLength:{
                    value:1000,
                    message:"The article must contain 1000 characters at least"
                },
                maxLength:{
                    value:1500,
                    message:"The article can have max 1500 characters"
                }
            })} placeholder='Article...'/>
            <p className='error'>{errors.article?.message}</p>
            <input className='inp' type='text' {...register("tags",{
                required:"Tags are required"
            })} placeholder='Tags..'/>
            <p className='error'>{errors.tags?.message}</p>
            <button className='manipulate-btn' type='submit'>Submit</button>
        </form>
    );
}