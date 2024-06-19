import React from 'react';
import blogsApi, { Blog } from '../services/blogs-api';
import userDto, { User } from '../services/clients-api';
import { useLoaderData } from 'react-router-dom';

export async function loader({params}:any):Promise<{blog:Blog, authorNickname:string}>{
    const blogId = params.blogId
    const blog:Blog = await blogsApi.readBlog(blogId);
    const user:User = await userDto.fetchUser(blog.ownerId);
    const authorNickname:string = user.name;
    return {blog, authorNickname};
}

export default function BlogPage(){
    const {blog, authorNickname} = useLoaderData() as {blog:Blog, authorNickname:string};
    const date = new Date(blog.post);
    return (
        <section className='blog-page'>
            <img src={blog.image} alt={blog.article}/>
            <h2 className='blog-title'>{blog.title}</h2>
            <p className='short-description'>{blog.shortDescription}</p>
            <p className='artile'>{blog.article}</p>
            <section className='tag-container'>
                {
                    blog.tags.map((tag:string, index:number)=>{
                        return <span key={index} className='tag'>{tag}</span>;
                    })
                }
            </section>
            <p className='post-info'>{`Posted by ${authorNickname} on ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`}</p>
        </section>
    );
}