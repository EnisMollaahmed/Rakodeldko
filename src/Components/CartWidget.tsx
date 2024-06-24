import React from 'react';

export default function CartWidget({prodId, image, name, price, quontity}:{prodId:string, image:string, name:string, price:number, quontity:number}){
    return (
        <section className='prod'>
            <img src={image} alt={name}/>
            <p className='prod-name'>{name}</p>
            <p className='prod-quontity'>{quontity}</p>
            <p className='prod-price'>{price}</p>
        </section>
    );
}