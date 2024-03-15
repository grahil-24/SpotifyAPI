const app = require('./app');

const port = 8888; 
app.listen(port, (err)=>{
    if(err){
        console.log(`Couldnt start server. Error: ${err}`);
    }else{
        console.log(`Server started on port ${port}`);
    }
})