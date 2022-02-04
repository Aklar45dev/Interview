import React, { useState, useEffect } from 'react'
import { storage } from './firebase'
import $ from 'jquery'
import { useRecordWebcam } from 'react-record-webcam'
import firebase from './firebase'
import videoUrls from './videoUrls'
import Spinner from './Spinner'
import VideoPlayer from './components/VideoPlayer'

const Interview = () => {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [urls, setUrls] = useState([])
    const [interviewId, setInterviewId] = useState(0)
    const [file, setFile] = useState(null)
    const interviewVideos = videoUrls.interviewVideos
        
    useEffect(() => {
        UpdateState()
        $("#recording").css({'display':'block', 'width': '50%', 'padding-left':'25%'})
        $("#preview").css({'display':'none', 'width': '50%', 'padding-left':'25%'})
        $("#start").css({'display':'none'})
        $("#stop").css({'display':'none'})
        $("#play").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#retake").css({'display':'none'})
        $("#end-ui").css({'display':'none'})
        $("#load-spinner").css({'display':'none'})
        $("#rec").css({'display':'none'})
        $("#recording").css({'display':'none'})
        $("#start").css({'border': '4px solid rgb(0, 155, 255)', 'color': 'rgba(0, 155, 255, 1)'})
        $("#stop").css({'border': '4px solid rgb(255, 0, 0)', 'color': 'rgba(255, 0, 0, 1)'})
        $("#retake").css({'border': '4px solid rgb(255, 80, 0)', 'color': 'rgba(255, 80, 0, 1)'})
    },[])

    const recordWebcam = useRecordWebcam();

    const CreateFile = async () => {
        $("#retake").css({'display':'inline'})
        $("#stop").css({'display':'none'})
        $("#next").css({'display':'none'})
        $("#upload").css({'display':'inline'})
        $("#play").css({'display':'inline'})
        $("#next").css({'display':'inline'})
        $("#rec").css({'display':'none'})
        await recordWebcam.stop()
        const blob = await recordWebcam.getRecording()
        let filename = Math.floor(Math.random() * 1000000)
        const myFile = new File([blob], filename, {
            type: "video/mp4",
          })
        setFile(myFile)
        $("#recording").css({'display':'none'})
        $("#preview").css({'display':'block'})
    }

    const UpdateState = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                //GET USER
                setEmail(user.email)
                fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${user.email}`)
                .then(response => response.json())
                .then(data => {
                setName(data.name)
                setUrls(data.urls)
                })
            }
        })
    }

    const playPreview = () => {
        document.getElementById("preview").play()
    }

    const startCamera = () => {
        recordWebcam.start()
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#start").css({'display':'none'})
        $("#next").css({'display':'none'})
        $("#stop").css({'display':'inline'})
        $("#rec").css({'display':'inline'})
    }

    const openCamera = () => {
        recordWebcam.open()
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#start").css({'display':'inline'})
        $("#open").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#next").css({'display':'none'})
    }

    const closeCamera = () => {
        recordWebcam.close()
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#start").css({'display':'none'})
        $("#stop").css({'display':'none'})
        $("#play").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#retake").css({'display':'none'})
        $("#next").css({'display':'inline'})
        $("#open").css({'display':'inline'})
    }

    const retakeRecord = () => {
        recordWebcam.retake()
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#retake").css({'display':'none'})
        $("#start").css({'display':'inline'})
        $("#play").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#next").css({'display':'none'})
        
    }

    const endPlay = () => {
        $("#video-wrapper").css({'display':'none'})
        $("#recorder-container").css({'display':'block'})
    }

    const nextQuestion = () => {
        closeCamera()
        setInterviewId(interviewId+1)
        $("#video-wrapper").css({'display':'flex'})
        $("#recorder-container").css({'display':'none'})
        $("#load-spinner").css({'display':'none'})
        $("#recording").css({'display':'none'})
        if(interviewVideos[interviewId+1] === undefined){
            $("#end-ui").css({'display':'flex'})
            $("#video-wrapper").css({'display':'none'})
        }
    }

    const handleUpload = () => {
            $("#load-spinner").css({'display':'block'})
            $("#retake").css({'display':'none'})
            $("#play").css({'display':'none'})
            $("#next").css({'display':'none'})
            $("#upload").css({'display':'none'})
            $("#preview").css({'display':'none'})
            const uploadTask = storage.ref(`uploads/${file.name}`).put(file)
            uploadTask.on(
                "state_changed",
                snapshot => {
                    let progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                },
                error => {
                    console.log(error)
                },
                () => {
                    storage
                        .ref('uploads')
                        .child(file.name)
                        .getDownloadURL()
                        .then(url => {
                            let newUrls = urls
                            if (newUrls !== undefined){
                                newUrls[interviewId] = url
                            }
                            if (newUrls === undefined){
                                newUrls = [url]
                            }
                            //POST    
                            const requestOptions = {
                                method: 'POST',
                                body: JSON.stringify({ id: email, name: name, urls: newUrls })
                            }
                            fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${email}`, requestOptions)
                            $("#next").css({'display':'inline'})
                            nextQuestion()
                        })
                }
            )
    }

    return (
        <div className='no-scroll'>
            <div className='upload-spinner' id='load-spinner'>chargement...</div>
            <VideoPlayer id="mainVideo" src={interviewVideos[interviewId]} end={endPlay} title={interviewId} />
            <div id="recorder-container">
                <div className='btns-recording'>
                    <button className='record-btn' id="open" onClick={() => openCamera()}>Caméra</button>
                    <button className='record-btn' id="start" onClick={() => startCamera()}>Enregistrer</button>
                    <button className='record-btn' id="retake" onClick={() => retakeRecord()}>Reprendre</button>
                    <button className='record-btn' id="stop" onClick={() => CreateFile()}>Arrêter</button>
                    <button className='record-btn' id="play" onClick={() => playPreview()}>Jouer</button>
                    <button className='record-btn' id="upload" onClick={() => handleUpload()}>Savegarder</button>
                    <button className='record-btn' id="next" onClick={() => nextQuestion()}>Suivant</button>
                    <button id="rec" className="Rec button-rec">Recording</button>
                </div>
                <video id="recording" ref={recordWebcam.webcamRef} autoPlay muted />
                <video id="preview" ref={recordWebcam.previewRef} autoPlay />
            </div>
            <div className='replay-container' id="end-ui">
                <a className='record-btn' href='./interview' >Résultats</a>
            </div>

        </div>
    )
}

export default Interview