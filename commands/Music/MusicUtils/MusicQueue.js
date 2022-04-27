const getSong = require('./getSong.js')

module.exports =  class ServerMusicQueue {
    constructor(){
        this.musicQueue = []
    }

    get length(){
        return this.musicQueue.length
    }

    isEmpty(){
        return this.musicQueue.length == 0
    }
    
    async queue(song, nickname){
        song = await getSong(song)
        song = {
            ...song,
            requestedBy: nickname
        }
        this.musicQueue.push(song)
        return song
    }
}