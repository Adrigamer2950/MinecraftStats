//ESTE CODIGO NO AFECTARA SU BOT, SCRIPT DE ARRANQUE

const http = require('http');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); 
}, 100000);


//DESDE AQUI EMPIEZA A ESCRIBIR EL CODIGO PARA SU BOT

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const request = require('request');


var prefix = config.prefix;

function presence(){
 var status = ["mc!help", "MinecraftStats", "Creado por Adrigamer2950"];
 var randomStatus = Math.floor(Math.random()*(status.length));
 client.user.setPresence({
    status: "online", 
    activity: {
      name: status[randomStatus],
      type: "WATCHING"
    }
  });
}

client.on('ready', () => {
  console.log(`Soy ${client.user.tag}!`);
  presence();
  setInterval(presence, 10000)
})

client.on('message', async (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  
  
  let text = args.join(' ');
  
  if(command === 'server'){
    if(!text) return message.channel.send('Envie una ip correcta!');
    let pingURL = `https://api.minetools.eu/ping/${text}`;
    let icon = `https://api.minetools.eu/favicon/${text}`;
    request(pingURL, function(err, resp, body){
      if(err) return console.log(err.message);
      body = JSON.parse(body);
      if(body.error) return message.channel.send('El servidor '+ text + ' no ha sido encontrado o esta offline!');
      let descReplace = /§\w/g;
      
      const embed = new Discord.MessageEmbed()
        .setTitle('Información del servidor ' + text)
        .setColor('RANDOM')
        .addField('Descripcion:', body.description.replace(descReplace, ""))
        .addField('Ping:', body.latency+'ms', true)
        .addField('Jugadores:', body.players.online+'/'+body.players.max, true)
        .addField('Verisones compatibles: ', body.version.name +' (Protocolo: '+ body.version.protocol+ ')');
      
        if(body.favicon) embed.setThumbnail(icon);
      message.channel.send(embed);
    })
  } 
  
  var mcIP = '84.127.137.252';
  var mcPort = 25565;
    
    if (command == 'servertest') {
        var url = 'https://api.minetools.eu/ping/' + mcIP + '/' + mcPort;
        let icon = 'https://api.minetools.eu/favicon/' + mcIP + '/' + mcPort;
        request(url, function(err, response, body) {
            if(err) {
                console.log(err);
                return message.reply('Error obteniendo las estadisticas de ZydoxCraft');
            }
            body = JSON.parse(body);
            let descReplace = /§\w/g;
            
            const embed = new Discord.MessageEmbed()
            .setTitle('Información del servidor ' + text)
            .setColor('RANDOM')
            .addField('Descripcion:', body.description.replace(descReplace, ""))
            .addField('Ping:', body.latency, true)
            .addField('Jugadores:', body.players.online+'/'+body.players.max, true)
            
            if(body.favicon){
              embed.setFooter('Datos obtenidos de la API de MineTools', icon)
            }else{
              embed.setFooter('Datos obtenidos de la API de MineTools')
            }
            message.channel.send(embed);
        });
    }
  
  if(command === "reiniciar") {
  if(message.author.id == "353104236491309056"){
    const embed = new Discord.MessageEmbed()
      .setTitle(":arrows_counterclockwise: `Reiniciando..`")
      .setDescription(`Espera 5 segundos`)
      .setColor("RANDOM");

    message.channel.send(embed)
    client.destroy()
    process.exit();
  }else{
    return message.channel.send("No puedes usar este comando.")
  }
  }
  
  if(command === 'help') {
    const embed = new Discord.MessageEmbed()
    .setTitle('Comandos de MinecraftStats')
    .setDescription('Todos y cada uno de los comandos del bot MinecraftStats')
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setColor('RANDOM')
    .setThumbnail(message.author.displayAvatarURL)
    .addField('`help`', "**Muestra esta ayuda**")
    .addField('`server <la ip>`', "**Muestra las stats del servidor que tu quieras de Minecraft**")
    
    message.channel.send(embed)

}
} )

client.login(config.token);