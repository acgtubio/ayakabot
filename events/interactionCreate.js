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
                    return;
                }
                if(!channelID.joinable){
                    interaction.reply("Not enough permissions to join the channel.")
                    return
                }
                if(!musicSessions.exists(gId)){
                    let { type, message } = musicSessions.addSession( { 
                        guildID: gId, 
                        channel: channelID, 
                        callChannel: interaction.channel,
                     } )
                }
                else if(musicSessions.musicSessions[gId].session.channel != channelID){
                    interaction.reply('Already in a voice channel.')
                    return
                }
                else if(musicSessions.exists(gId) && !musicSessions.musicSessions[gId].session.conn){
                    musicSessions.musicSessions[gId].connectToVoice()
                }
                // console.log(musicSessions.musicSessions)

                var song = await musicSessions.musicSessions[gId].queueMusic(interaction.options.getString('song'), interaction.member.nickname)
                // console.log(musicSessions.musicSessions[gId].session.queue)
                interaction.reply(`**${song.title}** is now queued.`)

                if (musicSessions.musicSessions[gId].session.status == 'playing'){
                    return
                }

                await interaction.client.commands.get(interaction.commandName).execute(
                    musicSessions.musicSessions[gId].session, 
                    interaction
                )
            
                musicSessions.musicSessions[gId].session.conn.once(VoiceConnectionStatus.Disconnected, () => {
                    musicSessions.musicSessions[gId].session.player.removeAllListeners()
                    musicSessions.musicSessions[gId].session.conn.removeAllListeners()
                    musicSessions.musicSessions[gId].session.conn.destroy();
                    musicSessions.musicSessions[gId].session.player.stop();
                    musicSessions.musicSessions[gId].session.conn = null
                    musicSessions.musicSessions[gId].session.player = null
                    musicSessions.musicSessions[gId].session.status = 'idle'
                    if (musicSessions.musicSessions[gId].session.queue.isEmpty()){
                        musicSessions.removeSession(gId)
                    }
                    console.log(musicSessions.musicSessions)
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