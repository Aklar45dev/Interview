import React, { useState } from 'react'
import $ from 'jquery'
import firebase from './firebase'

const SignIn = () => {

    const text = window.navigator.userAgent
    const isFirefox = text.includes("Firefox")

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const signUp = async() => {
        if(!email.includes("csob.qc.ca"))
        {
            alert("Utiliser votre email du CFP")
            return
        }
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                sendProfil()
                // Signed in 
            })
            .catch((error) => {
                alert(error.message)
        })
    }

    const sendProfil = () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ id: email, name: name, urls: [], script: [] })
        }
        fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${email}`, requestOptions)
        .then(() => {
            window.location.href = './'
        })
        
    }

    const login = () => {

        window.location.href = './login'
                
    }

    const handleChangeEmail = e => {
        setEmail(e.target.value)
    }

    const handleChangePassword = e => {
        setPassword(e.target.value)
    }

    const handleChangeName = e => {
        setName(e.target.value)
    }

    $('html').css({'overflow-y':'scroll'})

    return (
        <div>
            {isFirefox ? <div className="text-title-warning">Veuillez utiliser le navigateur Chrome</div> : 
            <div className='loginGrid'>
                <h1 className='text-title-main'>Simulation d'entretien</h1>
                <hr></hr>
                <h1 className='connection'>Inscription</h1>
                <div>
                    <p className='logLabel'>Nom complet :</p>
                    <input className='inputBoxLog' type='text' onChange={handleChangeName}/>
                </div>
                <div>
                    <p className='logLabel'>Courriel :</p>
                    <input className='inputBoxLog' type='text' value={email} onChange={handleChangeEmail}/>
                </div>
                <div>
                    <p className='logLabel'>Mot de passe :</p>
                    <input className='inputBoxLog' type='password' value={password} onChange={handleChangePassword}/>
                </div>
                <div className='logBtnContainer'>
                    <button onClick={() => signUp()} className='logBtn'>S'inscrire</button>
                    <button onClick={() => login()} className='logBtn2'>Se connecter</button>
                </div>
                <div className='warning'>warning</div>
            </div>
            }
        </div>
    )
}

export default SignIn
