const playdl = require('play-dl');
const { createAudioResource } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js')

module.exports = class Player{
    static async playNextMusic(serverSession){
        const music = serverSession.queue.musicQueue.shift()
        const embed = {
            color: 0xFFFFFF,
            title: music.title,
            url: music.url,
            description: music.description == "" ? ' ' : music.description,
            thumbnail: {
                url: music.thumbnailUrl
            },
            author: {
                name: "Now Playing"
            }
        }
        const resource = await Player.getResource(music.url)
        serverSession.status = 'playing'
        serverSession.callChannel.send({ embeds: [embed] })


        serverSession.player.play(resource)
    }

    static async getResource(url){
        const st = await playdl.stream(url);
        const resource = createAudioResource(st.stream, { inputType: st.type });
    
        return resource;
    }
}