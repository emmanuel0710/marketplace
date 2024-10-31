import {  Link } from 'react-router-dom';

export default function Navbar(){
    return (
 
        <header className="header">
          <div className="nav-logo">
            <p>SECOND-HAND MARKETPLACE</p>
          </div>


          <nav className="navbar">
          <Link to="/" >Home</Link>
        <Link to="">About</Link>
        <Link to="">Products</Link>
        <Link to="/Login" className="btn">Sign In</Link>
      </nav>
      
          <div className="icons">
            <div className="fas fa-search" id="search-btn"></div>
            <div className="fas fa-bars" id="menu-btn"></div>
          </div>

          <div className="search-form">
            <input type="search" id="search-box" placeholder="Search here..." />
            <label htmlFor="search-box" className="fas fa-search"></label>
          </div>
        </header>

    )
}