const qrcode = require("qrcode-terminal")
const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// client.on('message', async message => {
    

//     // const mentions = await msg.getMentions();
    
//     // for(let contact of mentions) {
//     //     console.log(`${contact.pushname} was mentioned`);
//     // }

//     if (message.body === "beruti3865") {
//         message.reply('a');
//         message.reply('<img src="https://images3.memedroid.com/images/UPLOADED449/5e96d8a351cd9.jpeg" alt="alt loco">');
//         message.reply('b');
//         // client.sendMessage(message.from, `<img src="https://images3.memedroid.com/images/UPLOADED449/5e96d8a351cd9.jpeg" alt="alt loco">`)
//     }

//     if (message.body.includes("Configure your WhatsApp Sandbox's Inbound URL to change this message.")) {
//         console.log("AAAAAAAAAAAAAAAAA")
//         message.reply('a');
//         message.reply('<img src="https://images3.memedroid.com/images/UPLOADED449/5e96d8a351cd9.jpeg" alt="alt loco">');
//         message.reply('b');
//     }



// });

const gruposPermitidos = [
    {
        remote: "120363025871479533@g.us",
        name: "DevAnts"
    },
    {
        remote: "120363047689913335@g.us",
        name: "Pruebas BOT"
    }
]

const accesoPermitido = (groupRemote) => gruposPermitidos.some(g => g.remote === groupRemote)

client.on('message_create', async (msg) => {
    console.log("\n-----")
    if (Math.random()*100 > 500) return console.log("Terminado");
    console.log(msg)
    // Fired on all message creations, including your own

    let chat = await msg.getChat();

    console.log("Mensaje de otro:\n", msg.body)

    if (chat.isGroup) {
        if (accesoPermitido(msg._data.id.remote)) {
            if (msg.body.startsWith('!name')) {
                let newSubject = msg.body.slice("!name ".length);
                chat.setSubject(newSubject);
            }

            if (msg.body.startsWith("!desc")) {
                let newDescription = msg.body.slice("!desc ".length);
                chat.setDescription(newDescription);
            }

            if (msg.body.startsWith("!info")) {
                msg.reply(`BOT: 
                *Detalles del grupo*
                Nombre: ${chat.name}
                Descripción: ${chat.description}
                Creado el ${chat.createdAt.toString()}
                Creado por ${chat.owner.user}
                Cantidad de participantes: ${chat.participants.length}
                `);
            }

            if (msg.body.startsWith("!help")) {
                msg.reply('BOT: Comandos disponibles: !info, !name y !desc');
            }

            if (msg._data.id.remote === "120363025871479533@g.us") {
                // msg.reply('Bot: Este mensaje sólo se ve en el grupo DevAnts cuando Jimmy o yo hablamos');
                console.log("HOLE")

            } else if (msg._data.id.remote === "120363049409077335@g.us") {
                console.log("HOLA")
                // msg.reply('Bot: Este mensaje sólo se ve en este grupo');
            }
            // msg.reply('a');
        }

    } else {
        // msg.reply(`Bot: ${msg._data.notifyName} trola`);

        if (msg.body === '!description') {
            // Send a new message as a reply to the current one
            // msg.reply('pong');

            if (chat.isGroup) {
                
            }
        }
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log("Mensaje borrado:\N", after); // message after it was deleted.
    if (before) {
        console.log("Mensaje borrado (después):\N", before); // message before it was deleted.
    }


});

client.initialize();
