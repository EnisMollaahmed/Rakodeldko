const blogsEndpoint = 'http://localhost:8000/blogs';

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
        const data:Response = await fetch(blogsEndpoint);
        if(data.status !== 200){
            throw Error('Error while reading blogs in readAll method');
        }
        const blogs:Blog[] = await data.json();
        return blogs;
    }
    async readSpecificCountBlogs(page:number):Promise<{blogs:Blog[], nextPage:number|null}>{
        const data:Response = await fetch(`${blogsEndpoint}?_page=${page}`);
        if(!data.ok){
            throw Error('Error while reading blogs in readSpecificCountBlogs method');
        }
        const pagesData= await data.json();
        const blogs:Blog[] = pagesData.data;
        const nextPage : number | null = pagesData.next;
        return {blogs, nextPage};
    }
    async readBlog(id:string):Promise<Blog>{
        const data:Response = await fetch(`${blogsEndpoint}/${id}`);
        if(!data.ok){
            throw Error('Error while reading blogs in readBlog method');
        }
        const blog:Blog = await data.json();
        return blog;
    }
    async createBlog(blog:Blog):Promise<Response>{
        const data:Response = await fetch(blogsEndpoint, {
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
        const data:Response = await fetch(`${blogsEndpoint}/${id}`, {
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
        const data:Response = await fetch(`${blogsEndpoint}/${id}`,{
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