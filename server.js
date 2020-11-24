const express = require("express");
const cors = require("cors");
const app = express();
const fs = require('fs');
const chats = require("./chats.json");
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

//const messages = [welcomeMessage];
const messages = chats; 

// Level-1 Challenge //;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});


//get all chat...........................................

app.get("/messages",function(request, response){
  console.log(messages);
  response.send(messages);
});

 //get chat by id........................................

app.get("/messages/:id",function(request, response){
  const id = request.params.id;
  console.log("show the id",id);
  const message = messages.find((element)=>{
    return element.id ==id;
  })
  console.log(message);
    response.json(message);
  });


// post new message.........................................

app.post("/messages", function(request,response){
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

app.delete("/messages/:id",function(request,response){
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
app.get("/chat/search",function (request, response) {
  let textForSearch = request.query.text;
  let searchMessaage = messages.filter((item) => {
    if (item.text.includes(textForSearch)) {
      return true;
    }
  });
  response.send(searchMessaage);
});

app.get('/chat/latest',function(request,response){
  //let test = messages;
  let latestMessage = messages[messages.length - 1];
  console.log("testing latest",messages.length);
  response.send(latestMessage)
});


// Aux function//
const saveMessage = messages => {
  let data = JSON.stringify(messages);
  fs.writeFileSync('chats.json', data);
};


app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

