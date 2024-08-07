import React, { useState } from "react";
import blogsApi, {Blog} from "../services/blogs-api";
import { useLoaderData } from "react-router-dom";
import BlogWidget from "./BlogWidget";
import {User} from "../services/clients-api";

export async function loader():Promise<{blogs:Blog[], nextPage:number|null, user:User|undefined}>{
    const {blogs, nextPage}:{blogs:Blog[], nextPage:number|null} = await blogsApi.readSpecificCountBlogs(1);
    const item:string | null = sessionStorage.getItem('act-user');
    const user:User|undefined = item ? JSON.parse(item) : undefined;
    return {blogs, nextPage, user};
}

export default function Blogs(){
    const {blogs, nextPage, user} = useLoaderData() as {blogs:Blog[], nextPage:number|null, user: User | undefined};
    const [items, setItems] = useState<Blog[]>(blogs);
    const [pageNum, setPageNum] = useState<number|null>(nextPage);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLoadClick = async ()=>{
        if(pageNum !== null){
            setIsLoading(true);
            const {blogs, nextPage} = await blogsApi.readSpecificCountBlogs(pageNum);
            const totalData = items.concat(blogs);
            setItems(totalData);
            setPageNum(nextPage);
            setIsLoading(false);
        }
    }
    
    return (
        <section className='blogsContainer'>
            {
                items.map((item:Blog)=>{
                    return <BlogWidget key={item.id} id={item.id as string} image={item.image} title={item.title} shortDescription={item.shortDescription} post={item.post} isAdmin={user?.role === 'admin'}/>;
                })
            }
            <button type='button' className='load-btn' hidden={pageNum === null} disabled={isLoading} onClick={handleLoadClick}>{isLoading ? 'Loading..':'Load More'}</button>
        </section>
    );
}