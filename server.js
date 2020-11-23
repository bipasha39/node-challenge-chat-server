const express = require("express");
const cors = require("cors");
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.

const messages = [welcomeMessage];

// Level-1 Challenge //;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});


//get all chat...........................................

app.get("/chat/allmessages",function(request, response){
  console.log(messages);
  response.send(messages);
});

 //get chat by id........................................

app.get("/chat/:id",function(request, response){
  const id = request.params.id;
  console.log(id);
  const message = messages.find((element)=>{
    return element.id ==id;
  })
  console.log(message);
    response.json(message);
  });


// post new message.........................................

app.post("/chat/newmessage", function(request,response){
  let newMessage = request.body; 
  console.log(newMessage);
  newMessage.id = messages.length

  // .............................Level 2................ //

  if (newMessage.from == "" ||newMessage.from == null){
    response.sendStatus(400);
    //response.status(400).send;
  }
  else if (newMessage.text == "" ||newMessage.text == null){
    response.sendStatus(400);
  }
  else{ 
    // add the new quote to the array 
    messages.push(newMessage);
    
    //level4// 
    newMessage.timeSent = new Date();
  }
   // save the whole array to the chats.json file 
  saveMessage(messages)
  response.json(messages);
});


//delete message............................................

app.delete("/chat/:id",function(request,response){
  const id = request.params.id;
  const deleteMessage = messages.filter((element) => {
    return element.id == id; 
  }); 
  //delete the quote from the array
 let index = messages.indexOf(deleteMessage);
 messages.splice(index, 1);
 // save the array back to the json file.
   saveMessage(messages)

response.send(deleteMessage)
});

//level 3.....................

app.get("/message/search",function (request, response) {
  let textForSearch = request.query.text;
  let searchMessaage = messages.filter((item) => {
    if (item.text.includes(textForSearch)) {
      return true;
    }
  });
  respond.send(searchMessaage);
});

app.get('/message/latest', function(respond,request){
  latestMessage = messages.slice(0, 10);
  respond.send(latestMessage)
});

const saveMessage = messages => {
  let data = JSON.stringify(messages);
  fs.writeFileSync('chats.json', data);
};


app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

