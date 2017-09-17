const fs = require('fs');
const path = require('path');
const mm = require('musicmetadata');
const electron = require('electron');
const dialog = electron.dialog;
const Promise = require('promise');

(function() {
  // Attributes ----------------
  var _song = document.createElement('audio');
  var _playerBar = $('.player-bar-loading');
  var _buttonPlay = $('.button-play');
  var _buttonNext = $('.button-right');
  var _buttonPrev = $('.button-left');
  var _isPlaying = false;
  var _buttonPlayIcon = ['../resources/images/icon_btn_play.png', '../resources/images/icon_btn_pause.png'];
  var _buttonPlayImage = $('.button-play img');
  var _volumeBar = $('.volume-bar');
  var _volumeUp = $('.volume-up img');
  var _volumeDown = $('.volume-down img');
  var _playingInterval = 0;
  var _startTimeCounter = $('.start-time');
  var _endTimeCounter = $('.end-time');
  var _musicTitle = $('.player-layout h4');
  var _musicSubTitle = $('.player-layout p');
  var _musicTrack = $('.music-track');
  var _musicArtist = $('.music-artist');
  var _musicAlbum = $('.music-album');
  var _musicList = $('.body-player .side-music-info-container .list-music-play-container table.table-scroll tbody');
  var _musicDetails = $('.music.details-container');
  var _btnOpenFile = $('.btn-open-file');
  var _listSelectedMusic = [];
  var _musicTags = {};
  var _currentMusicPlayingIdx = 0;

  // Methodes -----------------
  _constructor();
  function _constructor(){
    //
    _song.setAttribute('src', 'D:/Music/Miley_Cyrus_When_I_Look_At_You.mp3');
    //
    _song.onended = _onEnded_musicPlaying;
    //
    _playerBar.change(_onChange_playerBar);
    //
    _buttonPlay.on('click', _onClick_ButtonPlay);
    //
    _buttonNext.on('click', _onClick_ButtonNext);
    //
    _buttonPrev.on('click', _onClick_ButtonPrev);
    //
    _volumeBar.on('change',_onChange_volumeBar);
    //
    _song.volume = (_volumeBar.val() / 100);
    //
    _volumeUp.click(_onClick_volumeUp);
    //
    _volumeDown.click(_onClick_volumeDown);
    //
    _musicList.delegate("tr td", "dblclick", _onDoubleClick_rowTable);
    //
    _btnOpenFile.on('change',_onClick_btnOpenFile);

  }

  function _onClick_ButtonPlay() {
    if(_listSelectedMusic.length == 0){
      return;
    }
    _isPlaying = !_isPlaying;
    (_isPlaying) ?_onPlay() : _onPause();
  }

  function _onClick_ButtonNext() {
    _currentMusicPlayingIdx = parseInt(_currentMusicPlayingIdx) + 1;
    if( parseInt(_currentMusicPlayingIdx) < parseInt(_listSelectedMusic.length) ) {
      _selectedMusicToPlay(_currentMusicPlayingIdx)
    }else {
      _currentMusicPlayingIdx =  parseInt(_currentMusicPlayingIdx) - 1;
    }
  }

  function _onClick_ButtonPrev() {
    _currentMusicPlayingIdx = parseInt(_currentMusicPlayingIdx) - 1;
    if( parseInt(_currentMusicPlayingIdx) >= 0) {
      _selectedMusicToPlay(_currentMusicPlayingIdx)
    }else {
      _currentMusicPlayingIdx =  parseInt(_currentMusicPlayingIdx) + 1;
    }
  }

  function _onPlay(musicTag) {
    _song.play();
    _buttonPlayImage.attr('src', _buttonPlayIcon[1]);
    var x = 0;
    _playingInterval = setInterval(function(){
      _playerBar.val(_song.currentTime.toFixed(0));
      _startTimeCounter.text(convertSeconds(_song.currentTime.toFixed(0)));
      if(x < 2){
        _displayMusicInfo(musicTag);
        x = x + 1;
      }

    }, 1000);
  }

  function _onPause() {
    _song.pause();
    _buttonPlayImage.attr('src', _buttonPlayIcon[0]);
    clearInterval(_playingInterval);
  }

  function _displayMusicInfo(musicTag) {
    var musicTitle = (musicTag.title) ? musicTag.title : _listSelectedMusic[_currentMusicPlayingIdx].name;
    //
    _musicTitle.text(musicTitle);
    _musicSubTitle.text(musicTag.artist + " - " + musicTag.album);

    //
    _musicTrack.text(musicTitle);
    _musicArtist.text(musicTag.artist);
    _musicAlbum.text(musicTag.album);

    _endTimeCounter.text(convertSeconds(_song.duration.toFixed(0)));
    _playerBar.attr('max', _song.duration.toFixed(0));
  }

  function convertSeconds(sec) {
    return (
      parseInt(sec / 60) + ":" +
      ( (sec % 60) < 10 ?  '0' + (parseInt(sec % 60)) : (parseInt(sec % 60)) )
    );
  }

  function _onChange_volumeBar(){
    if(_song.muted){
      _song.muted = false;
    }
    _song.volume = ($(this).val() / 100);
  }

  function _onChange_playerBar() {
    _song.currentTime = $(this).val();
  }

  function _onClick_volumeDown() {
    _volumeBar.val(0);
    _song.muted = true;
  }

  function _onClick_volumeUp() {
    _volumeBar.val(100);
    _volumeBar.trigger('change');
  }

  function _onEnded_musicPlaying() {
    _onClick_ButtonNext();
  }

  function _clearTableList() {
    _musicList.empty();
  }

  function addMusicInfoToList(musicObj) {

    var row = '<tr>';
    row += '<td> ' + ( !musicObj.title ? musicObj.name : musicObj.title) + '</td>';
    row += '<td> ' + 'musicObj' + '</td>';
    row += '<td> ' + ( musicObj.album ? musicObj.album : 'none') + '</td>';
    row += '<td> ' + ( musicObj.genre ? musicObj.genre : 'none' ) + '</td>';
    row += '</tr>';

    _musicList.append(row);
  }

  function _selectedMusicToPlay(index) {
    var filePath = _listSelectedMusic[index].path;
    _song.setAttribute('src', filePath);
    var readableStream = fs.createReadStream(filePath);
    var parser = mm(readableStream, function (err, metadata) {
      if (err) throw err;
      _onPlay(metadata);
      readableStream.close();
    });

  }

  function _onDoubleClick_rowTable() {
    var idxRow = $(this).closest("tr").index();
    _selectedMusicToPlay(idxRow);
    _currentMusicPlayingIdx = idxRow;
  }

  function _onClick_btnOpenFile() {
    var musicFiles = [];
    for (var i = 0; i < this.files.length; i++) {
      musicFiles.push(this.files[i]);
    }

    musicFiles.forEach(function(music){
      addMusicInfoToList(music);
      console.log(music);
    });

    _listSelectedMusic = _listSelectedMusic.concat(musicFiles);

  }

})();
