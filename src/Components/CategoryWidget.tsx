import React from 'react';

export default function CategoryWidget({name, image} : {name:string, image:string}){
    return(
        <section className="widget">
            <img className="image" src={image} alt='gift image'/>
            <p className="capt">{name}</p>
        </section>
    );
}