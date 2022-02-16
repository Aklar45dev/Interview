import React, { useState, useEffect } from 'react'
import './App.css'
import './spinner.css'
import './burger.css'
import Home from './Home'
import Interview from './Interview'
import Login from './Login'
import Register from './SignIn'
import Profile from './Profil'
import Admin from './Admin'
import $ from 'jquery'
import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom'
import firebase from './firebase'

const App = () => {

  let menuOpen = false
  const [email, setEmail] = useState('')

  $(() => {  
    $('#menu').slideUp(0)
    $('#menu-full-page').fadeOut(0)
    $('#adressMenu').fadeOut(0)
    $("#burgerIcon").css({'display':'block'})
    if(email === ''){
      $("#burgerIcon").css({'display':'none'})
    }
  })

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setEmail(user.email)
      }
    })
  })

  const toggleMenu = () => {
    if(!menuOpen)
    {
      $('#menu').slideDown(350)
      $('#menu-full-page').css({'pointer-events':'all'})
      $('#menu-full-page').fadeIn(350)
      $('#burgerIcon').addClass("is-active")
      $('#adressMenu').fadeIn(350)
      menuOpen = true
      return
    }
    $('#menu').slideUp(350)
    $('#menu-full-page').css({'pointer-events':'none'})
    $('#menu-full-page').fadeOut(350)
    $('#burgerIcon').removeClass("is-active")
    $('#adressMenu').fadeOut(350)
    menuOpen = false
  }

  const logout = () => {
    firebase.auth().signOut().then(() => {
      setEmail('')
    }).catch((error) => {
      alert(error)
    })
  }

  return (
    <Router>
      <div id='burger-container'>
        <div className='emailText' id='adressMenu'>{email}</div>
        <button id="burgerIcon" onClick={() => toggleMenu()} className="hamburger hamburger--spin" type="button">
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
      <div id='menu-full-page' onClick={()=>{toggleMenu()}}>
      </div>
      <div className='menu-container' id='menu' >
        <div id='sideBar-container'>
          <div className='item-container'>
            <div className='item-row' onClick={() => toggleMenu()}>
              <img alt="img" src='../images/home.png' />
              <Link className="menu-text" to="/">Accueil</Link>
            </div>
            <div className='item-row' onClick={() => toggleMenu()}>
              <img alt="img" src='../images/profil.png' />
              <Link className="menu-text" to={{
                pathname: "/interview",
                email: email
                }}>Entretien</Link>
            </div>
            {email === 'admin@gmail.com' ? <div className='item-row' onClick={() => toggleMenu()}>
              <img alt="img" src='../images/admin.png' />
              <Link className="menu-text" to="/dashboard">Administrateur</Link>
            </div> : <div/>}
            <div className='item-row' onClick={() => toggleMenu()}>
              <img alt="img" src='../images/login.png' />
              <Link to="./login" onClick={() => logout()} className="menu-text">Quitter</Link>
            </div>
          </div>
        </div>
      </div>
      {email === '' ? 
      <Switch>
        <Route exact path='/register' component={Register}/>
        <Route path='/' component={Login}/>
      </Switch> : 
      <Switch>
        <Route path='/recording' component={Interview} />
        {email === 'admin@gmail.com' ? 
        <Route path='/dashboard' component={Admin} /> : <Route path='/login' component={Login} />}
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/interview' component={Profile} />
        <Route path='/' component={Home} />
      </Switch>
      }
    </Router>
  )
}

export default App