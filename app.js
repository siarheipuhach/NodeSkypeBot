var restify  = require('restify');
var builder = require('botbuilder');
var fetch = require('node-fetch');
var urlEncodedBodyParser = require('restify/lib/plugins/index').urlEncodedBodyParser

// Setup  Restify Server
var server = restify.createServer();
var initial_message = '';

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: 'e818bb43-3c29-43b0-b4ab-c0b76a33b405',
    appPassword: '8st4Yd3bYDRJNknVc0LhMQn'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());
server.use(urlEncodedBodyParser());

function sendProactiveMessage(address) {
    var msg = new builder.Message().address(address);
    msg.text(message);
    msg.textLocale('en-US');
    bot.send(msg);
}

server.post('/api/receive/messages', function(req, res){
    json_req = JSON.parse(req.body);
    message = json_req.message;
    console.log(message);

    var my_addres = json_req.address

    
    sendProactiveMessage(my_addres)
    initial_message = message



    res.send('Done')
})

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    if (session.message.text.includes('Mine')){
        console.log(session.message.user.name + ' took the conversation')
        my_addres = session.message.address
        console.log('-------------------');
        console.log(my_addres)
        console.log('-------------------')
        delete my_addres.conversation
         bot.beginDialog(my_addres, 'survey', null, function (err) {
            if (err) {
                // error ocurred while starting new conversation. Channel not supported?
                bot.send(new builder.Message()
                    .text('This channel does not support this operation: ' + err.message)
                    .address(address));
            }
        });

         bot.dialog('survey', [
    function (session) {
        session.send(initial_message)
        fetch('http://localhost:3030/post/', { 
        method: 'POST',
        headers: {
                'Content-Type': 'application/json'
            },
         body: JSON.stringify({
    text: session.message.user.name + ': ' + session.message.text,
    address: session.message.address
  }) })
    },
]);

    }else{
        console.log(session.message)
    fetch('http://localhost:3030/post/', { 
        method: 'POST',
        headers: {
                'Content-Type': 'application/json'
            },
         body: JSON.stringify({
    text: session.message.user.name + ': ' + session.message.text,
    address: session.message.address
  }) })
    }
	
    
});

