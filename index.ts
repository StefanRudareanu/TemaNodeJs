const http=require('http');
const csv=require('csvtojson');
const fs=require('fs');
const https=require('https');
const customfetch=(url)=>{
    return new Promise(function(resolve,reject){https.get(url,(res)=>{
        res.on('data',(chunk)=>{
           resolve(chunk);
        })
    }).on("error",(err)=>{
        reject(err);
    })})
}
const readfile=new Promise(function(resolve,reject){fs.readFile('site.html','utf8',(err,data)=>{
    if(err){
       reject(err);
    }
    else{
        resolve(data);
    }

})});
const writefile=(data)=>{return new Promise(function(resolve,reject){
    fs.writeFile('response.txt',data,err=>{
        if(err){
            reject(err);
            throw err;
        }
        resolve('worked');
    })})
}
const server=async (req,res)=>{
    if(req.url=="/jsontocsv"){
        try {
            const result=await csv().fromFile('data.csv');
            res.writeHead(200);
            res.write(JSON.stringify(result));
           return  res.end();
        } catch (error) {
            res.writeHead(400);
            res.write("Something went wrong")
           return res.end();
            
        }
        
    }

    if(req.url=="/htmlresponse"){
        try {

            const result= await readfile;
            res.writeHead(200);
            res.write(result);
           return res.end();
            
            
        } catch (error) {
            res.writeHead(400);
            res.write(error);
           return res.end();
        }
    }

    if(req.url=="/getapi"){
        try {
           const result=await customfetch('https://jsonplaceholder.typicode.com/todos/1');
           writefile(result);
           res.writeHead(200);
           res.write(result);
           return res.end();
            
        } catch (error) {
            res.writeHead(400);
            console.log(error);
            res.write(error);
           return res.end();
        }
      
    }
    res.writeHead(404);
    res.write("Not found");
   return  res.end();

}

http.createServer(server).listen(5000);