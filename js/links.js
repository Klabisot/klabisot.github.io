// === Gradient palette ===
var palette = [
    ['rgba(109,42,109,0.4)', 'rgba(83,22,75,0.3)'],
    ['rgba(130,55,95,0.35)', 'rgba(109,42,109,0.3)'],
    ['rgba(83,22,75,0.35)', 'rgba(130,55,95,0.25)'],
    ['rgba(179,100,80,0.25)', 'rgba(109,42,109,0.3)'],
    ['rgba(109,42,109,0.3)', 'rgba(130,55,95,0.35)'],
    ['rgba(130,55,95,0.3)', 'rgba(179,100,80,0.2)'],
];

var links = document.querySelectorAll('.split-links .link');
links.forEach(function(el, i) {
    var pair = palette[Math.floor(Math.random() * palette.length)];
    var dir = Math.random() > 0.5 ? 'to right' : 'to left';
    el.style.background = 'linear-gradient(' + dir + ', ' + pair[0] + ', ' + pair[1] + ')';

    setTimeout(function() {
        el.classList.add('show');
    }, i * 115);
});

// === Mouse Glow === (removed)
// === Card Tilt === (removed)

var moodText = '';
(function() {
    var statuses = [
        'feeling creative ✿',
        'sleepy...',
        'drawing rn 🎨',
        'listening to music ♪',
        'commissions open!',
        'taking a break ☁',
        'hyperfixated',
        'vibing',
    ];
    moodText = 'status: ' + statuses[Math.floor(Math.random() * statuses.length)];
})();

// === Typing Effect ===
(function() {
    var aka = document.querySelector('.artist-name .aka');
    if (!aka) return;
    var text = aka.textContent + ' // ' + moodText;
    aka.textContent = '';
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    aka.appendChild(cursor);
    var i = 0;
    function type() {
        if (i < text.length) {
            aka.insertBefore(document.createTextNode(text[i]), cursor);
            i++;
            setTimeout(type, 80);
        } else {
            setTimeout(function() { cursor.remove(); }, 1500);
        }
    }
    setTimeout(type, 600);
})();

// === Parallax ===
(function() {
    var img = document.querySelector('.artist-name img');
    if (!img) return;
    document.addEventListener('mousemove', function(e) {
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        var dx = (e.clientX - cx) / cx;
        var dy = (e.clientY - cy) / cy;
        img.style.transform = 'translate(' + (-dx * 4) + 'px, ' + (-dy * 3) + 'px)';
    });
})();

// === Time Greeting ===
(function() {
    var el = document.querySelector('.greeting');
    if (!el) return;
    var h = new Date().getHours();
    el.textContent = h < 6 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
})();

// === Visit Counter ===
(function() {
    var el = document.querySelector('.visits');
    if (!el) return;
    var count = parseInt(localStorage.getItem('dl-visits') || '0') + 1;
    localStorage.setItem('dl-visits', count);
    el.textContent = "You've been here " + count + (count === 1 ? ' time' : ' times');
})();

