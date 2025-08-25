
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

import NavBar from "./NavBarXpertos"
import Landing from './BodyXpertos';


export default function HomeXpertos() {
    return (
        <div>
            {/* Aquí puede ir tu Hero Section o Navbar */}
            <NavBar/>
            <Landing/>


            {/* Aquí puede ir tu Footer u otras secciones */}
        </div>
    );
};

