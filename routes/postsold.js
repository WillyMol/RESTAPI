const express = require ('express');
const router = express.Router();
const Post = require('../models/Post');
const axios = require('axios').default;

//const arrUrl = ['http://192.168.1.32/Toggle',"http://otherdevice","http://otherdevice"];

//this is a call back function: send post request to a device (a Thing)
function postReqToDev(devIp,req_body,callback) { //IP address plus json request    
    axios.post(devIp,req_body)
    .then((dev_response) => {        
        //console.log(dev_response.data);
        callback (null, dev_response.data);
    })
    .catch((error) => {
        //console.log({"message":error.response.data});
        callback (null,{"message":error.response.data});             
    });       
};
 //******************************************** */
// 1) Getting all Things attributes from mongoDB
router.get('/', async (req,res) => {
    try {        
        const posts = await Post.find();        
        
        console.log(posts[0]._id); //this is how I get the _id              

        res.json(posts);
        
    } catch(err){
        res.json({message: err});
    }
});
// 2) Add a new Thing to mongoDB
router.post('/', async (req,res) => {    
    const post = new Post({
        Name: req.body.Name,
        Ip: req.body.Ip,
        Description: req.body.Description,
        State: req.body.State
    });
    try{
        const savedPost =  await post.save();
        res.json(savedPost);
        } catch(err){
            res.json({message:err});
        }
});
// 3) Find and show specific _id (a Thing) from mongoDB
/* router.get('/:postId', async (req,res) => {
    try{
        //console.log(req.params.postId);
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch(err){
        res.json({message: err});
    }    
});
*/
//3) Find and show specific _id (a Thing) from mongoDB
router.get('/:postId', getposts, async (req,res) =>{
    res.json(res.post);
});


// 4) Delete One specific _id from mongoDB
router.delete('/:postId', getposts, async (req,res) =>{
    try {
        await res.post.remove();
        res.json({message:'Deleted post'});
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }

});

/* router.delete('/:postId', async (req,res) => {
    try{
        const removedPost = await Post.deleteOne({_id:req.params.postId});
        res.json(removedPost);
    } catch(err){
        res.json({message: err});
    }    
}); */
 


// 5) Update a Thing State attribute in mongoDB
router.patch('/:postId', getposts, async (req,res) =>{
    if(req.body.Name != null){
        res.post.Name = req.body.Name;
    }
    if(req.body.Ip != null){
        res.post.Ip = req.body.Ip;
    }
    if(req.body.Description != null){
        res.post.Description = req.body.Description;
    }
    if(req.body.State != null){
        res.post.State = req.body.State;
    }
    try {
        const updatedpost = await res.post.save()
        res.json(updatedpost);
    } catch (error) {
        res.status(400).json({message:error.message});        
    }
});
/* router.patch('/:postId', async (req,res) => {
    try{
        const post = await Post.findById(req.params.postId); //get _id of device
        const devIp = post.Ip;  //get IP address of device
        //do a post request to device with request body {State:true}      
        //const device_response = usingItNow(myCallback, devIp, req.body); //this is a call back function
        postReqToDev(devIp, req.body, function (err, returnValue) {    
            console.log(returnValue);
        });
        const updatePost = await Post.updateOne(
            {_id:req.params.postId},
            {$set: {State: req.body.State}} //Update only the State attribute
        );
        //res.json(device_response);
        //console.log(device_response);
        res.json(updatePost);        
    } catch(err){
        res.json({message: err});
    }    
}); */
//this is a middleware 
async function getposts(req,res,next){
    let post;
    try {
        post = await Post.findById(req.params.postId);
        if (post == null){
            return res.status(400).json({message:'Cannot Find device'});
        }
        
    } catch (error) {
        return res.status(500).json({message:err.message});
    }
    res.post = post;
    next();
}

/* router.post('/', (req,res) => {
    //console.log(req.body);
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    post.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({message:err});
        });
}); */


/* router.get('/specific', (req,res) => {
    res.send('we are on specific post');
}); */

module.exports = router;
