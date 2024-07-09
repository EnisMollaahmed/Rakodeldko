import express from 'express';
import Blog from '../models/Blog';

const router = express.Router();

const extractNeededObject = (blog:Blog) => {
    return {id: blog._id.toString(),title:blog.title, image:blog.image, shortDescription:blog.shortDescription, article:blog.article, tags:blog.tags, ownerId:blog.ownerId, post:blog.post};
}

router.get('/all', async (req, res) => {
    const blogs:Blog[] | null = await Blog.readAll();
    if(blogs){
        const toReturn = blogs.map((blog:Blog)=>extractNeededObject(blog));
        res.status(200).send(toReturn);
    }
    else{
        res.status(500).send([]);
    }
})

router.get('/page/:num', async (req, res) => {
    const page:number = Number(req.params.num);
    const {blogs, next}:{blogs:Blog[] | null, next: number | null} = await Blog.readSpecificPage(page);
    if(blogs){
        const toReturn = blogs.map((blog:Blog)=>extractNeededObject(blog));
        res.status(200).send({toReturn, next});
    }
    else{
        res.status(404).send({toReturn:[], next:null});
    }
});

router.get('/filter/:property-:value', async (req, res) => {
    const blogs:Blog[] | null = await Blog.readFilteredData(req.params.property, req.params.value);
    res.status(blogs? 200 : 404).send(blogs ? blogs.map((blog:Blog)=>extractNeededObject(blog)) : []);
});

router.get('/:id', async (req,res)=>{
    const id = req.params.id;
    console.log(id);
    const blog:Blog | null = await Blog.readOne(id);
    console.log(blog)
    if(blog){
        res.status(200).send(extractNeededObject(blog));
    }
    else{
        res.status(404).send(null);
    }
});

router.post('/add', async (req, res) => {
    const body = req.body;
    const blog:Blog = new Blog(body.title, body.image, body.shortDescription, body.article, body.tags, body.ownerId, body.post, body.id);
    const {message, code} = await blog.save();
    res.status(code).json({message:message});
});

router.put('/:id', async (req, res) => {
    const id:string = req.params.id;
    const body = req.body;
    const blog = new Blog(body.title, body.image, body.shortDescription, body.article, body.tags, body.ownerId, body.post, body.id);
    const {message, code} = await Blog.updateBlog(id, blog);
    res.status(code).json({message:message});
})

router.delete('/delete/:id', async(req, res) =>{
    const id:string = req.params.id;
    const {message, code} = await Blog.deleteBlog(id);
    res.status(code).json({message:message});
})

export {router as blogsRouter};