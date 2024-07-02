import React from "react";
import blogsApi, { Blog } from "../services/blogs-api";
import { User } from '../services/clients-api';
import BlogWidget from "./BlogWidget";
import { useLoaderData, useNavigate } from "react-router-dom";


export async function loader():Promise<Blog[]>{
    const item = sessionStorage.getItem('act-user') as string;
    const user:User|undefined = JSON.parse(item);
    if(user && user.id){
        const blogs:Blog[] = await blogsApi.readFilteredBlogs(user.id);
        return blogs;
    }
    else{
        return [];
    }
}

export default function MyBlogs(){
    const blogs:Blog[] = useLoaderData() as Blog[];
    const navigate = useNavigate();
    return (
        <section className="my-blogs-container">
            <button className="add-blog-btn" type='button' onClick={()=>navigate('/man-blog/add/x')}>Add blog</button>
            {
                blogs.length > 0 ? blogs.map((blog:Blog)=>{return blog.id && <BlogWidget key={blog.id} id={blog.id} image={blog.image} title={blog.title} shortDescription={blog.shortDescription} post={blog.post}/>}) : <p>There are no any blogs posted yet</p>
            }
        </section>
    );
}