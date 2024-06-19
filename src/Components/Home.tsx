import React from "react";
import CategoryWidget from "./CategoryWidget";
import categories from "../categories-data";

type Category = {name:string, image:string};

export default function Home(){
    //const {categories}:any= useLoaderData();

    return (
        <section className='home-container'>
            <section className="pop-categories">
                <p className="shop-capt">Shop our popular categories</p>
                <section className="widget-container">
                    {
                        categories.map((category:Category, index:number)=>{
                            return <CategoryWidget name={category.name} image={category.image} key={index}/>
                        })
                    }
                </section>
                <section className="short-info">
                    <p>About us</p>
                    <p>Rakodelko is a Bulgarian e-commerce company that follows in the tradition of open craft fairs.
                    It gives sellers (craftsmen) an opportunity to have a personal storefront where they can list their goods.The focus is on handmade or vintage items and craft supplies. 
                    These items fall under a wide range of categories - jewelry, bags, clothing, home décor and furniture, 
                    toys, art, craft supplies and tools.
                    </p>
                </section>
            </section>
        </section>
    );
}