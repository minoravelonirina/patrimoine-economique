import React from 'react'
import { Button } from 'react-bootstrap'
import './header.css'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='header'>
        <Link to="/patrimoine"><Button className='boutton-patrimoine'>Patrimoine</Button></Link>
        <Link to="/possession"><Button className='boutton-possession'>Possessions</Button></Link>
        <Link to="/createPossession"><Button className='boutton-add'>New Possession</Button></Link>
    </div>
  )
}
