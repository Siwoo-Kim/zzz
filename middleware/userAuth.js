const hasAccess = (req,res,next)=>
{
    if(!req.session.userInfo)
    {
        res.redirect("/Login");
    }
    else
    {
        next();
    }
}

module.exports=hasAccess;