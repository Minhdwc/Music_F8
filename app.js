const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $('.center_header h2');
const cd = $('.image img');
const cd_thum = $('.image');
const audio = $('audio');

const play = $('.play');
const nextBtn = $('.next');
const prevBtn = $('.prev');
const random = $('.random');
const repeat = $('.undo');
const progress = $('.progress');

const playlist =$('.play_list');



const listSong = $$('.song');


listSong.forEach((value, index) => {
    listSong[index].addEventListener('click', () => {
        removeSongActive();
        listSong[index].classList.add('active')
    })
});

function removeSongActive() {
    listSong.forEach((value, index) => {
        if (listSong[index].classList.contains('active')) {
            listSong[index].classList.remove('active')
        }
    })
}
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    song: [
        {
            name: '2h',
            singer: 'MCK',
            path: './Music/2h.mp3',
            img: './Img/2h.jpg'
        },
        {
            name: 'Có em',
            singer: 'Madihu, Low G',
            path: './Music/CoEm.mp3',
            img: './Img/CoEm.jpg'
        },
        {
            name: 'Sống cho hết đời thanh xuân',
            singer: 'BCTM',
            path: './Music/SCHDTX.mp3',
            img: './Img/SCHDTX.jpg'
        },
        {
            name: 'Badtrip',
            singer: 'MCK',
            path: './Music/badtrip.mp3',
            img: './Img/badtrip.jpg'
        },
        {
            name: 'Anh đã ổn hơn',
            singer: 'MCK',
            path: './Music/ADOH.mp3',
            img: './Img/ADOH.jpg'
        },
        {
            name: 'Thủ đô Cypher',
            singer: 'BeckStage X Bitis Hunter',
            path: './Music/TDCP.mp3',
            img: './Img/TDCP.jpg'
        },
        {
            name: 'Ghé qua',
            singer: 'Dick, Tofu, PC',
            path: './Music/GheQua.mp3',
            img: './Img/GheQua.jpg'
        },
        {
            name: '6h chill',
            singer: 'BCTM',
            path: './Music/6hChill.mp3',
            img: './Img/6hChill.jpg'
        }
    ],

    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.song.map((song, index )=> {
            return `
            <div class="song ${index === this.currentIndex ? 'active' :''}" data-index ="${index}">
            <div class="image_song">
                <img src="${song.img}" alt="">
            </div>
            <div class="center_song">
                <h3>${song.name}</h3>
                <p>${song.singer}</p>
            </div>
            <div class="bnt_three_point">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.song[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        const cdAnimate = cd.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause();

        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.height = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }


        audio.onplay = function () {
            _this.isPlaying = true;
            play.classList.add('playing');
            cdAnimate.play();
        }


        audio.onpause = function () {
            _this.isPlaying = false;
            play.classList.remove('playing');
            cdAnimate.pause();
        }


        play.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }


        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                if (progressPercent == 100) {
                    audio.pause();
                }
            }
        };


        progress.onchange = function (e) {
            const seekTimes = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTimes;
        }


        nextBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandom();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }


        prevBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandom();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }


        random.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            random.classList.toggle('active_control', _this.isRandom);
        }

        repeat.onclick = function(e){
            _this.isRepeat =!_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeat.classList.toggle('active_control', _this.isRepeat);
        }


        audio.onended = function () {
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        };

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.btn_three_point')){
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        _this.render();
                        audio.play();
                    }
            }
        };
    },

    scrollToActiveSong: function () {
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center',
            });
        }, 300)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cd.src = this.currentSong.img;
        audio.src = this.currentSong.path;
    },


    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.song.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },


    playRandom: function(){
        let newIndex
        do{
            newIndex =Math.floor(Math.random() * this.song.length);
        }while(this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },


    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1;
        }
        this.loadCurrentSong();
    },


    start: function () {
        this.defineProperty();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}


app.start();

