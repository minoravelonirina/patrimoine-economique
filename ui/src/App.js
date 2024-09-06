import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Possessionss from './pages/possession/possession'
import Menu from './pages/menu/menu'
import Header from './components/header/header'
import CreatePossession from './pages/create/createPossession'
import UpdatePossession from './pages/update/updatePossession'
import Patrimoine from './pages/patrimoine/patrimoine'

export default function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Menu/>} />
        <Route path="/patrimoine" element={<Patrimoine/>} />
        <Route path="/possession" element={<Possessionss/>} />
        <Route path="/createPossession" element={<CreatePossession/>} />
        <Route path="/possession/:libelle" element={<UpdatePossession />} />
      </Routes>
    </Router>
  )
}
