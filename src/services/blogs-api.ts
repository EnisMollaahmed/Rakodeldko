export class Blog{
    id?:string
    title:string;
    image:string;
    shortDescription:string;
    article:string;
    post:number;
    tags:string[];
    ownerId:string;
    constructor(title:string, image:string, shortDescription:string, article:string, tags:string[], ownerId:string, post:number){
        this.title = title;
        this.image = image;
        this.shortDescription=shortDescription;
        this.article = article;
        this.tags = tags;
        this.ownerId = ownerId;
        this.post = post
    }
}

class BlogApi{
    async readAll() : Promise<Blog[]>{
        const data:Response = await fetch('/blogs/all');
        if(data.status !== 200){
            throw Error('Error while reading blogs in readAll method');
        }
        const blogs:Blog[] = await data.json();
        return blogs;
    }
    async readSpecificCountBlogs(page:number):Promise<{blogs:Blog[], nextPage:number|null}>{
        const data:Response = await fetch(`/blogs/page/${page}`);
        if(!data.ok){
            throw Error('Error while reading blogs in readSpecificCountBlogs method');
        }
        const pagesData= await data.json();
        const blogs:Blog[] = pagesData.toReturn;
        console.log(blogs)
        const nextPage : number | null = pagesData.next;
        console.log(nextPage)
        return {blogs, nextPage};
    }
    async readBlog(id:string):Promise<Blog>{
        const data:Response = await fetch(`/blogs/${id}`);
        console.log(data)
        if(!data.ok){
            throw Error('Error while reading blogs in readBlog method');
        }
        const blog:Blog = await data.json();
        console.log(blog)
        return blog;
    }

    async readFilteredBlogs(ownerId:string):Promise<Blog[]>{
        const data:Response = await fetch(`/blogs/filter/ownerId-${ownerId}`);
        if(!data.ok){
            throw Error('Error while reading blogs in readFilteredBlogs method');
        }
        const blogs:Blog[] = await data.json();
        return blogs;
    }

    async createBlog(blog:Blog):Promise<Response>{
        const data:Response = await fetch('/blogs/add', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(blog),
        })
        if(!data.ok){
            throw Error('Error while writing new blog in createBlog method');
        }
        return await data.json();
    }
    async updateBlog(id:string, blog:Blog):Promise<Blog>{
        const data:Response = await fetch(`/blogs/${id}`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(blog)
        })
        if(!data.ok){
            throw Error('Error while updating data in the updateBlog method');
        }
        return await data.json();
    }
    async deleteBlog(id:string):Promise<Response>{
        const data:Response = await fetch(`/blogs/delete/${id}`,{
            method:"DELETE"
        });
        if(!data.ok){
            throw Error('Error while deleting data in the deleteBlog method');
        }
        return await data.json();
    }
}

const blogsApi = new BlogApi();

export default blogsApi;