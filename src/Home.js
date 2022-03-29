import React from 'react'
import $ from 'jquery'
import {Link} from 'react-router-dom'

const Home = props => {
    
    const text = window.navigator.userAgent
    const isFirefox = text.includes("Firefox")
    
    $(() => {
        let video = document.getElementById('homeVid')
        $("#homeVid").fadeOut(0).fadeIn(1000)
        if(video !== null){
            video.currentTime = 8
        }
    })

    
    return (
        <div>
            {isFirefox ? <div className="text-title-warning">Veuillez utiliser le navigateur Chrome</div> : 
            <div className='home-container'>
                <video id='homeVid' className="homeVideo" src="https://cfp-secretariat.s3.us-east-2.amazonaws.com/y2meta.com+-+Capsule+secr%C3%A9tariat+-+Employeur.mp4" preload="auto" autoPlay='autoplay' loop muted/>
                <div className="start-container">
                    <h1 className='text-title-main-home'>Simulation d'entretien</h1>
                    {props.email === 'admin@gmail.com' ? 
                    <Link to='/dashboard' className='startBtn'>Administrateur</Link> :
                    <Link to='/recording' className='startBtn'>Lancer l'entretien</Link>
                    }
                    
                </div>
            </div>}
        </div>
    )
}

export default Home
