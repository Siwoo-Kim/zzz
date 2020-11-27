  
const hasAccessAd = (req,res)=>
{
    if(req.session.user.role = "Admin")
    {
        res.redirect("/adminDashboard"); 
    }
    else
    {
        res.redirect("/userDashboard");
    }
}

module.exports=hasAccessAd;