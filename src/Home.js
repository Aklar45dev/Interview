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
                <video id='homeVid' className="homeVideo" src="https://cfp-secretariat.s3.us-east-2.amazonaws.com/y2meta.com+-+Capsule+secr%C3%A9tariat+-+Employeur.mp4" preload="auto" autoPlay='autoplay' loop muted/>
                <div className="start-container">
                    <h1 className='text-title-main'>Simulation d'entretien</h1>
                    <Link to='/recording' className='startBtn'>Lancer l'entretien</Link>
                </div>
            </div>
        </div>
    )
}

export default Home
