const Post = require('../models/post');
const User = require('../models/user');
const search = require('../models/search');
const { rawListeners } = require('npm');


module.exports.home = async function(req, res){
      
    try{
         // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        if(req.query.name){
            User.findOne({name:req.query.name},function(err, user){
                if(err){
                    throw err;
                }
                if(user){
                  search.name = user.name;
                  search.email = user.email;
                  search.number = user.number;
                }else{
                    search.name = "NA";
                    search.email = "NA";
                    search.number = "NA";
                }
            })
        }else{
            console.log("no");
        }
        
        if(req.query.email){
            let fl = 1;
            let allusers = await User.find({email:req.query.email});  
            console.log(allusers.length);
            for(let i = 0; i<allusers.length; i++){
                console.log("hi");
                for(let j = 0; j<req.user.contacts.length; j++){        
                   if(req.user.contacts[j].equals(allusers[i]._id)){
                        fl = 0;
                   }
                }
            }
            // lUser.find({email:req.query.email},function(err, data){
            //     for(let j = 0; j<req.user.contacts.length; j++){  
            //         if(data[0]._id.equals(req.user.contacts[j])){
            //             console.log("hi");
            //             fl = 0;
            //         }
            //      }
            // });
            if(fl == 1){
                console.log("why");
                
             User.findOne({email:req.query.email},function(err, contact){
                req.user.contacts.push(contact._id);
                req.user.save();
             })
            }
            search.name="";
            search.email="";
            search.number="";
           // console.log(req.query);
        }else{
            console.log("now");
        }
        //let users = await User.find({});  
        let users = [];
        if(req.user){
          let allusers = await User.find({});  
          
          for(let i = 0; i<allusers.length; i++){
            for(let j = 0; j<req.user.contacts.length; j++){        
               if(req.user.contacts[j].equals(allusers[i]._id)){
                    users.push(allusers[i]);
               }
            }
          }
         // console.log(users);
        }
        
        req.query = null;
        return res.render('home', {
            title: "InfoBook | Home",
            posts:  posts,
            all_users: users,
            searched:search
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
