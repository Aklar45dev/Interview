import React, {useEffect, useState} from 'react'
import $ from 'jquery'
import VideoToolBar from './VideoToolBar'

const VideoPlayer = ({src, end, title}) => {

    let videoPlaying = true
    const [videoEnded, setVideoEnded] = useState(false)

    useEffect(() => {
        mouseMove()
    },[])

    const HandlePlay = () => {
        mouseMove()
        if(videoPlaying){
            $('#mainVideo').trigger('pause')
            $("#playButtonImage").attr("src", '/images/play.png')
            videoPlaying = false
            return
        }
            $('#mainVideo').trigger('play')
            $("#playButtonImage").attr("src", '/images/pause.png')
            videoPlaying = true
    }

    const HandleJump = (forward) => {
        mouseMove()
        if(forward)
        {
            document.getElementById("mainVideo").currentTime = (document.getElementById("mainVideo").currentTime)+10
            return
        }
        document.getElementById("mainVideo").currentTime = (document.getElementById("mainVideo").currentTime)-10
    }

    let timer
    let timerRunning = false
    
    const mouseMove = () => {
        if(!videoEnded){
            if(timerRunning)
            {
                $('#timeStampsContainer').slideDown(500)
                $('#playerControlsContainer').fadeIn(500)
                $('#mainVideo').css({'cursor': 'default'})
            }
    
            timerRunning = true
            clearInterval(timer)
            timer = setInterval(() => {
                timerRunning = false
                clearInterval(timer)
                $('#timeStampsContainer').slideUp(500)
                $('#playerControlsContainer').fadeOut(500)
                $('#mainVideo').css({'cursor': 'none'})
            }, 1500)
        }
    }

    const endPlayer = () => {
        $('#loadingIcon').css({'display': 'block'})
        end()
        setVideoEnded(true)

    }

    const hideLoading = () => {
        $('#loadingIcon').css({'display': 'none'})
        setVideoEnded(false)
    }

    return (
        <div className="video-container" id="video-wrapper" onMouseMove={()=> mouseMove()}>
            <video onPlaying={() => hideLoading()} onEnded={() => endPlayer()} id="mainVideo" src={src} autoPlay preload="auto"/>
            <div className="loadingio-spinner-spinner-ofgnqrv5v2" id='loadingIcon'>
                <div className="ldio-q5csxh2c9l">
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
            </div>
            <div className='controls-container' id='playerControlsContainer'>
                <button onClick={() => HandleJump(false)} className="noselect">
                    <img src="/images/previous.png" width="90" height="90" alt="play" />
                </button>
                <button onClick={HandlePlay} className="noselect" id="playButton">
                    <img id="playButtonImage" src="/images/pause.png" width="135" height="135" alt="play" />
                </button>
                <button onClick={() => HandleJump(true)} className="noselect">
                    <img src="/images/next.png" width="90" height="90" alt="play" />
                </button>
            </div>
            <VideoToolBar title={title}/>
        </div>
    )

}

export default VideoPlayer
