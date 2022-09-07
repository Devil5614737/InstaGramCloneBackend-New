const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.get("/search", auth, async (req, res) => {
const {query}=req.body
  if (query) {
    const user = await User.find({
        fullname:{
            $eq: query,
        }
    });
    res.json(user);
  }
});

router.get('/all-users',auth,async(req,res)=>{
    const users=await User.find({
    _id:{
        $ne:req.user._id
    }
    })
    res.json(users)
});



router.put('/update',auth,async(req,res)=>{
  const {pic,fullname,username}=req.body;
  const updated=await User.findByIdAndUpdate(req.user._id,{
    $set:{
      pic,username,fullname
    }
  },{new:true})
  res.json(updated)
})


router.put('/follow',auth,(req,res)=>{
  User.findByIdAndUpdate(req.body.followId,{
      $push:{followers:req.user._id}
  },{
      new:true
  },(err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }
    User.findByIdAndUpdate(req.user._id,{
        $push:{following:req.body.followId}
        
    },{new:true}).select("-password").then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })

  }
  )
})
router.put('/unfollow',auth,(req,res)=>{
  User.findByIdAndUpdate(req.body.unfollowId,{
      $pull:{followers:req.user._id}
  },{
      new:true
  },(err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }
    User.findByIdAndUpdate(req.user._id,{
        $pull:{following:req.body.unfollowId}
        
    },{new:true}).select("-password").then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })

  }
  )
})

router.post('/user-profile',auth,async(req,res)=>{
  const user=await User.findById(req.body.userId)
  res.json(user)
})




module.exports = router;
