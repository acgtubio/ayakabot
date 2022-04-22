var serverQueue = {};
const { getVoiceConnection, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, joinVoiceChannel, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');
const getUrl = require("../utils/getUrl.js");

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        if (!interaction.client.commands.has(interaction.commandName)) return;

        try {
            if (interaction.commandName == 'play'){
                const channelID = interaction.member.voice.channel;
                const gId = interaction.guildId;

                if(!channelID) {
                    interaction.reply("You are not connected to a voice channel.");
                    return 0;
                }

                if(!serverQueue[gId]) {
                    serverQueue[gId] = {
                        queue: [],
                        status: 'idle',
                        player: null,
                        conn: null
                    }
                }

                if(!serverQueue[gId].conn || serverQueue[gId].conn.state.status == 'destroyed'){
                    serverQueue[gId].conn = joinVoiceChannel({
                        channelId: channelID.id,
                        guildId: gId,
                        selfDeaf: true,
                        adapterCreator: channelID.guild.voiceAdapterCreator
                    });        
                }

                if(serverQueue[gId].conn.state.status == 'playing' || serverQueue[gId].status == 'playing'){
                    return;
                }

                const command = interaction.client.commands.get(interaction.commandName);
                var keyword = interaction.options.getString('song');
                if (keyword.startsWith('https:')){
                    serverQueue[gId].queue.push(interaction.options.getString('song'));
                    await command.execute(serverQueue, interaction);
                }
                else{
                    getUrl(interaction.options.getString('song')).then(async (url) => {
                        url = "https://www.youtube.com/watch?v=" + url.split('"')[2];
                        serverQueue[gId].queue.push(url);
                        await command.execute(serverQueue, interaction);
                    });
                }

                serverQueue[gId].conn.once(VoiceConnectionStatus.Disconnected, () => {
                    console.log('dc');
                    serverQueue[gId].conn.destroy();
                    serverQueue[gId].player.stop();
                    return;
                });
                
            }
            else {
                await interaction.client.commands.get(interaction.commandName).execute(interaction);
            }
            
        }
        catch (error) {
            console.log(error);
        }
    },
}