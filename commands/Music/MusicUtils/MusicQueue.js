const getSong = require('./getSong.js')

module.exports =  class ServerMusicQueue {
    constructor(){
        this.musicQueue = []
    }

    get length(){
        return this.musicQueue.length
    }

    get isEmpty(){
        return this.musicQueue.length == 0
    }
    
    async queue(song){
        song = await getSong(song)
        this.musicQueue.push(song)
    }
}