import React from 'react'
import $ from 'jquery'
import {Link} from 'react-router-dom' 

const Home = () => {

    $(() => {
        let video = document.getElementById('homeVid')
        if(video !== null){
            video.currentTime = 8
        }
    })
    
    return (
        <div>
            <div className='home-container'>
                <video id='homeVid' className="homeVideo" src="https://formation-video-cfpvd.s3.ca-central-1.amazonaws.com/Ch2+situation+initiale_1.mp4" preload="auto" autoPlay='autoplay' loop muted/>
                <Link to='/recording' className='startBtn'>Commencer</Link>
            </div>
        </div>
    )
}

export default Home
