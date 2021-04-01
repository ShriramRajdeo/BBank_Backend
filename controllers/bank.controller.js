function profile(req, res){
    res.send("In blood bank profile"); 
}


function dashboard(req, res){
    res.send("On blood bank dashbord"); 
}

module.exports = {
    profile: profile,
    dashboard: dashboard
} 