// === Currently Listening ===
(function() {
    var tracks = [
        { artist: 'Toby Fox', track: 'Scarlet Forest', youtube: '6P5iPI1FjO8' },
        { artist: 'Not Secured,Loose Ends', track: 'Lie-and-Black-and-White', youtube: 'UaLNTSPScd4' },
        { artist: 'Not Secured,Loose Ends', track: 'ミニマルロンド (2020)', youtube: 'oqFDsYttj4I' },
        { artist: 'KAQRIYOTERROR', track: 'アイデンティティークライシス (FF Ver.)', youtube: 'lNoahbOVxoE' },
        { artist: 'KAQRIYOTERROR', track: 'Who are U?', youtube: 'wm4BfK3dTR4' },
        { artist: 'TOKYO TEFUTEFU', track: 'シスカタルシス', youtube: 'dXoZAq02IEw' },
    ];
    var currentIndex = Math.floor(Math.random() * tracks.length);

    var trackEl = document.querySelector('.np-track');
    var artistEl = document.querySelector('.np-artist');
    var playBtn = document.getElementById('np-play');
    var playerEl = document.getElementById('np-player');
    var tracklistEl = document.getElementById('np-tracklist');
    var tracksBtn = document.getElementById('np-tracks-btn');
    if (!trackEl || !playBtn || !playerEl) return;

    function updateTrackUI() {
        trackEl.textContent = tracks[currentIndex].track;
        artistEl.textContent = tracks[currentIndex].artist;
        var items = tracklistEl ? tracklistEl.querySelectorAll('.np-track-item') : [];
        items.forEach(function(item, i) {
            item.classList.toggle('active', i === currentIndex);
        });
    }

    updateTrackUI();

    if (tracklistEl) {
        tracks.forEach(function(t, i) {
            var item = document.createElement('div');
            item.className = 'np-track-item' + (i === currentIndex ? ' active' : '');
            item.innerHTML = '<span class="np-tl-track">' + t.track + '</span><span class="np-tl-artist">' + t.artist + '</span>';
            item.addEventListener('click', function() {
                currentIndex = i;
                updateTrackUI();
                if (player && player.loadVideoById) {
                    player.loadVideoById(tracks[currentIndex].youtube);
                    playing = true;
                    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    playerEl.classList.add('open');
                }
            });
            tracklistEl.appendChild(item);
        });
    }

    if (tracksBtn && tracklistEl) {
        tracksBtn.addEventListener('click', function() {
            tracklistEl.classList.toggle('open');
        });
    }

    var player = null;
    var playing = false;

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('np-player', {
            height: '160',
            width: '100%',
            videoId: tracks[currentIndex].youtube,
            playerVars: { autoplay: 0, controls: 0 },
            events: {
                onReady: function() {
                    var savedVol = parseInt(localStorage.getItem('dl-volume') || '20');
                    player.setVolume(savedVol);
                    volumeSlider.value = savedVol;
                    playBtn.style.display = 'flex';
                },
            },
        });
    };

    var volumeSlider = document.getElementById('np-volume');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            if (player && player.setVolume) {
                player.setVolume(parseInt(this.value));
                localStorage.setItem('dl-volume', this.value);
            }
        });
    }

    var volBtn = document.getElementById('np-vol-btn');
    var volPopover = document.getElementById('np-vol-popover');
    if (volBtn && volPopover) {
        volBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            volPopover.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!volBtn.contains(e.target)) {
                volPopover.classList.remove('open');
            }
        });
    }

    var seekSlider = document.getElementById('np-seek');
    var timeCurrent = document.querySelector('.np-time-current');
    var timeTotal = document.querySelector('.np-time-total');

    function formatTime(s) {
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    setInterval(function() {
        if (!player || !player.getCurrentTime) return;
        var cur = player.getCurrentTime();
        var dur = player.getDuration();
        if (dur > 0) {
            seekSlider.value = (cur / dur) * 100;
            timeCurrent.textContent = formatTime(cur);
            timeTotal.textContent = formatTime(dur);
        }
    }, 1000);

    if (seekSlider) {
        seekSlider.addEventListener('input', function() {
            if (!player || !player.getDuration) return;
            var dur = player.getDuration();
            player.seekTo((this.value / 100) * dur, true);
        });
    }

    playBtn.addEventListener('click', function() {
        if (!player) return;
        if (!playing) {
            playerEl.classList.add('open');
            player.playVideo();
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            playerEl.classList.remove('open');
            player.pauseVideo();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
        playing = !playing;
    });
})();

// === Guestbook ===
(function() {
    var SUBMIT_URL = 'https://dreamy-lounge.klabisotloveschina.workers.dev/';
    var sendBtn = document.getElementById('gb-send');
    var feedback = document.getElementById('gb-feedback');
    var nickInput = document.getElementById('gb-nick');
    var textInput = document.getElementById('gb-text');
    if (!sendBtn) return;

    sendBtn.addEventListener('click', async function() {
        var text = textInput.value.trim();
        if (!text) {
            feedback.textContent = 'Write something!';
            feedback.className = 'gb-feedback visible error';
            return;
        }
        var nick = nickInput.value.trim() || 'Anonymous';
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';
        try {
            var res = await fetch(SUBMIT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nick: nick, text: text }),
            });
            var data = await res.json();
            if (res.ok && data.ok) {
                feedback.textContent = 'Sent, thank you ♥';
                feedback.className = 'gb-feedback visible success';
                textInput.value = '';
                nickInput.value = '';
            } else {
                feedback.textContent = data.error || 'Error sending';
                feedback.className = 'gb-feedback visible error';
            }
        } catch (err) {
            feedback.textContent = 'Network error';
            feedback.className = 'gb-feedback visible error';
        }
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
    });
})();

// === Title Easter Egg ===
(function() {
    var h1 = document.querySelector('.artist-name h1');
    if (!h1) return;
    var original = h1.textContent;
    var easterEggs = ['you like my place?', 'welcome, friend ✿', 'glad you\'re here', 'have a nice day~'];
    var cooldown = false;
    h1.style.cursor = 'pointer';
    h1.addEventListener('click', function() {
        if (cooldown) return;
        cooldown = true;
        h1.textContent = easterEggs[Math.floor(Math.random() * easterEggs.length)];
        setTimeout(function() { h1.textContent = original; cooldown = false; }, 2000);
    });
})();
