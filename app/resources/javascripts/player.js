var Player = (function(song) {
  var _listSelectedMusic = [];
  var _currentMusicPlayingIdx = 0;
  var _isPlaying = false;
  var _isStop = true;
  var _playingInterval = 0;
  var _song = song;
  var _musicTags = {};
  var _playerBar;
  var _startTimeCounter;
  var _endTimeCounter;
  var _buttonPlayImage;
  var _buttonPlayIcon = ['../resources/images/icon_btn_play.png', '../resources/images/icon_btn_pause.png'];
  var _rowSelected;
  var _nextRowMusic;
  var _currentSelectedRow;

  _constructor();

  function _constructor() {}

  function onClick_ButtonPlay() {
    if (_listSelectedMusic.length <= 0) {
      return;
    }
    if (_isStop) {
      _selectedMusicToPlay(_currentMusicPlayingIdx);
    } else if(!_isPlaying){
      _onPlay();
    }else {
      _onPause();
    }
  }

  function onClick_ButtonNext(callback) {
    if (isNextMusicPlayingIdxExist()) {
      _selectedMusicToPlay(_currentMusicPlayingIdx);
      var nextRow = _getNextRow();
      if (nextRow) {
        _colorSelectedRow(nextRow);
        _currentSelectedRow = nextRow;
      }
      callback();
    }
  }

  function onClick_ButtonPrev(callback) {
    if (isPrevMusicPlayingIdxExist()) {
      _selectedMusicToPlay(_currentMusicPlayingIdx);
      var prevRow = _getPrevRow();
      if (prevRow) {
        _colorSelectedRow(prevRow);
        _currentSelectedRow = prevRow;
      }
      callback();
    }
  }

  function isNextMusicPlayingIdxExist() {
    _currentMusicPlayingIdx = parseInt(_currentMusicPlayingIdx) + 1;
    if (parseInt(_currentMusicPlayingIdx) < parseInt(_listSelectedMusic.length)) {
      return true
    } else {
      _currentMusicPlayingIdx = parseInt(_currentMusicPlayingIdx) - 1;
    }
    return false;
  }

  function isPrevMusicPlayingIdxExist() {
    _currentMusicPlayingIdx = parseInt(_currentMusicPlayingIdx) - 1;
    if (parseInt(_currentMusicPlayingIdx) < parseInt(_listSelectedMusic.length)) {
      return true
    } else {
      _currentMusicPlayingIdx = parseInt(_currentMusicPlayingIdx) + 1;
    }
    return false;
  }

  function _onPlay() {
    _song.play();
    _isPlaying = true;
    _buttonPlayImage.attr('src', _buttonPlayIcon[1]);
    _playingInterval = setInterval(function() {
      _playerBar.val(_song.currentTime.toFixed(0));
      _startTimeCounter.text(convertSeconds(_song.currentTime.toFixed(0)));
      _endTimeCounter.text(convertSeconds(_song.duration.toFixed(0)));
    }, 1000);

  }

  function _onPause() {
    _song.pause();
    _buttonPlayImage.attr('src', _buttonPlayIcon[0]);
    clearInterval(_playingInterval);
    _isPlaying = false;
  }

  function _onStop() {
    _song.pause();
    _buttonPlayImage.attr('src', _buttonPlayIcon[0]);
    clearInterval(_playingInterval);
    //_song.setAttribute('src', '');
    _isStop = true;
  }

  function convertSeconds(sec) {
    return (
      parseInt(sec / 60) + ":" +
      ((sec % 60) < 10 ? '0' + (parseInt(sec % 60)) : (parseInt(sec % 60)))
    );
  }

  function onChange_volumeBar() {
    if (_song.muted) {
      _song.muted = false;
    }
    _song.volume = ($(this).val() / 100);
  }

  function onChange_playerBar() {
    _song.currentTime = $(this).val();
  }

  function onClick_volumeDown(volumeBar) {
    volumeBar.val(0);
    _song.muted = true;
  }

  function onClick_volumeUp(volumeBar) {
    volumeBar.val(100);
    volumeBar.trigger('change');
  }

  function _clearTableList() {
    _musicList.empty();
  }

  function addMusicInfoToList(musicObj) {

    var row = '<tr>';
    row += '<td> ' + (!musicObj.title ? musicObj.name : musicObj.title) + '</td>';
    row += '<td> ' + 'musicObj' + '</td>';
    row += '<td> ' + (musicObj.album ? musicObj.album : 'none') + '</td>';
    row += '<td> ' + (musicObj.genre ? musicObj.genre : 'none') + '</td>';
    row += "<td> <img src='../resources/images/icon_remove.png'/></td>";
    row += '</tr>';

    return row;
  }

  function _selectedMusicToPlay(index) {
    var filePath = _listSelectedMusic[index].path;
    _song.setAttribute('src', filePath);
    _isStop = false;
    console.log(index);
    return new Promise(function(resolve, reject) {
      mm(fs.createReadStream(filePath), function(err, metadata) {
        if (err) throw err;
        resolve(metadata);
      });

    }).then(function(tags) {
      _musicTags = tags;
      _onPlay();
    });
  }

  function getMusicTags() {
    return _musicTags;
  }

  function onSelectedRow(e) {
    var idxRow = $(e.target).closest("tr").index();
    _selectedMusicToPlay(idxRow);
    _colorSelectedRow(e.target);
    _currentMusicPlayingIdx = idxRow;
    _currentSelectedRow = e.target;
  }

  function onOpenFile(self) {
    var _this = self;
    var musicFiles = [];
    for (var i = 0; i < _this.files.length; i++) {
      musicFiles.push(_this.files[i]);
    }

    var musicRows = [];
    musicFiles.forEach(function(music) {
      musicRows.push(addMusicInfoToList(music));
    });

    _listSelectedMusic = _listSelectedMusic.concat(musicFiles);
    return musicRows;
  }

  function setPlayerBar(bar) {
    _playerBar = bar;
  }

  function setStartTimeCounter(counter) {
    _startTimeCounter = counter
  }

  function setEndTimeCounter(counter) {
    _endTimeCounter = counter;
  }

  function setButtonPlayImage(btnImg) {
    _buttonPlayImage = btnImg;
  }

  function onClick_SelectedRow(e) {
    _colorSelectedRow(e.target);
  }

  function _colorSelectedRow(target) {
    if (_rowSelected) {
      _rowSelected.css('background-color', '')
    }

    _rowSelected = $(target).closest("tr");
    _rowSelected.css('background-color', '#E8710B');

  }

  function _getNextRow() {
    var nextRow;
    if (_currentSelectedRow.parentElement.nextSibling) {
      nextRow = _currentSelectedRow.parentElement.nextSibling.children[0];
    } else {
      nextRow = null;
    }
    return nextRow;
  }

  function _getPrevRow() {
    var prevRow;
    if (_currentSelectedRow.parentElement.previousSibling) {
      prevRow = _currentSelectedRow.parentElement.previousSibling.children[0];
    } else {
      prevRow = null;
    }
    return prevRow;
  }

  function removeMusic(idx, cb) {
    if(idx == _currentMusicPlayingIdx){

      var nextRow = _getNextRow();
      if (nextRow) {
        _colorSelectedRow(nextRow);
        _currentSelectedRow = nextRow;
      }
      _onStop();
      cb();
    }

    _listSelectedMusic.splice(idx, 1);
  }

  return {
    onOpenFile: onOpenFile,
    onSelectedRow: onSelectedRow,
    onClick_ButtonPlay: onClick_ButtonPlay,
    onChange_playerBar: onChange_playerBar,
    onClick_ButtonNext: onClick_ButtonNext,
    onClick_ButtonPrev: onClick_ButtonPrev,
    getMusicTags: getMusicTags,
    setPlayerBar: setPlayerBar,
    setStartTimeCounter: setStartTimeCounter,
    setEndTimeCounter: setEndTimeCounter,
    setButtonPlayImage: setButtonPlayImage,
    onChange_volumeBar: onChange_volumeBar,
    onClick_volumeUp: onClick_volumeUp,
    onClick_volumeDown: onClick_volumeDown,
    onClick_SelectedRow: onClick_SelectedRow,
    removeMusic: removeMusic
  }

})



module.exports = Player;
