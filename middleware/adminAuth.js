  
const hasAccessAd = (req,res)=>
{
    if(req.session.userInfo.role = "Admin")
    {
        res.redirect("/adminDashboard"); 
    }
    else
    {
        res.redirect("/userDashboard");
    }
}

module.exports=hasAccessAd;