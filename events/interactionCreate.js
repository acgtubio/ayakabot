var serverQueue = {};
const { getVoiceConnection, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, joinVoiceChannel, createAudioResource, StreamType, NoSubscriberBehavior } = require('@discordjs/voice');
const getUrl = require("../commands/Music/MusicUtils/getSong.js");
const sessions = require('../commands/Music/MusicUtils/MusicSessions.js')

const musicSessions = new sessions()

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

                // if(!serverQueue[gId]) {
                //     serverQueue[gId] = {
                //         queue: [],
                //         status: 'idle',
                //         player: null,
                //         conn: null
                //     }
                // } 

                if(!musicSessions.exists(gId)) {
                    let { type, message } = await musicSessions.addSession( { guildID: gId, channel: channelID } )
                    if (type == 2) {
                        interaction.reply('I do not enough permissions to join the channel.')
                    }
                }
                else if(musicSessions.musicSessions[gId].session.channel != channelID){
                    interaction.reply('Already in a voice channel.')
                }
                
                await musicSessions.musicSessions[gId].queueMusic(interaction.options.getString('song'))
                // console.log(musicSessions.musicSessions[gId].session.queue)
                // console.log(musicSessions.musicSessions[gId].session)
                await interaction.client.commands.get(interaction.commandName).execute(
                    musicSessions.musicSessions[gId].session, 
                    interaction
                )

                // if(!serverQueue[gId].conn || serverQueue[gId].conn.state.status == 'destroyed'){
                //     serverQueue[gId].conn = joinVoiceChannel({
                //         channelId: channelID.id,
                //         guildId: gId,
                //         selfDeaf: true,
                //         adapterCreator: channelID.guild.voiceAdapterCreator
                //     });        
                // }

                // if(serverQueue[gId].conn.state.status == 'playing' || serverQueue[gId].status == 'playing'){
                //     return;
                // }

                // const command = interaction.client.commands.get(interaction.commandName);
                // var keyword = interaction.options.getString('song');
                
                
                // getUrl(interaction.options.getString('song')).then(async (url) => {
                //     console.log(url)
                //     url = "https://www.youtube.com/watch?v=" + url.split('"')[2];
                //     serverQueue[gId].queue.push(url);
                //     await command.execute(serverQueue, interaction);
                // });
                

                // serverQueue[gId].conn.once(VoiceConnectionStatus.Disconnected, () => {
                //     console.log('dc');
                //     serverQueue[gId].conn.destroy();
                //     serverQueue[gId].player.stop();
                //     return;
                // });
                
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