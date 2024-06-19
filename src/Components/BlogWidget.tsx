import React from 'react';
import {useNavigate} from 'react-router-dom';

export default function BlogWidget({id, image ,title, shortDescription, post}:{id:string, image:string, title:string, shortDescription:string, post:number}){
    const navigate = useNavigate();
    const date = new Date(post);
    return(
        <section className='blog-widget'>
            <img src={image} alt={shortDescription}/>
            <p className='title'>{title}</p>
            <p className='short-description'>{shortDescription}</p>
            <p className='post-date'>{date.toString()}</p>
            <button type='button' className='view-btn' onClick={()=>navigate(`/blog/${id}`)}>View</button>
        </section>
    );
}