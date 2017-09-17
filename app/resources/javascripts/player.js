var Player = (function(audio){
  var _song = audio;
  var _listSong = [];
  var _musicTags = {};
  var _musicList = [];
  var _playingMusicIndex = 0;

  _constructor();
  _constructor(){

  }

  function play() {
    _song.play();
  }

  function pause() {
    _song.pause();
  }

  function addMusic(indexMusic) {
    _song.setAttribute('src', _musicList[indexMusic].path);
  }

  function setMusicList(list) {
    _musicList = list;
  }

  function removeSong(index) {
    _musicList.splice(index, 1);
  }

  function playNextSong() {
    addMusic()
  }


  return {
    play: play,
    addSong: addSong,
    removeSong: removeSong
  }
});






module.exports = Player;
