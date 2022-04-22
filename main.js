const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: 'Chìm sâu trong tình iu với Nhi',
            singer: 'Anh',
            path: './asset/music/Bởi vì em quá xinh đẹp _ Chìm sâu - RPT MCK (ft. Trung Trần) - Guitar cover.mp3',
            image: './asset/image/n1.jpg',
        },
        {
            name: 'Thức giấc với Nhi :3',
            singer: 'Iu',
            path: './asset/music/Thức Giấc - Da LAB (Official Music Video).mp3',
            image: './asset/image/n5.png',
        },
        {
            name: 'Thanh xuân iu em :3',
            singer: 'Bé',
            path: './asset/music/Thanh Xuân - Da LAB (Official MV).mp3',
            image: './asset/image/n4.png',
        },
        {
            name: 'Bài cho bbi chill',
            singer: 'Nhi',
            path: './asset/music/W_n - ‘3107’ full album- ft. ( titie, Nâu ,Dươngg ).mp3',
            image: './asset/image/n3.jpg',
        },
        {
            name: 'Kỷ niệm khong :3',
            singer: 'Siu Nhìuuuuuu <3',
            path: './asset/music/Muốn Được Cùng Em - FREAKY × CM1X ( ft. QUỲNH GAI ) - LYRICS VIDEO.mp3',
            image: './asset/image/n2.png',
        },
    ],

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML  = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })     
    },

    handleEvent: function(){
        const cdWidth = cd.offsetWidth
        const _this = this

        //Xử lý quay/dừng cd
        const cdThumbAnimate = cdThumb.animate(
        {
            transform: 'rotate(360deg)'
        },
        {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()


        //Xử lý phóng to/ thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        //Khi son được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Tiến độ khi bài hát bị thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent   
            }
        }

        //Xử lý khi tua
        progress.onchange = function(e){
            const seektime = e.target.value * audio.duration / 100
            audio.currentTime = seektime
        }

        //Xử lý khi next Song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
                audio.play()
                _this.render()
                _this.scrollTopActiveSong()
        }

        //Xử lý khi pev Song
        prevBtn.onclick = function(){
        if(_this.isRandom){
            _this.playRandomSong()
        }else{
            _this.prevSong()  
        }   
            audio.play()
            _this.render()
            _this.scrollTopActiveSong()
        }

        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
    
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        progress.onclick = function(e){
            const seektime = e.target.value * audio.duration / 100
            audio.currentTime = seektime
        }
    
        //Xử lý next song khi khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //Lắng nghe hành vi click vào playList
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            
            if(e.target.closest('.song:not(.active)') || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                if(e.target.closest('.option')){

                }
            }
        }
    },


    scrollTopActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },



    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    
    start: function(){
        this.defineProperties()
        this.render() 
        this.loadCurrentSong()
        this.handleEvent()
    }
}

app.start()
