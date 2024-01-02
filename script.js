(function () {
    var script = {
        "mouseWheelEnabled": true,
        "start": "this.init()",
        "layout": "absolute",
        "scrollBarWidth": 10,
        "id": "rootPlayer",
        "mobileMipmappingEnabled": false,
        "vrPolyfillScale": 1,
        "propagateClick": false,
        "paddingLeft": 0,
        "scrollBarColor": "#000000",
        "paddingRight": 0,
        "backgroundPreloadEnabled": true,
        "children": [
            "this.MainViewer",
            "this.Container_87F97A04_9408_2F1E_41D6_87A896476428",
            "this.Container_87149426_9438_3B1D_41B8_2C4BE7ED32A0",
            "this.Button_80F16AFC_9438_2CED_41D5_5BB3DA4580B6",
            "this.Button_80F16AFC_9438_2CED_41D5_5BB3DA4580B7",
            "this.Button_87AB1AC0_9438_EF16_41CB_8896ED4E9C15",
            "this.Container_8E9E2752_98C5_670E_41E2_2BD90F263340"
        ],
        "borderSize": 0,
        "scrollBarVisible": "rollOver",
        "desktopMipmappingEnabled": false,
        "minHeight": 20,
        "scripts": {
            "setPanoramaCameraWithCurrentSpot": function (playListItem) { var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if (currentPlayer == undefined) { return; } var playerClass = currentPlayer.get('class'); if (playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player') { return; } var fromMedia = currentPlayer.get('panorama'); if (fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
            "unregisterKey": function (key) { delete window[key]; },
            "getKey": function (key) { return window[key]; },
            "changePlayListWithSameSpot": function (playList, newIndex) { var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
            "setComponentVisibility": function (component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout) { var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if (keepVisibility) return; this.unregisterKey('visibility_' + component.get('id')); var changeVisibility = function () { if (effect && propertyEffect) { component.set(propertyEffect, effect); } component.set('visible', visible); if (component.get('class') == 'ViewerArea') { try { if (visible) component.restart(); else if (component.get('playbackState') == 'playing') component.pause(); } catch (e) { }; } }; var effectTimeoutName = 'effectTimeout_' + component.get('id'); if (!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)) { var effectTimeout = window[effectTimeoutName]; if (effectTimeout instanceof Array) { for (var i = 0; i < effectTimeout.length; i++) { clearTimeout(effectTimeout[i]) } } else { clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if (visible == component.get('visible') && !ignoreClearTimeout) return; if (applyAt && applyAt > 0) { var effectTimeout = setTimeout(function () { if (window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if (arrayTimeoutVal.length == 0) { delete window[effectTimeoutName]; } } else { delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if (window.hasOwnProperty(effectTimeoutName)) { window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; } else { window[effectTimeoutName] = effectTimeout; } } else { changeVisibility(); } },
            "redirecttoHome": function () { return window.location.href = 'https://www.3ddemo.online'; },


            "playGlobalAudioWhilePlay": function (playList, index, audio, endCallback) { var changeFunction = function (event) { if (event.data.previousSelectedIndex == index) { this.stopGlobalAudio(audio); if (isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if (endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if (audios && audio.get('id') in audios) { audio = audios[audio.get('id')]; if (audio.get('state') != 'playing') { audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if (isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if (audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for (var i = 0; i < stateChangeFunctions.length; ++i) { var f = stateChangeFunctions[i]; if (typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
            "showPopupPanoramaVideoOverlay": function (popupPanoramaOverlay, closeButtonProperties, stopAudios) { var self = this; var showEndFunction = function () { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function () { if (!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function () { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if (stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function () { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if (closeButtonProperties) { for (var key in closeButtonProperties) { closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if (stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
            "setMapLocation": function (panoramaPlayListItem, mapPlayer) { var resetFunction = function () { panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
            "shareTwitter": function (url) { window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
            "playAudioList": function (audios) { if (audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function () { if (++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
            "pauseGlobalAudiosWhilePlayItem": function (playList, index, exclude) { var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function () { if (playList.get('selectedIndex') != index) { if (hasState) { player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function (event) { var state = event.data.state; if (state == 'stopped') { this.resumeGlobalAudios(caller); } else if (state == 'playing') { this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if (hasState) { player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
            "getComponentByName": function (name) { var list = this.getByClassName('UIComponent'); for (var i = 0, count = list.length; i < count; ++i) { var component = list[i]; var data = component.get('data'); if (data != undefined && data.name == name) { return component; } } return undefined; },
            "changeBackgroundWhilePlay": function (playList, index, color) { var stopFunction = function (event) { playListItem.unbind('stop', stopFunction, this); if ((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))) { viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if ((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)) { viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
            "setStartTimeVideoSync": function (video, player) { this.setStartTimeVideo(video, player.get('currentTime')); },
            "showWindow": function (w, autoCloseMilliSeconds, containsAudio) { if (w.get('visible') == true) { return; } var closeFunction = function () { clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function () { w.unbind('click', clearAutoClose, this); if (timeoutID != undefined) { clearTimeout(timeoutID); } }; var timeoutID = undefined; if (autoCloseMilliSeconds) { var autoCloseFunction = function () { w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
            "showPopupMedia": function (w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios) { var self = this; var closeFunction = function () { playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if (stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if (isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function () { w.hide(); }; var resizeFunction = function () { var getWinValue = function (property) { return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if (!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if (parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if (windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if (windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if (autoCloseWhenFinished) { this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if (isVideo) { this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if (stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
            "getOverlays": function (media) { switch (media.get('class')) { case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for (var j = 0; j < frames.length; ++j) { overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
            "resumePlayers": function (players, onlyResumeCameraIfPanorama) { for (var i = 0; i < players.length; ++i) { var player = players[i]; if (onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined') { player.resumeCamera(); } else { player.play(); } } },
            "showPopupPanoramaOverlay": function (popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio) { var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if (!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function () { var loadedFunction = function () { if (!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function () { var restoreShowDurationFunction = function () { popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if (popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if (!imageHD) { imageHD = popupPanoramaOverlay.get('image'); } if (!toggleImageHD && toggleImage) { toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function () { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if (audio) { if (stopBackgroundAudio) { self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if (audio) { if (stopBackgroundAudio) { this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
            "existsKey": function (key) { return key in window; },
            "registerKey": function (key, value) { window[key] = value; },
            "setMediaBehaviour": function (playList, index, mediaDispatcher) { var self = this; var stateChangeFunction = function (event) { if (event.data.state == 'stopped') { dispose.call(this, true); } }; var onBeginFunction = function () { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if (media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)) { player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function () { var index = playListDispatcher.get('selectedIndex'); if (index != -1) { indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function () { dispose.call(this, false); }; var dispose = function (forceDispose) { if (!playListDispatcher) return; var media = item.get('media'); if ((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if (panoramaSequence && panoramaSequenceIndex != -1) { if (panoramaSequence) { if (panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex - 1].get('class') == 'TargetPanoramaCameraMovement') { var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex - 1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function (event) { initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if (player) { item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for (var i = 0; i < buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if (sameViewerArea) { var currentMedia = this.getMediaFromPlayer(player); if (currentMedia == undefined || currentMedia == item.get('media')) { playListDispatcher.set('selectedIndex', indexDispatcher); } if (playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else { viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if (!mediaDispatcher) { var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if (currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if (!playListDispatcher) { playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if (playList.get('selectedIndex') == index || indexDispatcher == -1) { return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if (sameViewerArea) { if (playList != playListDispatcher) { playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else { viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if (camera) { panoramaSequence = camera.get('initialSequence'); if (panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function (property) { var value = player.get(property); if (value == undefined) return; if (Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for (var i = 0; i < buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if (player != itemDispatcher.get('player') || !mediaDispatcherByParam) { item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
            "isCardboardViewMode": function () { var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
            "setPanoramaCameraWithSpot": function (playListItem, yaw, pitch) { var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
            "shareWhatsapp": function (url) { window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
            "getPanoramaOverlayByName": function (panorama, name) { var overlays = this.getOverlays(panorama); for (var i = 0, count = overlays.length; i < count; ++i) { var overlay = overlays[i]; var data = overlay.get('data'); if (data != undefined && data.label == name) { return overlay; } } return undefined; },
            "showPopupImage": function (image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback) { var self = this; var closed = false; var playerClickFunction = function () { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function () { zoomImage.unbind('click', clearAutoClose, this); if (timeoutID != undefined) { clearTimeout(timeoutID); } }; var resizeFunction = function () { setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function () { self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function () { timeoutID = undefined; if (autoCloseMilliSeconds) { var autoCloseFunction = function () { hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if (toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if (loadedCallback) loadedCallback(); }; var hideFunction = function () { self.MainViewer.set('toolTipEnabled', true); closed = true; if (timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if (autoCloseMilliSeconds) clearAutoClose(); if (hideCallback) hideCallback(); zoomImage.set('visible', false); if (hideEffect && hideEffect.get('duration') > 0) { hideEffect.bind('end', endEffectFunction, this); } else { zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if (toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if (audio) { if (stopBackgroundAudio) { self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function () { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function () { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function () { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function () { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if (right < 10) right = 10; if (top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function () { if (timeoutUserInteractionID) { clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else { closeButton.set('visible', false); } }; var userInteractionEndFunction = function () { if (!closed) { timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function () { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if (closeButtonProperties) { for (var key in closeButtonProperties) { closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if (audio) { if (stopBackgroundAudio) { this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function () { self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
            "getPixels": function (value) { var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch (unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
            "historyGoForward": function (playList) { var history = this.get('data')['history'][playList.get('id')]; if (history != undefined) { history.forward(); } },
            "playGlobalAudio": function (audio, endCallback) { var endFunction = function () { audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if (endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if (!audios) { audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if (audio.get('state') == 'playing') { return audio; } if (!audio.get('loop')) { audio.bind('end', endFunction, this); } audio.play(); return audio; },
            "init": function () { if (!Object.hasOwnProperty('values')) { Object.values = function (o) { return Object.keys(o).map(function (e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function (e) { var playList = e.source; var index = playList.get('selectedIndex'); if (index < 0) return; var id = playList.get('id'); if (!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for (var i = 0, count = playLists.length; i < count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
            "getMediaHeight": function (media) { switch (media.get('class')) { case 'Video360': var res = media.get('video'); if (res instanceof Array) { var maxH = 0; for (var i = 0; i < res.length; i++) { var r = res[i]; if (r.get('height') > maxH) maxH = r.get('height'); } return maxH; } else { return r.get('height') } default: return media.get('height'); } },
            "setMainMediaByIndex": function (index) { var item = undefined; if (index >= 0 && index < this.mainPlayList.get('items').length) { this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
            "setEndToItemIndex": function (playList, fromIndex, toIndex) { var endFunction = function () { if (playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
            "historyGoBack": function (playList) { var history = this.get('data')['history'][playList.get('id')]; if (history != undefined) { history.back(); } },
            "setMainMediaByName": function (name) { var items = this.mainPlayList.get('items'); for (var i = 0; i < items.length; ++i) { var item = items[i]; if (item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
            "fixTogglePlayPauseButton": function (player) { var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if (typeof buttons !== 'undefined' && player.get('state') == 'playing') { if (!Array.isArray(buttons)) buttons = [buttons]; for (var i = 0; i < buttons.length; ++i) buttons[i].set('pressed', true); } },
            "shareFacebook": function (url) { window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
            "getMediaWidth": function (media) { switch (media.get('class')) { case 'Video360': var res = media.get('video'); if (res instanceof Array) { var maxW = 0; for (var i = 0; i < res.length; i++) { var r = res[i]; if (r.get('width') > maxW) maxW = r.get('width'); } return maxW; } else { return r.get('width') } default: return media.get('width'); } },
            "executeFunctionWhenChange": function (playList, index, endFunction, changeFunction) { var endObject = undefined; var changePlayListFunction = function (event) { if (event.data.previousSelectedIndex == index) { if (changeFunction) changeFunction.call(this); if (endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if (endFunction) { var playListItem = playList.get('items')[index]; if (playListItem.get('class') == 'PanoramaPlayListItem') { var camera = playListItem.get('camera'); if (camera != undefined) endObject = camera.get('initialSequence'); if (endObject == undefined) endObject = camera.get('idleSequence'); } else { endObject = playListItem.get('media'); } if (endObject) { endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
            "getCurrentPlayerWithMedia": function (media) { var playerClass = undefined; var mediaPropertyName = undefined; switch (media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if (playerClass != undefined) { var players = this.getByClassName(playerClass); for (var i = 0; i < players.length; ++i) { var player = players[i]; if (player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
            "getActivePlayerWithViewer": function (viewerArea) { var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while (i-- > 0) { var player = players[i]; if (player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if (playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if ((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if (playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if (playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
            "keepComponentVisibility": function (component, keep) { var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if (value == undefined && keep) { this.registerKey(key, keep); } else if (value != undefined && !keep) { this.unregisterKey(key); } },
            "initGA": function () { var sendFunc = function (category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for (var i = 0, countI = media.length; i < countI; ++i) { var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for (var j = 0, countJ = overlays.length; j < countJ; ++j) { var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch (overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z < areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for (var i = 0, countI = components.length; i < countI; ++i) { var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for (var i = 0, countI = items.length; i < countI; ++i) { var item = items[i]; var media = item.get('media'); if (!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
            "loopAlbum": function (playList, index) { var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function () { player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
            "setOverlayBehaviour": function (overlay, media, action) { var executeFunc = function () { switch (action) { case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if (overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if (window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function () { delete window.overlaysDispatched[id]; }, 2000); }; if (window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if (playList != undefined) { var item = this.getPlayListItemByMedia(playList, media); if (playList.get('items').indexOf(item) != playList.get('selectedIndex')) { var beginFunc = function (e) { item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
            "cloneCamera": function (camera) { var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
            "pauseGlobalAudios": function (caller, exclude) { if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i < count; ++i) { var objAudios = values[i]; for (var j = 0; j < objAudios.length; ++j) { var a = objAudios[j]; if (audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
            "syncPlaylists": function (playLists) { var changeToMedia = function (media, playListDispatched) { for (var i = 0, count = playLists.length; i < count; ++i) { var playList = playLists[i]; if (playList != playListDispatched) { var items = playList.get('items'); for (var j = 0, countJ = items.length; j < countJ; ++j) { if (items[j].get('media') == media) { if (playList.get('selectedIndex') != j) { playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function (event) { var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if (selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function (event) { var panoramaMapLocation = event.source.get('panoramaMapLocation'); if (panoramaMapLocation) { var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for (var i = 0, count = playLists.length; i < count; ++i) { playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for (var i = 0, count = mapPlayers.length; i < count; ++i) { mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
            "getPlayListItemByMedia": function (playList, media) { var items = playList.get('items'); for (var j = 0, countJ = items.length; j < countJ; ++j) { var item = items[j]; if (item.get('media') == media) return item; } return undefined; },
            "loadFromCurrentMediaPlayList": function (playList, delta) { var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while (newIndex < 0) { newIndex = totalItems + newIndex; }; if (currentIndex != newIndex) { playList.set('selectedIndex', newIndex); } },
            "getMediaFromPlayer": function (player) { switch (player.get('class')) { case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
            "getPlayListItems": function (media, player) { var itemClass = (function () { switch (media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length - 1; i >= 0; --i) { var item = items[i]; if (item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
            "showComponentsWhileMouseOver": function (parentComponent, components, durationVisibleWhileOut) { var setVisibility = function (visible) { for (var i = 0, length = components.length; i < length; i++) { var component = components[i]; if (component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true) { setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function () { setVisibility(true); if (timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function () { var timeoutFunction = function () { setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
            "stopGlobalAudio": function (audio) { var audios = window.currentGlobalAudios; if (audios) { audio = audios[audio.get('id')]; if (audio) { delete audios[audio.get('id')]; if (Object.keys(audios).length == 0) { window.currentGlobalAudios = undefined; } } } if (audio) audio.stop(); },
            "visibleComponentsIfPlayerFlagEnabled": function (components, playerFlag) { var enabled = this.get(playerFlag); for (var i in components) { components[i].set('visible', enabled); } },
            "getPlayListWithMedia": function (media, onlySelected) { var playLists = this.getByClassName('PlayList'); for (var i = 0, count = playLists.length; i < count; ++i) { var playList = playLists[i]; if (onlySelected && playList.get('selectedIndex') == -1) continue; if (this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
            "stopAndGoCamera": function (camera, ms) { var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function () { sequence.play(); }; setTimeout(timeoutFunction, ms); },
            "pauseCurrentPlayers": function (onlyPauseCameraIfPanorama) { var players = this.getCurrentPlayers(); var i = players.length; while (i-- > 0) { var player = players[i]; if (player.get('state') == 'playing') { if (onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined') { player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
            "autotriggerAtStart": function (playList, callback, once) { var onChange = function (event) { callback(); if (once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
            "triggerOverlay": function (overlay, eventName) { if (overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for (var i = 0; i < areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
            "getMediaByName": function (name) { var list = this.getByClassName('Media'); for (var i = 0, count = list.length; i < count; ++i) { var media = list[i]; if ((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name) { return media; } } return undefined; },
            "resumeGlobalAudios": function (caller) { if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i < count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length - 1; j >= 0; --j) { var a = audiosPaused[j]; if (objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i < count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
            "getGlobalAudio": function (audio) { var audios = window.currentGlobalAudios; if (audios != undefined && audio.get('id') in audios) { audio = audios[audio.get('id')]; } return audio; },
            "startPanoramaWithCamera": function (media, camera) { if (window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1) { return; } var playLists = this.getByClassName('PlayList'); if (playLists.length == 0) return; var restoreItems = []; for (var i = 0, count = playLists.length; i < count; ++i) { var playList = playLists[i]; var items = playList.get('items'); for (var j = 0, countJ = items.length; j < countJ; ++j) { var item = items[j]; if (item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')) { restoreItems.push({ camera: item.get('camera'), item: item }); item.set('camera', camera); } } } if (restoreItems.length > 0) { if (window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function () { var index = window.currentPanoramasWithCameraChanged.indexOf(media); if (index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
            "getCurrentPlayers": function () { var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
            "updateMediaLabelFromPlayList": function (playList, htmlText, playListItemStopToDispose) { var changeFunction = function () { var index = playList.get('selectedIndex'); if (index >= 0) { var beginFunction = function () { playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function (index) { var media = playListItem.get('media'); var text = media.get('data'); if (!text) text = media.get('label'); setHtml(text); }; var setHtml = function (text) { if (text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if (htmlText.get('html')) { setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else { setMediaLabel(index); } } }; var disposeFunction = function () { htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if (playListItemStopToDispose) { playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
            "setCameraSameSpotAsMedia": function (camera, media) { var player = this.getCurrentPlayerWithMedia(media); if (player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
            "setStartTimeVideo": function (video, time) { var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function () { for (var i = 0; i < items.length; ++i) { var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for (var i = 0; i < items.length; ++i) { var item = items[i]; var player = item.get('player'); if (player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
            "pauseGlobalAudio": function (audio) { var audios = window.currentGlobalAudios; if (audios) { audio = audios[audio.get('id')]; } if (audio.get('state') == 'playing') audio.pause(); },
            "openLink": function (url, name) { if (url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if (extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if (isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
            "updateVideoCues": function (playList, index) { var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if (video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function () { if (playList.get('selectedIndex') != index) { video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function (event) { var activeCues = event.data.activeCues; for (var i = 0, count = cues.length; i < count; ++i) { var cue = cues[i]; if (activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime') + 0.5)) { cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); }
        },
        "verticalAlign": "top",
        "scrollBarOpacity": 0.5,
        "scrollBarMargin": 2,
        "contentOpaque": false,
        "minWidth": 20,
        "defaultVRPointer": "laser",
        "horizontalAlign": "left",
        "downloadEnabled": true,
        "gap": 10,
        "height": "100%",
        "paddingTop": 0,
        "buttonToggleMute": "this.IconButton_87F91A04_9408_2F1E_41CB_C716BE82C7BB",
        "shadow": false,
        "paddingBottom": 0,
        "borderRadius": 0,
        "class": "Player",
        "data": {
            "name": "Player455"
        },
        "overflow": "visible",
        "definitions": [{
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C631946_5E65_87AC_41AF_8D8B7C21A348",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -108.4,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_799DE5AA_6870_1BB0_418C_9DACB3D8DC07"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -27.76,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79276543_6870_18F0_41B8_17E9471CF458"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 18.97,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B6766D4_6870_1990_41D7_A669E1661707"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 59.91,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A4025E9_6870_1BB0_41BB_A8CDAC0CED33"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -164.05,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B2C2708_6870_1870_41A2_8DFDB82671FF"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_89FAD16C_99AD_658C_41AF_67757420F387_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_camera"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": 27.01,
                    "backwardYaw": -85.61,
                    "distance": 1,
                    "panorama": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387"
                }
            ],
            "hfov": 360,
            "label": "PANOROMA 4 copy",
            "audios": [
                "this.audio_4FA95880_5E67_86A3_41AB_DE6D90CC4EC4"
            ],
            "id": "panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C",
            "thumbnailUrl": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_83781644_938D_B717_41BD_1B61DFDC7EF7"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -152.99,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7AF43665_6870_18B0_41C2_03E97084D5EC"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C507612_5E62_8DA7_41C8_8BCAD36F7D72",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 98.23,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B5B06B5_6870_1990_41C9_589688F1AE03"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 179.24,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B7796CA_6870_19F0_41C0_F9F25E155E6D"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 94.07,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A8FD695_6870_1990_41B0_449C6E892BEB"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -152.99,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7AE3A66F_6870_18B0_41BE_7168D1757873"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                },
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "BTH-2",
            "audios": [
                "this.audio_4C507612_5E62_8DA7_41C8_8BCAD36F7D72"
            ],
            "id": "panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1",
            "thumbnailUrl": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_4FC79079_5E62_8665_41D1_C8AA9C8BB299",
                "this.overlay_4FC7F079_5E62_8665_41D3_48C85CAEA8D5"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -94.08,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7AC7365B_6870_1890_41C9_4769CA0F0DA6"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_839E559D_93BD_B531_41D9_55F741B8C109_camera"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4FA95880_5E67_86A3_41AB_DE6D90CC4EC4",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -94.82,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B03B6E8_6870_19B0_41D4_8924DA298199"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_camera"
        },
        {
            "class": "PlayList",
            "items": [
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
                    "media": "this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
                    "media": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
                    "media": "this.panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
                    "media": "this.panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
                    "media": "this.panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
                    "media": "this.panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_839E559D_93BD_B531_41D9_55F741B8C109_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
                    "media": "this.panorama_839E559D_93BD_B531_41D9_55F741B8C109",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
                    "media": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_81363130_938C_8D0F_41C5_8590958EBAB7_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
                    "media": "this.panorama_81363130_938C_8D0F_41C5_8590958EBAB7",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
                    "media": "this.panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
                    "media": "this.panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
                    "media": "this.panorama_89FC974A_997D_ADF4_41DC_B76311B665F9",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
                    "media": "this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
                    "media": "this.panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
                    "media": "this.panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "camera": "this.panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
                    "media": "this.panorama_7B5897B1_6850_0790_41D2_4E953A4A0431",
                    "player": "this.MainViewerPanoramaPlayer"
                },
                {
                    "class": "PanoramaPlayListItem",
                    "end": "this.trigger('tourEnded')",
                    "camera": "this.panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_camera",
                    "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 0)",
                    "media": "this.panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C",
                    "player": "this.MainViewerPanoramaPlayer"
                }
            ],
            "id": "mainPlayList"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -92.68,
                    "backwardYaw": 15.95,
                    "distance": 1,
                    "panorama": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387"
                }
            ],
            "hfov": 360,
            "label": "PANOROMA 1 copy",
            "audios": [
                "this.audio_4FB18F79_5E67_9A64_4199_5DE3F9BAAB67"
            ],
            "id": "panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144",
            "thumbnailUrl": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_88810F6D_999E_FD8C_41D7_F1A319B655B8",
                "this.overlay_88811F6D_999E_FD8C_41DD_F08AA16F8614"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 173.22,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7989D5B4_6870_1B90_41C6_DB7F1841724F"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 14.32,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79D06558_6870_1890_41D1_C3466500B656"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": -173.97,
                    "backwardYaw": -81.77,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "KITCHEN",
            "audios": [
                "this.audio_4C737196_5E65_86AC_41D5_CFC7DC40B62F"
            ],
            "id": "panorama_81363130_938C_8D0F_41C5_8590958EBAB7",
            "thumbnailUrl": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_80F98EDA_938D_9730_41E0_92792FBDB4C5"
            ]
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4FBB1400_5E67_8DA3_4194_D36B14FF9920",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 87.32,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7ABCD6A0_6870_19B0_41D9_B2FEC14EB0F5"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4FB18F79_5E67_9A64_4199_5DE3F9BAAB67",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 6.03,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A7605FE_6870_1B90_41CE_E1FB51DFE7E4"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": 174.85,
                    "backwardYaw": 90.68,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 172.33,
                    "backwardYaw": 90.68,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "BTH-3",
            "audios": [
                "this.audio_4C495A3E_5E62_85DF_4194_212F0B4ECEE7"
            ],
            "id": "panorama_7B5897B1_6850_0790_41D2_4E953A4A0431",
            "thumbnailUrl": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_7B58A7B1_6850_0790_41AD_2376ED443080",
                "this.overlay_7B58F7B1_6850_0790_41D2_FEB0B18CF699"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -84.66,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A3CE63C_6870_1890_41CE_3298DE2B0B8B"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D"
                },
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 46.1,
                    "backwardYaw": -74.77,
                    "distance": 1,
                    "panorama": "this.panorama_839E559D_93BD_B531_41D9_55F741B8C109"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 0.5,
                    "backwardYaw": -24.24,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "LIVING ROOM 1",
            "audios": [
                "this.audio_4FA6A249_5E66_85A5_41C1_9B9B40FBD4D0"
            ],
            "id": "panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658",
            "thumbnailUrl": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_8379ED9F_93B3_9531_41C0_9E77007ABE70",
                "this.overlay_824C3076_93B4_8BF0_41D4_9EE2FFF3697D",
                "this.overlay_7AADEC20_6850_08B0_41C2_8E0F76190C16",
                "this.overlay_7A353653_6850_1891_41B7_DF698BF990E0"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -108.4,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_799355A0_6870_1BB0_41BF_1737C6805684"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4FCB0563_5E66_8E64_41CF_0A799AF8E976",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C6A53DF_5E65_8A5D_41D2_FC39D9521BE6",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_81363130_938C_8D0F_41C5_8590958EBAB7_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 105.23,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B31B6F3_6870_1990_41C7_CC42610FF7C7"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -89.32,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79FD158B_6870_1870_41BF_598F8FAC46D8"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -27.76,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_793E8539_6870_1890_4198_252775E18566"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -65.7,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79BE65C9_6870_1BF0_41CB_A449DE2BD76A"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": -0.76,
                    "backwardYaw": -165.68,
                    "distance": 1,
                    "panorama": "this.panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 0.88,
                    "backwardYaw": -165.68,
                    "distance": 1,
                    "panorama": "this.panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -87.24,
                    "backwardYaw": -170.33,
                    "distance": 1,
                    "panorama": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387"
                }
            ],
            "hfov": 360,
            "label": "PANOROMA 3 copy",
            "audios": [
                "this.audio_4FCB0563_5E66_8E64_41CF_0A799AF8E976"
            ],
            "id": "panorama_4EC5B047_5E66_85AD_41D6_2D080845A607",
            "thumbnailUrl": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_4EC54047_5E66_85AD_41A8_F25352E73131",
                "this.overlay_4EC57048_5E66_85A3_41D1_7B28A6D2F4C3",
                "this.overlay_4EC50048_5E66_85A3_41C8_B0A0067DFCD5"
            ]
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4CF8FF09_5E65_FBA5_41CA_F6C148973505",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 67.7,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79DF456D_6870_18B0_41D0_F36A7D121D5C"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 92.76,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A90867A_6870_1890_41C7_CCF8BD32FEA4"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4FEA754B_5E62_8FA5_4189_1CDA06B333D7",
            "data": {
                "label": "Audio1"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 59.91,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A5405DE_6870_1B90_41CE_72190BE2FBB3"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4F986E6A_5E67_FA64_41A2_0F31EF67F7F9",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_camera"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4FA6A249_5E66_85A5_41C1_9B9B40FBD4D0",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C737196_5E65_86AC_41D5_CFC7DC40B62F",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 6.03,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A4AC5F3_6870_1B90_41D4_904620317576"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": -120.09,
                    "backwardYaw": -161.03,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -119.09,
                    "backwardYaw": -161.03,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "BEDROOM 3",
            "audios": [
                "this.audio_4C6CB66F_5E65_8A7D_41C9_0C008A0A56F7"
            ],
            "id": "panorama_89FC974A_997D_ADF4_41DC_B76311B665F9",
            "thumbnailUrl": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_89FCB74A_997D_ADF4_41DD_EDA8E655C2BB",
                "this.overlay_89FCC74A_997D_ADF4_41B3_72DAB4729A6E"
            ]
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": -85.93,
                    "backwardYaw": -6.78,
                    "distance": 1,
                    "panorama": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -85.42,
                    "backwardYaw": -6.78,
                    "distance": 1,
                    "panorama": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387"
                }
            ],
            "hfov": 360,
            "label": "BTH-1",
            "audios": [
                "this.audio_4C52BF20_5E62_9BE3_41C5_05966B0391CB"
            ],
            "id": "panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097",
            "thumbnailUrl": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_4EAB0746_5E67_8BAC_41A8_CC4D9F52F945",
                "this.overlay_4EAB3746_5E67_8BAC_41C5_A742D1BD00CD"
            ]
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": 85.18,
                    "backwardYaw": -112.3,
                    "distance": 1,
                    "panorama": "this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 86.52,
                    "backwardYaw": -112.3,
                    "distance": 1,
                    "panorama": "this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -74.77,
                    "backwardYaw": 46.1,
                    "distance": 1,
                    "panorama": "this.panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658"
                }
            ],
            "hfov": 360,
            "label": "LIVING ROOM 2",
            "audios": [
                "this.audio_4F9F7111_5E66_87A5_41CC_CB6B07C1A38C"
            ],
            "id": "panorama_839E559D_93BD_B531_41D9_55F741B8C109",
            "thumbnailUrl": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_8011EDD6_938D_9533_41B1_117DABFE04D8",
                "this.overlay_8804F71D_99BB_AD8C_41C7_4660E29AAF51",
                "this.overlay_8BC4E5D6_99A5_6C9C_41E2_42A986FE8611"
            ]
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1"
                },
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 114.3,
                    "backwardYaw": 152.24,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 115.05,
                    "backwardYaw": 152.24,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "BEDROOM 1",
            "audios": [
                "this.audio_4CF8FF09_5E65_FBA5_41CA_F6C148973505"
            ],
            "id": "panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B",
            "thumbnailUrl": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_8B58E0A7_997E_A4BC_4179_CCCCA0058A5A",
                "this.overlay_8B5890A7_997E_A4BC_41B3_864D0B0C7751",
                "this.overlay_8ACEEDD6_99AD_BC9C_41CF_7797104B4CF1",
                "this.overlay_8AE6989B_99AA_E494_41BD_0237E30F326C"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 94.07,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A806687_6870_1870_41D1_B99F7FDD38D0"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 155.76,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B3EA6FE_6870_1990_41C8_01E243CEF6FF"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4F9F7111_5E66_87A5_41CC_CB6B07C1A38C",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": 95.34,
                    "backwardYaw": 85.92,
                    "distance": 1,
                    "panorama": "this.panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 102,
                    "backwardYaw": 85.92,
                    "distance": 1,
                    "panorama": "this.panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -85.61,
                    "backwardYaw": 27.01,
                    "distance": 1,
                    "panorama": "this.panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -78.76,
                    "backwardYaw": 27.01,
                    "distance": 1,
                    "panorama": "this.panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -170.33,
                    "backwardYaw": -87.24,
                    "distance": 1,
                    "panorama": "this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -6.78,
                    "backwardYaw": -85.93,
                    "distance": 1,
                    "panorama": "this.panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -7.05,
                    "backwardYaw": -85.93,
                    "distance": 1,
                    "panorama": "this.panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 15.95,
                    "backwardYaw": -92.68,
                    "distance": 1,
                    "panorama": "this.panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 20.1,
                    "backwardYaw": -92.68,
                    "distance": 1,
                    "panorama": "this.panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144"
                }
            ],
            "hfov": 360,
            "label": "PANOROMA 5 copy",
            "audios": [
                "this.audio_4F986E6A_5E67_FA64_41A2_0F31EF67F7F9"
            ],
            "id": "panorama_89FAD16C_99AD_658C_41AF_67757420F387",
            "thumbnailUrl": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_89FAA16D_99AD_658C_41BE_8A24A6CD1757",
                "this.overlay_89FAB16D_99AD_658C_41C4_12528C621437",
                "this.overlay_89FA816D_99AD_658C_41D5_1EC7CF2E3B56",
                "this.overlay_89FB016D_99AD_658C_41C4_04A0C6D8650D",
                "this.overlay_89FB116D_99AD_658C_41DC_3EA0516E7B2B",
                "this.overlay_89FBE16D_99AD_658C_41DC_D4B178331943",
                "this.overlay_89FBF16D_99AD_658C_41D5_47731503B0DD",
                "this.overlay_8AAF6201_99A6_A774_41E2_6DB751C434ED",
                "this.overlay_8A814F2F_99A7_BD8C_41D7_7A2DB1DE5F46"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 94.39,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A2BE646_6870_18F0_41B4_F181F0403066"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 18.97,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B1296DE_6870_1990_41B9_91CDCA5ADA76"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -89.32,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79E7F596_6870_1B90_41C8_E9410034E37E"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -133.9,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79F1F581_6870_1870_418A_07B55FBA6719"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 25.25,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A059627_6870_18B0_41B7_FB4FDBFADAC0"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 14.32,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_792BB54D_6870_18F0_4173_45573838E147"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -65.7,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79AA65D4_6870_1B90_41C7_9F36A9977BDB"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C6CB66F_5E65_8A7D_41C9_0C008A0A56F7",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 67.7,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79C70577_6870_1890_41CB_39CAD7886989"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C495A3E_5E62_85DF_4194_212F0B4ECEE7",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -179.5,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A336631_6870_1890_41D7_C01ADEE0F6CC"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 85.92,
                    "backwardYaw": 95.34,
                    "distance": 1,
                    "panorama": "this.panorama_89FAD16C_99AD_658C_41AF_67757420F387"
                }
            ],
            "hfov": 360,
            "label": "PANOROMA 2 copy",
            "audios": [
                "this.audio_4FBB1400_5E67_8DA3_4194_D36B14FF9920"
            ],
            "id": "panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC",
            "thumbnailUrl": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_56BD858F_4E4B_8B56_41A1_184D286BABD1",
                "this.overlay_56BD958F_4E4B_8B56_41D0_4AA01EF9A1E8"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -5.15,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A6F7612_6870_1890_41C4_E863499BC806"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 173.22,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79B515BF_6870_1B90_41C3_7B375A2DFF9C"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 9.67,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_79D7D562_6870_18B0_41C1_CD1CD4BEF8A7"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C52BF20_5E62_9BE3_41C5_05966B0391CB",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -5.15,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A622608_6870_1870_41C2_D6DFD4488115"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": 152.24,
                    "backwardYaw": 114.3,
                    "distance": 1,
                    "panorama": "this.panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 159.27,
                    "backwardYaw": 114.3,
                    "distance": 1,
                    "panorama": "this.panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -161.03,
                    "backwardYaw": -120.09,
                    "distance": 1,
                    "panorama": "this.panorama_89FC974A_997D_ADF4_41DC_B76311B665F9"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -154.5,
                    "backwardYaw": -120.09,
                    "distance": 1,
                    "panorama": "this.panorama_89FC974A_997D_ADF4_41DC_B76311B665F9"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -81.77,
                    "backwardYaw": -173.97,
                    "distance": 1,
                    "panorama": "this.panorama_81363130_938C_8D0F_41C5_8590958EBAB7"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -78.76,
                    "backwardYaw": -173.97,
                    "distance": 1,
                    "panorama": "this.panorama_81363130_938C_8D0F_41C5_8590958EBAB7"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 90.68,
                    "backwardYaw": 174.85,
                    "distance": 1,
                    "panorama": "this.panorama_7B5897B1_6850_0790_41D2_4E953A4A0431"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 89.18,
                    "backwardYaw": 174.85,
                    "distance": 1,
                    "panorama": "this.panorama_7B5897B1_6850_0790_41D2_4E953A4A0431"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 71.6,
                    "backwardYaw": -154.75,
                    "distance": 1,
                    "panorama": "this.panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": 78.13,
                    "backwardYaw": -154.75,
                    "distance": 1,
                    "panorama": "this.panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -24.24,
                    "backwardYaw": 0.5,
                    "distance": 1,
                    "panorama": "this.panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658"
                }
            ],
            "hfov": 360,
            "label": "LIVING ROOM 3",
            "audios": [
                "this.audio_4FEA754B_5E62_8FA5_4189_1CDA06B333D7"
            ],
            "id": "panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2",
            "thumbnailUrl": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_8251482A_93B4_BB13_41DD_5D5C1451522D",
                "this.overlay_82541975_938C_9DF1_41BF_EEB3573784AC",
                "this.overlay_81A1E628_939C_971F_41DC_F0398443CBF8",
                "this.overlay_8030E3EC_939C_8D10_41C7_592DD396D0D3",
                "this.overlay_81760FC4_939D_9517_41D2_3CE8BA5DC5CB",
                "this.overlay_97A8B747_9967_6DFC_41B1_1BEAD75592A8",
                "this.overlay_9719DEDE_9965_5C8C_41DE_D787D1F7211E",
                "this.overlay_97D80B70_997A_A594_41DA_90BCEB3287AB",
                "this.overlay_893ABEB8_997E_DC94_41D6_1645D4C79F89",
                "this.overlay_8AECF955_99AB_659D_41CB_506D69A1B2DC",
                "this.overlay_8AAFCCD8_99A5_5C94_41DD_02E91EFA52BA"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -28.39,
                "pitch": -12.81
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": -94.08,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7AD98651_6870_1890_41D3_D5A5166A22F2"
        },
        {
            "class": "PanoramaPlayer",
            "buttonRestart": "this.IconButton_87F9BA03_9408_2F1A_41E0_0059E437615A",
            "buttonMoveRight": "this.IconButton_87F93A04_9408_2F1E_41B6_0EFE57DC70C6",
            "displayPlaybackBar": true,
            "buttonZoomOut": "this.IconButton_87F84A03_9408_2F1A_41BD_7E1065766258",
            "touchControlMode": "drag_rotation",
            "id": "MainViewerPanoramaPlayer",
            "gyroscopeVerticalDraggingEnabled": true,
            "buttonPlayRight": "this.IconButton_87F92A04_9408_2F1E_41DC_891A23DAAAE5",
            "viewerArea": "this.MainViewer",
            "buttonPlayLeft": "this.IconButton_87F9AA03_9408_2F1A_41D1_1DD38B96D600",
            "buttonZoomIn": "this.IconButton_87F90A04_9408_2F1E_41B5_6A1ECB14D14B",
            "buttonMoveUp": "this.IconButton_87F9EA04_9408_2F1E_41C9_30C352D7C03C",
            "buttonMoveDown": "this.IconButton_87F9CA04_9408_2F1E_41D7_8342D301E6EE",
            "buttonPause": "this.IconButton_87F9DA04_9408_2F1E_41B6_006A643E8BF7",
            "buttonMoveLeft": "this.IconButton_87F99A03_9408_2F1A_41B9_DB045DE6D37D",
            "mouseControlMode": "drag_acceleration"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 87.32,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7AAA66AB_6870_19B0_41D6_C4CE417A1619"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": -154.75,
                    "backwardYaw": 71.6,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -154.5,
                    "backwardYaw": 71.6,
                    "distance": 1,
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "BEDROOM 2",
            "audios": [
                "this.audio_4C6A53DF_5E65_8A5D_41D2_FC39D9521BE6"
            ],
            "id": "panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8",
            "thumbnailUrl": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_89C382CD_997D_648C_41D9_FD5062F4C2E7",
                "this.overlay_89C262CD_997D_648C_41D7_8B9B8EEC3620"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 25.25,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7A18861D_6870_1890_41B8_7C315F08E465"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_camera"
        },
        {
            "class": "PanoramaAudio",
            "loop": true,
            "audio": "this.audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "autoplay": true,
            "id": "audio_4C44EBF0_5E62_9A63_41D5_337F213D245A",
            "data": {
                "label": "a-long-way-166385"
            }
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": -112.3,
                    "backwardYaw": 85.18,
                    "distance": 1,
                    "panorama": "this.panorama_839E559D_93BD_B531_41D9_55F741B8C109"
                },
                {
                    "class": "AdjacentPanorama",
                    "panorama": "this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2"
                }
            ],
            "hfov": 360,
            "label": "BALCONY",
            "audios": [
                "this.audio_4C631946_5E65_87AC_41AF_8D8B7C21A348"
            ],
            "id": "panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D",
            "thumbnailUrl": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/f/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/u/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/r/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/b/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/d/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 6,
                                "tags": "ondemand",
                                "colCount": 6,
                                "width": 3072,
                                "height": 3072
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_0/l/3/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "120%",
            "overlays": [
                "this.overlay_4E80B00C_5E7E_85A3_41BF_3AD2601D9482",
                "this.overlay_4E80A00C_5E7E_85A3_41A5_48AD67603E1C"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_camera"
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 0,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_camera"
        },
        {
            "adjacentPanoramas": [
                {
                    "class": "AdjacentPanorama",
                    "yaw": -165.68,
                    "backwardYaw": -0.76,
                    "distance": 1,
                    "panorama": "this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607"
                },
                {
                    "class": "AdjacentPanorama",
                    "yaw": -165.32,
                    "backwardYaw": -0.76,
                    "distance": 1,
                    "panorama": "this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607"
                }
            ],
            "hfov": 360,
            "label": "2BHK balcony",
            "audios": [
                "this.audio_4C44EBF0_5E62_9A63_41D5_337F213D245A"
            ],
            "id": "panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C",
            "thumbnailUrl": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_t.jpg",
            "pitch": 0,
            "partial": false,
            "hfovMax": 130,
            "class": "Panorama",
            "frames": [
                {
                    "class": "CubicPanoramaFrame",
                    "front": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/f/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/f/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/f/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "top": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/u/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/u/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/u/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "right": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/r/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/r/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/r/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "back": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/b/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/b/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/b/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "bottom": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/d/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/d/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/d/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "left": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/l/0/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 3,
                                "tags": "ondemand",
                                "colCount": 3,
                                "width": 1536,
                                "height": 1536
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/l/1/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 2,
                                "tags": "ondemand",
                                "colCount": 2,
                                "width": 1024,
                                "height": 1024
                            },
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_0/l/2/{row}_{column}.jpg",
                                "class": "TiledImageResourceLevel",
                                "rowCount": 1,
                                "tags": [
                                    "ondemand",
                                    "preload"
                                ],
                                "colCount": 1,
                                "width": 512,
                                "height": 512
                            }
                        ]
                    },
                    "thumbnailUrl": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_t.jpg"
                }
            ],
            "vfov": 180,
            "hfovMin": "150%",
            "overlays": [
                "this.overlay_4F31AA0C_5E7E_85BC_41C9_BD06BC8AF01B",
                "this.overlay_4F31BA0C_5E7E_85BC_41B7_B5E41052A3A9"
            ]
        },
        {
            "class": "PanoramaCamera",
            "automaticZoomSpeed": 10,
            "initialPosition": {
                "class": "PanoramaCameraPosition",
                "yaw": 179.24,
                "pitch": 0
            },
            "initialSequence": {
                "class": "PanoramaCameraSequence",
                "restartMovementOnUserInteraction": false,
                "movements": [
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_in",
                        "yawDelta": 18.5
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "linear",
                        "yawDelta": 323
                    },
                    {
                        "class": "DistancePanoramaCameraMovement",
                        "yawSpeed": 7.96,
                        "easing": "cubic_out",
                        "yawDelta": 18.5
                    }
                ]
            },
            "id": "camera_7B4976C0_6870_19F0_41BD_E5224D94E216"
        },
        {
            "progressBarBorderColor": "#000000",
            "progressBackgroundColorDirection": "vertical",
            "id": "MainViewer",
            "left": 0,
            "playbackBarBottom": 5,
            "paddingLeft": 0,
            "playbackBarHeadOpacity": 1,
            "progressBorderColor": "#000000",
            "progressBarBackgroundColorRatios": [
                0
            ],
            "toolTipBorderColor": "#767676",
            "toolTipShadowSpread": 0,
            "playbackBarProgressBackgroundColorDirection": "vertical",
            "progressBarBackgroundColor": [
                "#3399FF"
            ],
            "progressBackgroundColor": [
                "#FFFFFF"
            ],
            "width": "100%",
            "minHeight": 50,
            "toolTipFontSize": "1.11vmin",
            "toolTipOpacity": 1,
            "toolTipShadowBlurRadius": 3,
            "playbackBarBackgroundColorDirection": "vertical",
            "toolTipTextShadowColor": "#000000",
            "playbackBarBackgroundColor": [
                "#FFFFFF"
            ],
            "playbackBarHeadWidth": 6,
            "playbackBarRight": 0,
            "playbackBarHeight": 10,
            "minWidth": 100,
            "toolTipPaddingBottom": 4,
            "toolTipFontWeight": "normal",
            "playbackBarProgressBorderSize": 0,
            "toolTipTextShadowBlurRadius": 3,
            "playbackBarProgressBorderRadius": 0,
            "progressBarBorderRadius": 0,
            "progressBarBorderSize": 0,
            "playbackBarHeadShadowVerticalLength": 0,
            "playbackBarHeadShadowHorizontalLength": 0,
            "toolTipShadowColor": "#333333",
            "height": "100%",
            "playbackBarBorderRadius": 0,
            "playbackBarHeadBorderRadius": 0,
            "transitionMode": "blending",
            "class": "ViewerArea",
            "playbackBarHeadBorderColor": "#000000",
            "shadow": false,
            "toolTipShadowOpacity": 1,
            "progressLeft": 0,
            "playbackBarProgressBorderColor": "#000000",
            "playbackBarHeadBorderSize": 0,
            "playbackBarProgressOpacity": 1,
            "toolTipFontStyle": "normal",
            "playbackBarBorderSize": 0,
            "toolTipShadowHorizontalLength": 0,
            "propagateClick": false,
            "playbackBarBackgroundOpacity": 1,
            "toolTipFontFamily": "Arial",
            "toolTipShadowVerticalLength": 0,
            "vrPointerSelectionColor": "#FF6600",
            "toolTipTextShadowOpacity": 0,
            "playbackBarHeadBackgroundColor": [
                "#111111",
                "#666666"
            ],
            "playbackBarHeadShadowColor": "#000000",
            "vrPointerSelectionTime": 2000,
            "paddingRight": 0,
            "firstTransitionDuration": 0,
            "progressOpacity": 1,
            "progressRight": 0,
            "borderSize": 0,
            "progressBarBackgroundColorDirection": "vertical",
            "playbackBarHeadShadow": true,
            "progressBottom": 0,
            "toolTipBackgroundColor": "#000000",
            "toolTipFontColor": "#606060",
            "progressHeight": 10,
            "playbackBarHeadBackgroundColorDirection": "vertical",
            "progressBackgroundOpacity": 1,
            "top": 0,
            "playbackBarOpacity": 1,
            "displayTooltipInTouchScreens": true,
            "playbackBarProgressBackgroundColor": [
                "#3399FF"
            ],
            "vrPointerColor": "#FFFFFF",
            "progressBarOpacity": 1,
            "playbackBarHeadShadowOpacity": 0.7,
            "playbackBarBorderColor": "#FFFFFF",
            "progressBorderSize": 0,
            "toolTipBorderSize": 1,
            "toolTipPaddingTop": 4,
            "toolTipPaddingLeft": 6,
            "progressBorderRadius": 0,
            "paddingTop": 0,
            "toolTipDisplayTime": 600,
            "playbackBarProgressBackgroundColorRatios": [
                0
            ],
            "playbackBarLeft": 0,
            "paddingBottom": 0,
            "toolTipPaddingRight": 6,
            "toolTipBorderRadius": 3,
            "borderRadius": 0,
            "playbackBarHeadShadowBlurRadius": 3,
            "progressBackgroundColorRatios": [
                0
            ],
            "playbackBarHeadHeight": 15,
            "playbackBarHeadBackgroundColorRatios": [
                0,
                1
            ],
            "transitionDuration": 500,
            "data": {
                "name": "Main Viewer"
            }
        },
        {
            "propagateClick": false,
            "layout": "horizontal",
            "scrollBarWidth": 10,
            "id": "Container_87F97A04_9408_2F1E_41D6_87A896476428",
            "left": "36.25%",
            "paddingLeft": 0,
            "scrollBarColor": "#000000",
            "paddingRight": 0,
            "children": [
                "this.IconButton_87F84A03_9408_2F1A_41BD_7E1065766258",
                "this.IconButton_87F9BA03_9408_2F1A_41E0_0059E437615A",
                "this.IconButton_87F9AA03_9408_2F1A_41D1_1DD38B96D600",
                "this.IconButton_87F99A03_9408_2F1A_41B9_DB045DE6D37D",
                "this.Container_87F98A03_9408_2F1A_41D4_2A8FEF5F6109",
                "this.IconButton_87F93A04_9408_2F1E_41B6_0EFE57DC70C6",
                "this.IconButton_87F92A04_9408_2F1E_41DC_891A23DAAAE5",
                "this.IconButton_87F91A04_9408_2F1E_41CB_C716BE82C7BB",
                "this.IconButton_87F90A04_9408_2F1E_41B5_6A1ECB14D14B"
            ],
            "borderSize": 0,
            "scrollBarVisible": "rollOver",
            "minHeight": 20,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "scrollBarOpacity": 0.5,
            "bottom": "1.86%",
            "contentOpaque": false,
            "minWidth": 20,
            "scrollBarMargin": 2,
            "height": 137,
            "gap": 4,
            "paddingTop": 0,
            "shadow": false,
            "paddingBottom": 0,
            "backgroundOpacity": 0,
            "borderRadius": 0,
            "class": "Container",
            "data": {
                "name": "Container27661"
            },
            "overflow": "hidden"
        },
        {
            "propagateClick": false,
            "layout": "absolute",
            "scrollBarWidth": 10,
            "id": "Container_87149426_9438_3B1D_41B8_2C4BE7ED32A0",
            "left": "0%",
            "paddingLeft": 0,
            "scrollBarColor": "#000000",
            "paddingRight": 0,
            "borderSize": 0,
            "scrollBarVisible": "rollOver",
            "minHeight": 1,
            "horizontalAlign": "left",
            "backgroundImageUrl": "skin/Container_87149426_9438_3B1D_41B8_2C4BE7ED32A0.jpg",
            "verticalAlign": "top",
            "scrollBarOpacity": 0.5,
            "scrollBarMargin": 2,
            "contentOpaque": false,
            "minWidth": 1,
            "height": "100%",
            "width": "100%",
            "top": "0%",
            "gap": 10,
            "paddingTop": 0,
            "shadow": false,
            "paddingBottom": 0,
            "backgroundOpacity": 1,
            "borderRadius": 0,
            "class": "Container",
            "data": {
                "name": "Container12419"
            },
            "overflow": "scroll"
        },
        {
            "textDecoration": "none",
            "fontFamily": "Montserrat",
            "layout": "horizontal",
            "backgroundColorRatios": [
                0
            ],
            "shadowVerticalLength": 0,
            "id": "Button_80F16AFC_9438_2CED_41D5_5BB3DA4580B6",
            "shadowHorizontalLength": 0,
            "pressedBackgroundColor": [
                "#000066"
            ],
            "iconBeforeLabel": true,
            "paddingLeft": 0,
            "data": {
                "name": "Button house info"
            },
            "paddingRight": 0,
            "right": "0.06%",
            "fontColor": "#FFFFFF",
            "width": 155.03,
            "shadowColor": "#000000",
            "borderSize": 1,
            "iconHeight": 0,
            "minHeight": 1,
            "backgroundColorDirection": "vertical",
            "rollOverBackgroundColorRatios": [
                1
            ],
            "borderColor": "#FFFFFF",
            "pressedRollOverShadowVerticalLength": 0,
            "verticalAlign": "middle",
            "bottom": "13.87%",
            "pressedBackgroundColorRatios": [
                0
            ],
            "height": 54.05,
            "mode": "toggle",
            "minWidth": 1,
            "fontSize": "20px",
            "label": "2 BHK",
            "horizontalAlign": "center",
            "backgroundColor": [
                "#000000"
            ],
            "shadowBlurRadius": 15,
            "pressedRollOverShadowHorizontalLength": 0,
            "gap": 5,
            "rollOverBackgroundOpacity": 1,
            "paddingTop": 0,
            "pressedRollOverFontSize": "20px",
            "fontStyle": "normal",
            "buttonGroup": "bUTTONS",
            "backgroundOpacity": 0.63,
            "shadowOpacity": 0,
            "rollOverBackgroundColor": [
                "#0066FF"
            ],
            "click": "this.mainPlayList.set('selectedIndex', 0); this.setComponentVisibility(this.Container_87149426_9438_3B1D_41B8_2C4BE7ED32A0, false, 0, null, null, false)",
            "shadow": true,
            "rollOverShadow": false,
            "paddingBottom": 0,
            "class": "Button",
            "shadowSpread": 1,
            "borderRadius": 0,
            "fontWeight": "bold",
            "iconWidth": 0,
            "cursor": "hand",
            "pressedBackgroundOpacity": 1,
            "propagateClick": true
        },
        {
            "textDecoration": "none",
            "fontFamily": "Montserrat",
            "layout": "horizontal",
            "backgroundColorRatios": [
                0
            ],
            "shadowVerticalLength": 0,
            "id": "Button_87AB1AC0_9438_EF16_41CB_8896ED4E9C15",
            "shadowHorizontalLength": 0,
            "pressedBackgroundColor": [
                "#000066"
            ],
            "iconBeforeLabel": true,
            "paddingLeft": 0,
            "data": {
                "name": "Button house info"
            },
            "paddingRight": 0,
            "right": "0%",
            "fontColor": "#FFFFFF",
            "width": 155,
            "shadowColor": "#000000",
            "borderSize": 1,
            "iconHeight": 0,
            "minHeight": 1,
            "backgroundColorDirection": "vertical",
            "rollOverBackgroundColorRatios": [
                1
            ],
            "borderColor": "#FFFFFF",
            "pressedRollOverShadowVerticalLength": 0,
            "verticalAlign": "middle",
            "bottom": "6.34%",
            "pressedBackgroundColorRatios": [
                0
            ],
            "height": 54,
            "mode": "toggle",
            "minWidth": 1,
            "fontSize": "20px",
            "label": "3 BHK",
            "horizontalAlign": "center",
            "backgroundColor": [
                "#000000"
            ],
            "shadowBlurRadius": 15,
            "pressedRollOverShadowHorizontalLength": 0,
            "gap": 5,
            "rollOverBackgroundOpacity": 1,
            "paddingTop": 0,
            "pressedRollOverFontSize": "20px",
            "fontStyle": "normal",
            "buttonGroup": "bUTTONS",
            "backgroundOpacity": 0.63,
            "shadowOpacity": 0,
            "rollOverBackgroundColor": [
                "#0066FF"
            ],
            "click": "this.mainPlayList.set('selectedIndex', 5); this.setComponentVisibility(this.Container_87149426_9438_3B1D_41B8_2C4BE7ED32A0, false, 0, null, null, false)",
            "shadow": true,
            "rollOverShadow": false,
            "paddingBottom": 0,
            "class": "Button",
            "shadowSpread": 1,
            "borderRadius": 0,
            "fontWeight": "bold",
            "iconWidth": 0,
            "cursor": "hand",
            "pressedBackgroundOpacity": 1,
            "propagateClick": true
        },
        {
            "textDecoration": "none",
            "fontFamily": "Montserrat",
            "layout": "horizontal",
            "backgroundColorRatios": [
                0
            ],
            "shadowVerticalLength": 0,
            "id": "Button_80F16AFC_9438_2CED_41D5_5BB3DA4580B7",
            "shadowHorizontalLength": 0,
            "pressedBackgroundColor": [
                "#000066"
            ],
            "iconBeforeLabel": true,
            "paddingLeft": 0,
            "data": {
                "name": "Button house info"
            },
            //  "paddingRight": 0,
            //  "right": "0%",
            "fontColor": "#FFFFFF",
            "width": 155,
            "shadowColor": "#000000",
            "borderSize": 1,
            "iconHeight": 0,
            "minHeight": 1,
            "backgroundColorDirection": "vertical",
            "rollOverBackgroundColorRatios": [
                1
            ],
            "borderColor": "#FFFFFF",
            "pressedRollOverShadowVerticalLength": 0,
            "verticalAlign": "middle",
            "bottom": "6.34%",
            "pressedBackgroundColorRatios": [
                0
            ],
            "height": 54,
            "mode": "toggle",
            "minWidth": 1,
            "fontSize": "20px",
            "label": "Home",
            "horizontalAlign": "center",
            "backgroundColor": [
                "#000000"
            ],
            "shadowBlurRadius": 15,
            "pressedRollOverShadowHorizontalLength": 0,
            "gap": 5,
            "rollOverBackgroundOpacity": 1,
            "paddingTop": 0,
            "pressedRollOverFontSize": "20px",
            "fontStyle": "normal",
            "buttonGroup": "bUTTONS",
            "backgroundOpacity": 0.63,
            "shadowOpacity": 0,
            "rollOverBackgroundColor": [
                "#0066FF"
            ],
            "click": "this.redirecttoHome()",
            "shadow": true,
            "rollOverShadow": false,
            "paddingBottom": 0,
            "class": "Button",
            "shadowSpread": 1,
            "borderRadius": 0,
            "fontWeight": "bold",
            "iconWidth": 0,
            "cursor": "hand",
            "pressedBackgroundOpacity": 1,
            "propagateClick": true
        },
        {
            "propagateClick": false,
            "layout": "absolute",
            "scrollBarWidth": 10,
            "id": "Container_8E9E2752_98C5_670E_41E2_2BD90F263340",
            "paddingLeft": 0,
            "scrollBarColor": "#000000",
            "paddingRight": 0,
            "right": "0%",
            "borderSize": 0,
            "scrollBarVisible": "rollOver",
            "minHeight": 1,
            "horizontalAlign": "left",
            "backgroundImageUrl": "skin/Container_8E9E2752_98C5_670E_41E2_2BD90F263340.png",
            "verticalAlign": "top",
            "scrollBarOpacity": 0.5,
            "scrollBarMargin": 2,
            "contentOpaque": false,
            "minWidth": 1,
            "height": "28.087%",
            "width": "14.837%",
            "top": "0%",
            "gap": 10,
            "paddingTop": 0,
            "shadow": false,
            "paddingBottom": 0,
            "backgroundOpacity": 1,
            "borderRadius": 0,
            "class": "Container",
            "data": {
                "name": "Container11304"
            },
            "overflow": "scroll"
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F91A04_9408_2F1E_41CB_C716BE82C7BB",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 40,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F91A04_9408_2F1E_41CB_C716BE82C7BB.png",
            "minWidth": 0,
            "mode": "toggle",
            "height": 40,
            "rollOverIconURL": "skin/IconButton_87F91A04_9408_2F1E_41CB_C716BE82C7BB_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F91A04_9408_2F1E_41CB_C716BE82C7BB_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27672"
            }
        },
        {
            "class": "AudioResource",
            "mp3Url": "media/audio_4FEA754B_5E62_8FA5_4189_1CDA06B333D7.mp3",
            "id": "audioresource_4FCB1563_5E66_8E64_41C6_91A8F037ECCC",
            "oggUrl": "media/audio_4FEA754B_5E62_8FA5_4189_1CDA06B333D7.ogg"
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FAD16C_99AD_658C_41AF_67757420F387, this.camera_7A2BE646_6870_18F0_41B4_F181F0403066); this.mainPlayList.set('selectedIndex', 1)"
                }
            ],
            "data": {
                "label": "Circle Arrow 02a"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.23,
                    "image": "this.AnimatedImageResource_81B669BB_93B4_7D71_41D3_1810EE044A15",
                    "pitch": -38,
                    "yaw": 27.01,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_83781644_938D_B717_41BD_1B61DFDC7EF7",
            "maps": [
                {
                    "hfov": 16.23,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 27.01,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 28,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -38
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.44,
                    "image": "this.AnimatedImageResource_4D0B3062_5E7D_8667_41BF_5436425C451D",
                    "pitch": -16.14,
                    "yaw": 174.85,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_4FC79079_5E62_8665_41D1_C8AA9C8BB299",
            "maps": [
                {
                    "hfov": 8.44,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 174.85,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -16.14
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.5,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_1_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 383,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -11.36,
                    "yaw": 172.83,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_4FC7F079_5E62_8665_41D3_48C85CAEA8D5",
            "maps": [
                {
                    "hfov": 16.5,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 172.83,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_1_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 51,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -11.36
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FAD16C_99AD_658C_41AF_67757420F387, this.camera_7B2C2708_6870_1870_41A2_8DFDB82671FF); this.mainPlayList.set('selectedIndex', 1)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 14.27,
                    "image": "this.AnimatedImageResource_891C9328_999F_A5B4_41D8_03DDF3C624AF",
                    "pitch": 6.2,
                    "yaw": -92.68,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_88810F6D_999E_FD8C_41D7_F1A319B655B8",
            "maps": [
                {
                    "hfov": 14.27,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -92.68,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 6.2
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 0)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 23.49,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_1_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 548,
                                "height": 137
                            }
                        ]
                    },
                    "pitch": 13.13,
                    "yaw": -88.3,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_88811F6D_999E_FD8C_41DD_F08AA16F8614",
            "maps": [
                {
                    "hfov": 23.49,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -88.3,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_1_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 64,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 13.13
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_7B5B06B5_6870_1990_41C9_589688F1AE03); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "Arrow 06c"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 17.83,
                    "image": "this.AnimatedImageResource_84F67CF7_9394_F4F1_41CA_F6B56514B737",
                    "pitch": -36.24,
                    "yaw": -173.97,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_80F98EDA_938D_9730_41E0_92792FBDB4C5",
            "maps": [
                {
                    "hfov": 17.83,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -173.97,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 32,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -36.24
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_79FD158B_6870_1870_41BF_598F8FAC46D8); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 7.42,
                    "image": "this.AnimatedImageResource_795243D5_6850_1F91_41D3_F3181F37D094",
                    "pitch": -32.47,
                    "yaw": 174.85,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_7B58A7B1_6850_0790_41AD_2376ED443080",
            "maps": [
                {
                    "hfov": 7.42,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 174.85,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -32.47
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_79E7F596_6870_1B90_41C8_E9410034E37E); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 14.94,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 383,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -27.45,
                    "yaw": 172.33,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_7B58F7B1_6850_0790_41D2_FEB0B18CF699",
            "maps": [
                {
                    "hfov": 14.94,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 172.33,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 51,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -27.45
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_7B3EA6FE_6870_1990_41C8_01E243CEF6FF); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "Arrow 06c"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 9.72,
                    "image": "this.AnimatedImageResource_8344A83C_93B5_9B77_41D1_19426C8EF7DC",
                    "pitch": -25.81,
                    "yaw": 0.5,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8379ED9F_93B3_9531_41C0_9E77007ABE70",
            "maps": [
                {
                    "hfov": 9.72,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 0.5,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 32,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -25.81
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839E559D_93BD_B531_41D9_55F741B8C109, this.camera_7B31B6F3_6870_1990_41C7_CC42610FF7C7); this.mainPlayList.set('selectedIndex', 6)"
                }
            ],
            "data": {
                "label": "Arrow 06c Right-Up"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 17.45,
                    "image": "this.AnimatedImageResource_8780333B_93B3_8D71_41D8_695CE19CFC87",
                    "pitch": -27.07,
                    "yaw": 46.1,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_824C3076_93B4_8BF0_41D4_9EE2FFF3697D",
            "maps": [
                {
                    "hfov": 17.45,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 46.1,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0_HS_1_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 41,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -27.07
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 12)"
                }
            ],
            "data": {
                "label": "Circle Door 01"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 9.78,
                    "image": "this.AnimatedImageResource_7D028F9F_6850_0790_41CC_B0853F5CFB29",
                    "pitch": -2.69,
                    "yaw": 75.36,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_7AADEC20_6850_08B0_41C2_8E0F76190C16",
            "maps": [
                {
                    "hfov": 9.78,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 75.36,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0_HS_3_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -2.69
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 12)"
                }
            ],
            "data": {
                "label": "BALCONY"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 13.56,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0_HS_4_0.png",
                                "class": "ImageResourceLevel",
                                "width": 308,
                                "height": 137
                            }
                        ]
                    },
                    "pitch": 0.82,
                    "yaw": 76.75,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_7A353653_6850_1891_41B7_DF698BF990E0",
            "maps": [
                {
                    "hfov": 13.56,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 76.75,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0_HS_4_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 35,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 0.82
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FAD16C_99AD_658C_41AF_67757420F387, this.camera_79D7D562_6870_18B0_41C1_CD1CD4BEF8A7); this.mainPlayList.set('selectedIndex', 1)"
                }
            ],
            "data": {
                "label": "Arrow 08b"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 11.41,
                    "image": "this.AnimatedImageResource_4D1EC052_5E7D_85A7_41D7_107485704EFE",
                    "pitch": -20.41,
                    "yaw": -87.24,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_4EC54047_5E66_85AD_41A8_F25352E73131",
            "maps": [
                {
                    "hfov": 11.41,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -87.24,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 34,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -20.41
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C, this.camera_792BB54D_6870_18F0_4173_45573838E147); this.mainPlayList.set('selectedIndex', 16)"
                }
            ],
            "data": {
                "label": "Circle Door 01"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 9.79,
                    "image": "this.AnimatedImageResource_4D003057_5E7D_85AC_41CD_184CA7477F7D",
                    "pitch": -1.43,
                    "yaw": -0.76,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_4EC57048_5E66_85A3_41D1_7B28A6D2F4C3",
            "maps": [
                {
                    "hfov": 9.79,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -0.76,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_1_HS_3_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -1.43
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C, this.camera_79D06558_6870_1890_41D1_C3466500B656); this.mainPlayList.set('selectedIndex', 16)"
                }
            ],
            "data": {
                "label": "BALCONY"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 13.54,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_1_HS_4_0.png",
                                "class": "ImageResourceLevel",
                                "width": 154,
                                "height": 68
                            }
                        ]
                    },
                    "pitch": 3.33,
                    "yaw": 0.88,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_4EC50048_5E66_85A3_41C8_B0A0067DFCD5",
            "maps": [
                {
                    "hfov": 13.54,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 0.88,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_1_HS_4_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 36,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 3.33
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_7B6766D4_6870_1990_41D7_A669E1661707); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.79,
                    "image": "this.AnimatedImageResource_8AD44ACB_997D_64F4_4188_8B5F90727E9A",
                    "pitch": 1.7,
                    "yaw": -120.09,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_89FCB74A_997D_ADF4_41DD_EDA8E655C2BB",
            "maps": [
                {
                    "hfov": 8.79,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -120.09,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 1.7
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_7B1296DE_6870_1990_41B9_91CDCA5ADA76); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.7,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_1_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 383,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": 7.22,
                    "yaw": -119.09,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_89FCC74A_997D_ADF4_41B3_72DAB4729A6E",
            "maps": [
                {
                    "hfov": 16.7,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -119.09,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_1_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 51,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 7.22
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FAD16C_99AD_658C_41AF_67757420F387, this.camera_7989D5B4_6870_1B90_41C6_DB7F1841724F); this.mainPlayList.set('selectedIndex', 1)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.57,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_1_HS_0_0.png",
                                "class": "ImageResourceLevel",
                                "width": 383,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -10.11,
                    "yaw": -85.93,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_4EAB0746_5E67_8BAC_41A8_CC4D9F52F945",
            "maps": [
                {
                    "hfov": 16.57,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -85.93,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_1_HS_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 51,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -10.11
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FAD16C_99AD_658C_41AF_67757420F387, this.camera_79B515BF_6870_1B90_41C3_7B375A2DFF9C); this.mainPlayList.set('selectedIndex', 1)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.5,
                    "image": "this.AnimatedImageResource_4D0A9062_5E7D_8667_41C7_B7D5DBE08A10",
                    "pitch": -14.63,
                    "yaw": -85.42,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_4EAB3746_5E67_8BAC_41C5_A742D1BD00CD",
            "maps": [
                {
                    "hfov": 8.5,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -85.42,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_1_HS_1_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -14.63
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658, this.camera_79F1F581_6870_1870_418A_07B55FBA6719); this.mainPlayList.set('selectedIndex', 5)"
                }
            ],
            "data": {
                "label": "Arrow 06b Left-Up"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 12.11,
                    "image": "this.AnimatedImageResource_80CAFFA7_938C_7511_41C2_DC5C649CA753",
                    "pitch": -30.08,
                    "yaw": -74.77,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_8011EDD6_938D_9533_41B1_117DABFE04D8",
            "maps": [
                {
                    "hfov": 12.11,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -74.77,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 29,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -30.08
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D, this.camera_79DF456D_6870_18B0_41D0_F36A7D121D5C); this.mainPlayList.set('selectedIndex', 12)"
                }
            ],
            "data": {
                "label": "Circle Point 01c"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 13.03,
                    "image": "this.AnimatedImageResource_8FC66921_99BD_A5B4_41DF_3B1B751F5FB9",
                    "pitch": -28.7,
                    "yaw": 85.18,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8804F71D_99BB_AD8C_41C7_4660E29AAF51",
            "maps": [
                {
                    "hfov": 13.03,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 85.18,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0_HS_1_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 57,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -28.7
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D, this.camera_79C70577_6870_1890_41CB_39CAD7886989); this.mainPlayList.set('selectedIndex', 12)"
                }
            ],
            "data": {
                "label": "  BALCONY"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 12.48,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0_HS_2_0.png",
                                "class": "ImageResourceLevel",
                                "width": 285,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -6.34,
                    "yaw": 86.52,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_8BC4E5D6_99A5_6C9C_41E2_42A986FE8611",
            "maps": [
                {
                    "hfov": 12.48,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 86.52,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0_HS_2_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 38,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -6.34
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 14)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.7,
                    "image": "this.AnimatedImageResource_85000639_99EE_AF94_4191_F2EBE5D26C27",
                    "pitch": -8.1,
                    "yaw": 77.12,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8B58E0A7_997E_A4BC_4179_CCCCA0058A5A",
            "maps": [
                {
                    "hfov": 8.7,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 77.12,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -8.1
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 14)"
                }
            ],
            "data": {
                "label": "  BATHROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 14.8,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 337,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -3.08,
                    "yaw": 76.61,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_8B5890A7_997E_A4BC_41B3_864D0B0C7751",
            "maps": [
                {
                    "hfov": 14.8,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 76.61,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 44,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -3.08
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_793E8539_6870_1890_4198_252775E18566); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.74,
                    "image": "this.AnimatedImageResource_8507463A_99EE_AF97_41BE_3069ED064623",
                    "pitch": -6.09,
                    "yaw": 114.3,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8ACEEDD6_99AD_BC9C_41CF_7797104B4CF1",
            "maps": [
                {
                    "hfov": 8.74,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 114.3,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_2_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -6.09
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_79276543_6870_18F0_41B8_17E9471CF458); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.83,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_3_0.png",
                                "class": "ImageResourceLevel",
                                "width": 383,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -0.06,
                    "yaw": 115.05,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_8AE6989B_99AA_E494_41BD_0237E30F326C",
            "maps": [
                {
                    "hfov": 16.83,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 115.05,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_3_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 51,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -0.06
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC, this.camera_7AD98651_6870_1890_41D3_D5A5166A22F2); this.mainPlayList.set('selectedIndex', 3)"
                }
            ],
            "data": {
                "label": "Circle Door 01"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 17.01,
                    "image": "this.AnimatedImageResource_8A05346D_99AD_A38C_41AB_7598FA445A0E",
                    "pitch": -23.8,
                    "yaw": 95.34,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_89FAA16D_99AD_658C_41BE_8A24A6CD1757",
            "maps": [
                {
                    "hfov": 17.01,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 95.34,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_1_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -23.8
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144, this.camera_7ABCD6A0_6870_19B0_41D9_B2FEC14EB0F5); this.mainPlayList.set('selectedIndex', 2)"
                }
            ],
            "data": {
                "label": "Circle Door 01"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 11.95,
                    "image": "this.AnimatedImageResource_8A04946D_99AD_A38C_41DB_F442F6A6A59C",
                    "pitch": -7.72,
                    "yaw": 15.95,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_89FAB16D_99AD_658C_41C4_12528C621437",
            "maps": [
                {
                    "hfov": 11.95,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 15.95,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_2_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -7.72
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C, this.camera_7AF43665_6870_18B0_41C2_03E97084D5EC); this.mainPlayList.set('selectedIndex', 4)"
                }
            ],
            "data": {
                "label": "Arrow 08b"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 13.11,
                    "image": "this.AnimatedImageResource_8A04C46D_99AD_A38C_41C3_948AF33CBC94",
                    "pitch": -37.12,
                    "yaw": -85.61,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_89FA816D_99AD_658C_41D5_1EC7CF2E3B56",
            "maps": [
                {
                    "hfov": 13.11,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -85.61,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_3_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 34,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -37.12
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607, this.camera_7A90867A_6870_1890_41C7_CCF8BD32FEA4); this.mainPlayList.set('selectedIndex', 0)"
                }
            ],
            "data": {
                "label": "Arrow 06a"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 14.72,
                    "image": "this.AnimatedImageResource_8A04346D_99AD_A38C_41D5_2CD28D27A338",
                    "pitch": -31.88,
                    "yaw": -170.33,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_89FB016D_99AD_658C_41C4_04A0C6D8650D",
            "maps": [
                {
                    "hfov": 14.72,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -170.33,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_4_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 27,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -31.88
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C, this.camera_7AE3A66F_6870_18B0_41BE_7168D1757873); this.mainPlayList.set('selectedIndex', 4)"
                }
            ],
            "data": {
                "label": "KITCHEN"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 18.53,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_5_0.png",
                                "class": "ImageResourceLevel",
                                "width": 423,
                                "height": 125
                            }
                        ]
                    },
                    "pitch": -4.71,
                    "yaw": -78.76,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_89FB116D_99AD_658C_41DC_3EA0516E7B2B",
            "maps": [
                {
                    "hfov": 18.53,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -78.76,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_5_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 54,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -4.71
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC, this.camera_7AC7365B_6870_1890_41C9_4769CA0F0DA6); this.mainPlayList.set('selectedIndex', 3)"
                }
            ],
            "data": {
                "label": "  BEDROOM 1"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 25.99,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_6_0.png",
                                "class": "ImageResourceLevel",
                                "width": 611,
                                "height": 137
                            }
                        ]
                    },
                    "pitch": -14.76,
                    "yaw": 102,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_89FBE16D_99AD_658C_41DC_D4B178331943",
            "maps": [
                {
                    "hfov": 25.99,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 102,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_6_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 71,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -14.76
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144, this.camera_7AAA66AB_6870_19B0_41D6_C4CE417A1619); this.mainPlayList.set('selectedIndex', 2)"
                }
            ],
            "data": {
                "label": "  BEDROOM 2"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 19.84,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_7_0.png",
                                "class": "ImageResourceLevel",
                                "width": 451,
                                "height": 108
                            }
                        ]
                    },
                    "pitch": -1.07,
                    "yaw": 20.1,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_89FBF16D_99AD_658C_41D5_47731503B0DD",
            "maps": [
                {
                    "hfov": 19.84,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 20.1,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_7_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 66,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -1.07
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097, this.camera_7A806687_6870_1870_41D1_B99F7FDD38D0); this.mainPlayList.set('selectedIndex', 13)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.76,
                    "image": "this.AnimatedImageResource_850E0637_99EE_AF9D_41DB_26A7EB496242",
                    "pitch": -4.83,
                    "yaw": -6.78,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8AAF6201_99A6_A774_41E2_6DB751C434ED",
            "maps": [
                {
                    "hfov": 8.76,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -6.78,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0_HS_8_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -4.83
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097, this.camera_7A8FD695_6870_1990_41B0_449C6E892BEB); this.mainPlayList.set('selectedIndex', 13)"
                }
            ],
            "data": {
                "label": "  BATHROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 14.82,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0_HS_9_0.png",
                                "class": "ImageResourceLevel",
                                "width": 337,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": 0.2,
                    "yaw": -7.05,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_8A814F2F_99A7_BD8C_41D7_7A2DB1DE5F46",
            "maps": [
                {
                    "hfov": 14.82,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -7.05,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0_HS_9_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 44,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 0.2
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FAD16C_99AD_658C_41AF_67757420F387, this.camera_7A3CE63C_6870_1890_41CE_3298DE2B0B8B); this.mainPlayList.set('selectedIndex', 1)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 14.78,
                    "image": "this.AnimatedImageResource_52A4207E_4E49_89B7_41BF_3D1F5EDF8396",
                    "pitch": 4.08,
                    "yaw": 85.92,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_56BD858F_4E4B_8B56_41A1_184D286BABD1",
            "maps": [
                {
                    "hfov": 14.78,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 85.92,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 4.08
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 0)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.6,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_1_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 191,
                                "height": 60
                            }
                        ]
                    },
                    "pitch": 9.48,
                    "yaw": 85.42,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_56BD958F_4E4B_8B56_41D0_4AA01EF9A1E8",
            "maps": [
                {
                    "hfov": 16.6,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 85.42,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_1_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 50,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 9.48
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658, this.camera_7A336631_6870_1890_41D7_C01ADEE0F6CC); this.mainPlayList.set('selectedIndex', 5)"
                }
            ],
            "data": {
                "label": "Arrow 06c"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 12.98,
                    "image": "this.AnimatedImageResource_84F6ACF6_9394_F4F3_41B2_DB2A9935B963",
                    "pitch": -30.59,
                    "yaw": -24.24,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8251482A_93B4_BB13_41DD_5D5C1451522D",
            "maps": [
                {
                    "hfov": 12.98,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -24.24,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 32,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -30.59
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_81363130_938C_8D0F_41C5_8590958EBAB7, this.camera_7A4AC5F3_6870_1B90_41D4_904620317576); this.mainPlayList.set('selectedIndex', 8)"
                }
            ],
            "data": {
                "label": "Arrow 06c"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 13.11,
                    "image": "this.AnimatedImageResource_84F6CCF6_9394_F4F3_41DB_31D114D41723",
                    "pitch": -29.58,
                    "yaw": -81.77,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_82541975_938C_9DF1_41BF_EEB3573784AC",
            "maps": [
                {
                    "hfov": 13.11,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -81.77,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_1_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 32,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -29.58
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B, this.camera_79BE65C9_6870_1BF0_41CB_A449DE2BD76A); this.mainPlayList.set('selectedIndex', 9)"
                }
            ],
            "data": {
                "label": "Circle Door 01"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.72,
                    "image": "this.AnimatedImageResource_84AE52B1_939C_8F71_41DC_69C00FA9D6FB",
                    "pitch": -7.1,
                    "yaw": 152.24,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_81A1E628_939C_971F_41DC_F0398443CBF8",
            "maps": [
                {
                    "hfov": 8.72,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 152.24,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_2_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -7.1
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FC974A_997D_ADF4_41DC_B76311B665F9, this.camera_7A5405DE_6870_1B90_41CE_72190BE2FBB3); this.mainPlayList.set('selectedIndex', 11)"
                }
            ],
            "data": {
                "label": "Circle Door 01"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.74,
                    "image": "this.AnimatedImageResource_84ADB2B1_939C_8F71_41D1_7F5317E0F438",
                    "pitch": -6.09,
                    "yaw": -161.03,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8030E3EC_939C_8D10_41C7_592DD396D0D3",
            "maps": [
                {
                    "hfov": 8.74,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -161.03,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_3_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -6.09
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8, this.camera_7A18861D_6870_1890_41B8_7C315F08E465); this.mainPlayList.set('selectedIndex', 10)"
                }
            ],
            "data": {
                "label": "Circle Door 01"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.72,
                    "image": "this.AnimatedImageResource_84AD12B1_939C_8F71_41C6_CCCB6813B067",
                    "pitch": -7.1,
                    "yaw": 71.6,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_81760FC4_939D_9517_41D2_3CE8BA5DC5CB",
            "maps": [
                {
                    "hfov": 8.72,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 71.6,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_4_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -7.1
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B, this.camera_79AA65D4_6870_1B90_41C7_9F36A9977BDB); this.mainPlayList.set('selectedIndex', 9)"
                }
            ],
            "data": {
                "label": "  BEDROOM 3"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 26.85,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_5_0.png",
                                "class": "ImageResourceLevel",
                                "width": 611,
                                "height": 137
                            }
                        ]
                    },
                    "pitch": -2.95,
                    "yaw": 159.27,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_97A8B747_9967_6DFC_41B1_1BEAD75592A8",
            "maps": [
                {
                    "hfov": 26.85,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 159.27,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_5_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 71,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -2.95
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8, this.camera_7A059627_6870_18B0_41B7_FB4FDBFADAC0); this.mainPlayList.set('selectedIndex', 10)"
                }
            ],
            "data": {
                "label": "  BEDROOM 1"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 26.85,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_6_0.png",
                                "class": "ImageResourceLevel",
                                "width": 611,
                                "height": 137
                            }
                        ]
                    },
                    "pitch": -2.7,
                    "yaw": 78.13,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_9719DEDE_9965_5C8C_41DE_D787D1F7211E",
            "maps": [
                {
                    "hfov": 26.85,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 78.13,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_6_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 71,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -2.7
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_89FC974A_997D_ADF4_41DC_B76311B665F9, this.camera_7A4025E9_6870_1BB0_41BB_A8CDAC0CED33); this.mainPlayList.set('selectedIndex', 11)"
                }
            ],
            "data": {
                "label": "  BEDROOM 2"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 26.88,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_7_0.png",
                                "class": "ImageResourceLevel",
                                "width": 611,
                                "height": 137
                            }
                        ]
                    },
                    "pitch": -0.94,
                    "yaw": -154.5,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_97D80B70_997A_A594_41DA_90BCEB3287AB",
            "maps": [
                {
                    "hfov": 26.88,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -154.5,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_7_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 71,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -0.94
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_81363130_938C_8D0F_41C5_8590958EBAB7, this.camera_7A7605FE_6870_1B90_41CE_E1FB51DFE7E4); this.mainPlayList.set('selectedIndex', 8)"
                }
            ],
            "data": {
                "label": "KITCHEN"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 18.53,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_8_0.png",
                                "class": "ImageResourceLevel",
                                "width": 423,
                                "height": 125
                            }
                        ]
                    },
                    "pitch": -4.71,
                    "yaw": -78.76,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_893ABEB8_997E_DC94_41D6_1645D4C79F89",
            "maps": [
                {
                    "hfov": 18.53,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -78.76,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_8_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 54,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -4.71
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_7B5897B1_6850_0790_41D2_4E953A4A0431, this.camera_7A622608_6870_1870_41C2_D6DFD4488115); this.mainPlayList.set('selectedIndex', 15)"
                }
            ],
            "data": {
                "label": "  BATHROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 14.81,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_9_0.png",
                                "class": "ImageResourceLevel",
                                "width": 337,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -2.56,
                    "yaw": 90.68,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_8AECF955_99AB_659D_41CB_506D69A1B2DC",
            "maps": [
                {
                    "hfov": 14.81,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 90.68,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_9_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 44,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -2.56
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_7B5897B1_6850_0790_41D2_4E953A4A0431, this.camera_7A6F7612_6870_1890_41C4_E863499BC806); this.mainPlayList.set('selectedIndex', 15)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.72,
                    "image": "this.AnimatedImageResource_8501E639_99EE_AF94_41D9_BE4F7397D255",
                    "pitch": -7.35,
                    "yaw": 89.18,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_8AAFCCD8_99A5_5C94_41DD_02E91EFA52BA",
            "maps": [
                {
                    "hfov": 8.72,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": 89.18,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_10_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -7.35
                }
            ]
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F9BA03_9408_2F1A_41E0_0059E437615A",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 40,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F9BA03_9408_2F1A_41E0_0059E437615A.png",
            "minWidth": 0,
            "mode": "push",
            "height": 40,
            "rollOverIconURL": "skin/IconButton_87F9BA03_9408_2F1A_41E0_0059E437615A_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F9BA03_9408_2F1A_41E0_0059E437615A_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27663"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F93A04_9408_2F1E_41B6_0EFE57DC70C6",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 32,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F93A04_9408_2F1E_41B6_0EFE57DC70C6.png",
            "minWidth": 0,
            "mode": "push",
            "height": 32,
            "rollOverIconURL": "skin/IconButton_87F93A04_9408_2F1E_41B6_0EFE57DC70C6_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F93A04_9408_2F1E_41B6_0EFE57DC70C6_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27670"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F84A03_9408_2F1A_41BD_7E1065766258",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 32,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F84A03_9408_2F1A_41BD_7E1065766258.png",
            "minWidth": 0,
            "mode": "push",
            "height": 32,
            "rollOverIconURL": "skin/IconButton_87F84A03_9408_2F1A_41BD_7E1065766258_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F84A03_9408_2F1A_41BD_7E1065766258_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27662"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F92A04_9408_2F1E_41DC_891A23DAAAE5",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 40,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F92A04_9408_2F1E_41DC_891A23DAAAE5.png",
            "minWidth": 0,
            "mode": "push",
            "height": 40,
            "rollOverIconURL": "skin/IconButton_87F92A04_9408_2F1E_41DC_891A23DAAAE5_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F92A04_9408_2F1E_41DC_891A23DAAAE5_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27671"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F9AA03_9408_2F1A_41D1_1DD38B96D600",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 40,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F9AA03_9408_2F1A_41D1_1DD38B96D600.png",
            "minWidth": 0,
            "mode": "push",
            "height": 40,
            "rollOverIconURL": "skin/IconButton_87F9AA03_9408_2F1A_41D1_1DD38B96D600_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F9AA03_9408_2F1A_41D1_1DD38B96D600_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27664"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F90A04_9408_2F1E_41B5_6A1ECB14D14B",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 32,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F90A04_9408_2F1E_41B5_6A1ECB14D14B.png",
            "minWidth": 0,
            "mode": "push",
            "height": 32,
            "rollOverIconURL": "skin/IconButton_87F90A04_9408_2F1E_41B5_6A1ECB14D14B_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F90A04_9408_2F1E_41B5_6A1ECB14D14B_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27673"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F9EA04_9408_2F1E_41C9_30C352D7C03C",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 32,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F9EA04_9408_2F1E_41C9_30C352D7C03C.png",
            "minWidth": 0,
            "mode": "push",
            "height": 32,
            "rollOverIconURL": "skin/IconButton_87F9EA04_9408_2F1E_41C9_30C352D7C03C_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F9EA04_9408_2F1E_41C9_30C352D7C03C_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27667"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F9CA04_9408_2F1E_41D7_8342D301E6EE",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 32,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F9CA04_9408_2F1E_41D7_8342D301E6EE.png",
            "minWidth": 0,
            "mode": "push",
            "height": 32,
            "rollOverIconURL": "skin/IconButton_87F9CA04_9408_2F1E_41D7_8342D301E6EE_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F9CA04_9408_2F1E_41D7_8342D301E6EE_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27669"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F9DA04_9408_2F1E_41B6_006A643E8BF7",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 40,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F9DA04_9408_2F1E_41B6_006A643E8BF7.png",
            "minWidth": 0,
            "mode": "toggle",
            "height": 40,
            "rollOverIconURL": "skin/IconButton_87F9DA04_9408_2F1E_41B6_006A643E8BF7_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F9DA04_9408_2F1E_41B6_006A643E8BF7_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27668"
            }
        },
        {
            "transparencyActive": false,
            "propagateClick": false,
            "id": "IconButton_87F99A03_9408_2F1A_41B9_DB045DE6D37D",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "width": 32,
            "minHeight": 0,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "iconURL": "skin/IconButton_87F99A03_9408_2F1A_41B9_DB045DE6D37D.png",
            "minWidth": 0,
            "mode": "push",
            "height": 32,
            "rollOverIconURL": "skin/IconButton_87F99A03_9408_2F1A_41B9_DB045DE6D37D_rollover.png",
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "IconButton",
            "borderRadius": 0,
            "pressedIconURL": "skin/IconButton_87F99A03_9408_2F1A_41B9_DB045DE6D37D_pressed.png",
            "cursor": "hand",
            "data": {
                "name": "Button27665"
            }
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_799355A0_6870_1BB0_41BF_1737C6805684); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 8.73,
                    "image": "this.AnimatedImageResource_8AD4BACB_997D_64F4_41E2_96BA4058FD0F",
                    "pitch": 6.47,
                    "yaw": -154.75,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_89C382CD_997D_648C_41D9_FD5062F4C2E7",
            "maps": [
                {
                    "hfov": 8.73,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -154.75,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 6.47
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2, this.camera_799DE5AA_6870_1BB0_418C_9DACB3D8DC07); this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.43,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_1_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 383,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": 12.5,
                    "yaw": -154.5,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_89C262CD_997D_648C_41D7_8B9B8EEC3620",
            "maps": [
                {
                    "hfov": 16.43,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -154.5,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_1_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 51,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": 12.5
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_839E559D_93BD_B531_41D9_55F741B8C109, this.camera_7B03B6E8_6870_19B0_41D4_8924DA298199); this.mainPlayList.set('selectedIndex', 6)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 11.24,
                    "image": "this.AnimatedImageResource_4DF4B63A_5E7E_8DE7_41CF_1C482131842C",
                    "pitch": -17.77,
                    "yaw": -112.3,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_4E80B00C_5E7E_85A3_41BF_3AD2601D9482",
            "maps": [
                {
                    "hfov": 11.24,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -112.3,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_1_HS_1_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -17.77
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.mainPlayList.set('selectedIndex', 7)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.53,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_1_HS_2_0.png",
                                "class": "ImageResourceLevel",
                                "width": 383,
                                "height": 120
                            }
                        ]
                    },
                    "pitch": -10.87,
                    "yaw": -111.82,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_4E80A00C_5E7E_85A3_41A5_48AD67603E1C",
            "maps": [
                {
                    "hfov": 16.53,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -111.82,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_1_HS_2_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 51,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -10.87
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607, this.camera_7B4976C0_6870_19F0_41BD_E5224D94E216); this.mainPlayList.set('selectedIndex', 0)"
                }
            ],
            "data": {
                "label": "Circle Door 02"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 15.71,
                    "image": "this.AnimatedImageResource_4DF6B63C_5E7E_8DE3_41CB_C3B6B3C18BCD",
                    "pitch": -12.25,
                    "yaw": -165.68,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 100
                }
            ],
            "id": "overlay_4F31AA0C_5E7E_85BC_41C9_BD06BC8AF01B",
            "maps": [
                {
                    "hfov": 15.71,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -165.68,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_1_HS_0_0_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 16,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -12.25
                }
            ]
        },
        {
            "enabledInCardboard": true,
            "class": "HotspotPanoramaOverlay",
            "rollOverDisplay": false,
            "areas": [
                {
                    "class": "HotspotPanoramaOverlayArea",
                    "mapColor": "#FF0000",
                    "click": "this.startPanoramaWithCamera(this.panorama_4EC5B047_5E66_85AD_41D6_2D080845A607, this.camera_7B7796CA_6870_19F0_41C0_F9F25E155E6D); this.mainPlayList.set('selectedIndex', 0)"
                }
            ],
            "data": {
                "label": "  LIVING ROOM"
            },
            "useHandCursor": true,
            "items": [
                {
                    "hfov": 16.79,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_1_HS_1_0.png",
                                "class": "ImageResourceLevel",
                                "width": 191,
                                "height": 60
                            }
                        ]
                    },
                    "pitch": -4.08,
                    "yaw": -165.32,
                    "class": "HotspotPanoramaOverlayImage",
                    "distance": 50
                }
            ],
            "id": "overlay_4F31BA0C_5E7E_85BC_41B7_B5E41052A3A9",
            "maps": [
                {
                    "hfov": 16.79,
                    "class": "HotspotPanoramaOverlayMap",
                    "yaw": -165.32,
                    "image": {
                        "class": "ImageResource",
                        "levels": [
                            {
                                "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_1_HS_1_0_map.gif",
                                "class": "ImageResourceLevel",
                                "width": 50,
                                "height": 16
                            }
                        ]
                    },
                    "pitch": -4.08
                }
            ]
        },
        {
            "propagateClick": false,
            "layout": "vertical",
            "children": [
                "this.IconButton_87F9EA04_9408_2F1E_41C9_30C352D7C03C",
                "this.IconButton_87F9DA04_9408_2F1E_41B6_006A643E8BF7",
                "this.IconButton_87F9CA04_9408_2F1E_41D7_8342D301E6EE"
            ],
            "id": "Container_87F98A03_9408_2F1A_41D4_2A8FEF5F6109",
            "scrollBarColor": "#000000",
            "paddingRight": 0,
            "paddingLeft": 0,
            "borderSize": 0,
            "scrollBarVisible": "rollOver",
            "width": 40,
            "minHeight": 20,
            "horizontalAlign": "center",
            "verticalAlign": "middle",
            "scrollBarOpacity": 0.5,
            "scrollBarMargin": 2,
            "contentOpaque": false,
            "minWidth": 20,
            "height": "100%",
            "gap": 4,
            "paddingTop": 0,
            "backgroundOpacity": 0,
            "shadow": false,
            "paddingBottom": 0,
            "class": "Container",
            "borderRadius": 0,
            "overflow": "hidden",
            "scrollBarWidth": 10,
            "data": {
                "name": "Container27666"
            }
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_81B669BB_93B4_7D71_41D3_1810EE044A15",
            "levels": [
                {
                    "url": "media/panorama_9C2AE16E_938F_8D10_4192_F919CFC6A05C_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 1080,
                    "height": 900
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_4D0B3062_5E7D_8667_41BF_5436425C451D",
            "levels": [
                {
                    "url": "media/panorama_4FC7B079_5E62_8665_4194_2EEBC4A71BD1_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_891C9328_999F_A5B4_41D8_03DDF3C624AF",
            "levels": [
                {
                    "url": "media/panorama_88813F6D_999E_FD8C_41C1_09C3ACFED144_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_84F67CF7_9394_F4F1_41CA_F6B56514B737",
            "levels": [
                {
                    "url": "media/panorama_81363130_938C_8D0F_41C5_8590958EBAB7_0_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 480,
                    "height": 360
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_795243D5_6850_1F91_41D3_F3181F37D094",
            "levels": [
                {
                    "url": "media/panorama_7B5897B1_6850_0790_41D2_4E953A4A0431_0_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8344A83C_93B5_9B77_41D1_19426C8EF7DC",
            "levels": [
                {
                    "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 480,
                    "height": 360
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8780333B_93B3_8D71_41D8_695CE19CFC87",
            "levels": [
                {
                    "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0_HS_1_0.png",
                    "class": "ImageResourceLevel",
                    "width": 520,
                    "height": 300
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_7D028F9F_6850_0790_41CC_B0853F5CFB29",
            "levels": [
                {
                    "url": "media/panorama_839B6B81_93BD_9D11_41D8_2EA728E4F658_0_HS_3_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 7,
            "frameCount": 32,
            "frameDuration": 41,
            "colCount": 5,
            "id": "AnimatedImageResource_4D1EC052_5E7D_85A7_41D7_107485704EFE",
            "levels": [
                {
                    "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 600,
                    "height": 385
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_4D003057_5E7D_85AC_41CD_184CA7477F7D",
            "levels": [
                {
                    "url": "media/panorama_4EC5B047_5E66_85AD_41D6_2D080845A607_1_HS_3_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8AD44ACB_997D_64F4_4188_8B5F90727E9A",
            "levels": [
                {
                    "url": "media/panorama_89FC974A_997D_ADF4_41DC_B76311B665F9_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_4D0A9062_5E7D_8667_41C7_B7D5DBE08A10",
            "levels": [
                {
                    "url": "media/panorama_4EAB1746_5E67_8BAC_41D4_66AA1796A097_1_HS_1_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_80CAFFA7_938C_7511_41C2_DC5C649CA753",
            "levels": [
                {
                    "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 520,
                    "height": 420
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 22,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8FC66921_99BD_A5B4_41DF_3B1B751F5FB9",
            "levels": [
                {
                    "url": "media/panorama_839E559D_93BD_B531_41D9_55F741B8C109_0_HS_1_0.png",
                    "class": "ImageResourceLevel",
                    "width": 1000,
                    "height": 420
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_85000639_99EE_AF94_4191_F2EBE5D26C27",
            "levels": [
                {
                    "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8507463A_99EE_AF97_41BE_3069ED064623",
            "levels": [
                {
                    "url": "media/panorama_8B58D0A7_997E_A4BC_41E0_0F4157E0EA9B_0_HS_2_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8A05346D_99AD_A38C_41AB_7598FA445A0E",
            "levels": [
                {
                    "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_1_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8A04946D_99AD_A38C_41DB_F442F6A6A59C",
            "levels": [
                {
                    "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_2_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 7,
            "frameCount": 32,
            "frameDuration": 41,
            "colCount": 5,
            "id": "AnimatedImageResource_8A04C46D_99AD_A38C_41C3_948AF33CBC94",
            "levels": [
                {
                    "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_3_0.png",
                    "class": "ImageResourceLevel",
                    "width": 600,
                    "height": 385
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8A04346D_99AD_A38C_41D5_2CD28D27A338",
            "levels": [
                {
                    "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_1_HS_4_0.png",
                    "class": "ImageResourceLevel",
                    "width": 480,
                    "height": 420
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_850E0637_99EE_AF9D_41DB_26A7EB496242",
            "levels": [
                {
                    "url": "media/panorama_89FAD16C_99AD_658C_41AF_67757420F387_0_HS_8_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_52A4207E_4E49_89B7_41BF_3D1F5EDF8396",
            "levels": [
                {
                    "url": "media/panorama_56BDF58E_4E4B_8B56_41C6_150732D59FBC_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_84F6ACF6_9394_F4F3_41B2_DB2A9935B963",
            "levels": [
                {
                    "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 480,
                    "height": 360
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_84F6CCF6_9394_F4F3_41DB_31D114D41723",
            "levels": [
                {
                    "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_1_0.png",
                    "class": "ImageResourceLevel",
                    "width": 480,
                    "height": 360
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_84AE52B1_939C_8F71_41DC_69C00FA9D6FB",
            "levels": [
                {
                    "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_2_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_84ADB2B1_939C_8F71_41D1_7F5317E0F438",
            "levels": [
                {
                    "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_3_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_84AD12B1_939C_8F71_41C6_CCCB6813B067",
            "levels": [
                {
                    "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_4_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8501E639_99EE_AF94_41D9_BE4F7397D255",
            "levels": [
                {
                    "url": "media/panorama_839B5F25_93BD_B511_41D5_7F556F13FBA2_0_HS_10_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_8AD4BACB_997D_64F4_41E2_96BA4058FD0F",
            "levels": [
                {
                    "url": "media/panorama_89C3B2CD_997D_648C_41C0_1F261C9376D8_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_4DF4B63A_5E7E_8DE7_41CF_1C482131842C",
            "levels": [
                {
                    "url": "media/panorama_4E81500C_5E7E_85A3_41C6_701DEEB4A76D_1_HS_1_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        },
        {
            "class": "AnimatedImageResource",
            "rowCount": 6,
            "frameCount": 24,
            "frameDuration": 41,
            "colCount": 4,
            "id": "AnimatedImageResource_4DF6B63C_5E7E_8DE3_41CB_C3B6B3C18BCD",
            "levels": [
                {
                    "url": "media/panorama_4F319A0C_5E7E_85BC_41AA_DCA606D7AE7C_1_HS_0_0.png",
                    "class": "ImageResourceLevel",
                    "width": 800,
                    "height": 1200
                }
            ]
        }],
        "width": "100%"
    };


    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function (index) {
        if (this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function () {
        if (!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function () {
        if (!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function () {
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function () {
        return this.pointer >= 0 && this.pointer < this.list.length - 1;
    };
    //

    if (script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
