const fs = require('fs');
const path = require('path');
const mm = require('musicmetadata');
const electron = require('electron');
const dialog = electron.dialog;
const Promise = require('promise');
const Player = require('../resources/javascripts/player');
const Visualizer = require('../resources/javascripts/visualizer');

(function() {
  // Attributes ----------------
  var _player;
  var _visualiser;
  var _song = document.createElement('audio');
  var _playerBar = $('.player-bar-loading');
  var _buttonPlay = $('.button-play');
  var _buttonNext = $('.button-right');
  var _buttonPrev = $('.button-left');
  var _buttonPlayImage = $('.button-play img');
  var _volumeBar = $('.volume-bar');
  var _volumeUp = $('.volume-up img');
  var _volumeDown = $('.volume-down img');
  var _startTimeCounter = $('.start-time');
  var _endTimeCounter = $('.end-time');
  var _musicTitle = $('.player-layout h4');
  var _musicSubTitle = $('.player-layout p');
  var _musicTrack = $('.music-track');
  var _musicArtist = $('.music-artist');
  var _musicAlbum = $('.music-album');
  var _tableMusicList = $('.body-player .side-music-info-container .list-music-play-container table.table-scroll tbody');
  var _removeButton = _tableMusicList;
  var _musicDetails = $('.music.details-container');
  var _btnOpenFile = $('.btn-open-file');
  var _musicTags = {};
  var _musicVisualizer = document.getElementsByClassName('music-playing-visualizer')[0];
  var _playingInterval;


  // Methodes -----------------
  _constructor();

  function _constructor() {
    _player = new Player(_song);
    //
    _visualiser = new Visualizer(_song, _musicVisualizer);
    //
    _player.setPlayerBar(_playerBar);
    _player.setStartTimeCounter(_startTimeCounter);
    _player.setEndTimeCounter(_endTimeCounter);
    _player.setButtonPlayImage(_buttonPlayImage);
    //
    _playerBar.change(_player.onChange_playerBar);
    _buttonPlay.on('click', _player.onClick_ButtonPlay);
    _buttonNext.on('click', _player.onClick_ButtonNext.bind(null, showInfo));
    _buttonPrev.on('click', _player.onClick_ButtonPrev.bind(null, showInfo));
    _volumeBar.on('change', _player.onChange_volumeBar);
    _volumeUp.on('click', _player.onClick_volumeUp.bind(null, _volumeBar));
    _volumeDown.on('click', _player.onClick_volumeDown.bind(null, _volumeBar));
    _tableMusicList.delegate("tr td", "dblclick", _onDoubleClick_rowTable);
    _tableMusicList.delegate("tr td", "click", _onClick_rowTable);
    _removeButton.delegate('tr td:nth-child(5)', 'click', _onClickRemoveRow);
    _btnOpenFile.on('change', _onClick_btnOpenFile);
    _song.onended = _onEnded_musicPlaying;
  }

  function _onClick_btnOpenFile() {
    var rows = _player.onOpenFile(this);
    rows.forEach(function(row) {
      _tableMusicList.append(row);
    });
  }

  function _onEnded_musicPlaying() {
    _buttonNext.trigger('click');
  }

  function _onDoubleClick_rowTable(e) {
    _player.onSelectedRow(e);
    showInfo();
  }

  function _onClick_rowTable(e) {
    _player.onClick_SelectedRow(e);
  }

  function showInfo() {
    var x = 0;
    _playingInterval = setInterval(function() {
      if (x < 2) {
        _musicTags = _player.getMusicTags();
        x = x + 1;
      } else {
        _displayMusicInfo();
        clearInterval(this);
      }
    }, 1000);
  }

  function _displayMusicInfo() {
    var musicTitle = _musicTags.title;
    //
    _musicTitle.text(musicTitle);
    _musicSubTitle.text(_musicTags.artist + " - " + _musicTags.album);
    _musicTrack.text(musicTitle);
    _musicArtist.text(_musicTags.artist);
    _musicAlbum.text(_musicTags.album);
    //
    _playerBar.attr('max', _song.duration.toFixed(0));
  }

  function _onClickRemoveRow(e) {
    var indexRow = $(e.target).closest('tr').index();
    _player.removeMusic(indexRow, _initMusicInfo, showInfo);
    $(e.target).closest('tr').remove();
  }

  function _initMusicInfo() {
    console.log('Yes');

    if(_playingInterval){
      clearInterval(_playingInterval);
    }

    _musicTitle.text('Bloody Poetry');
    _musicSubTitle.text("Grieves" + " - " + "Together Apart");
    _musicTrack.text("Bloody Poetry");
    _musicArtist.text("Grieves");
    _musicAlbum.text("Together Apart");
    //
    _startTimeCounter.text("00:00");
    _endTimeCounter.text("99:99");
    _playerBar.val(0)
    _playerBar.attr('max', 100);

  }

})();
