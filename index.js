const { Client, Collection, Intents } = require('discord.js');
const { createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const dotenv = require('dotenv');
const fs = require('fs');

const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES
	],
	partials: [
		'MESSAGE',
		'CHANNEL',
		'GUILD_MEMBER',
		'USER'
	]
});

client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (file of commandFiles) {
        const cf = require(`./commands/${folder}/${file}`);

        client.commands.set(cf.name, cf);
    }
}

for (file of eventFiles){
    const ev = require(`./events/${file}`);

    if(ev.once) {
        client.once(ev.name, (...args) => {ev.execute(...args, client)});
    }
    else {
        client.on(ev.name, (...args) => {ev.execute(...args, client)});
    }
}

client.on('messageCreate', async message => {
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content.toLowerCase() === "!hackserver" && message.author.id === client.application?.owner.id) {
        message.reply("hacking server... im in... https://tenor.com/view/zach-mdx-mandala-exchange-gif-21603734");
        const data = client.commands.map(({ execute, ...data}) => data);
        const command = await client.guilds.cache.get(message.channel.guildId)?.commands.set(data);
    }
    if (message.content.toLowerCase() === '!unhackserver' && message.author.id === client.application?.owner.id) {
        message.reply('unhacking server');
		const command = await client.guilds.cache.get(message.channel.guildId)?.commands.set([]);
	}
});



client.once('ready', () => {
    console.log('ready poggeeeers');
    client.user.setActivity("HACKING AMONG AMONGG");
})

dotenv.config();
client.login(process.env.TOKEN);

