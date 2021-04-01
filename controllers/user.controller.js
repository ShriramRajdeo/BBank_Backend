function profile(req, res){
    res.send("In user profile"); 
}


function dashboard(req, res){
    res.send("On user dashboard"); 
}

module.exports = {
    profile: profile,
    dashboard: dashboard
} 