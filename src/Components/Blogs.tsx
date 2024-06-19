import React, { useState } from "react";
import blogsApi, {Blog} from "../services/blogs-api";
import { useLoaderData } from "react-router-dom";
import BlogWidget from "./BlogWidget";

export async function loader():Promise<{blogs:Blog[], nextPage:number|null}>{
    const {blogs, nextPage}:{blogs:Blog[], nextPage:number|null} = await blogsApi.readSpecificCountBlogs(1);
    return {blogs, nextPage};
}

export default function Blogs(){
    const {blogs, nextPage} = useLoaderData() as {blogs:Blog[], nextPage:number|null};
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
                    return (item.id && item.post) && <BlogWidget key={item.id} id={item.id} image={item.image} title={item.title} shortDescription={item.shortDescription} post={item.post}/>;
                })
            }
            <button type='button' className='load-btn' hidden={pageNum === null} disabled={isLoading} onClick={handleLoadClick}>{isLoading ? 'Loading..':'Load More'}</button>
        </section>
    );
}