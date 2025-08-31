import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { WhyUs } from '../components/WhyUs.jsx';
import { Testimonials } from '../components/Testimonials.jsx';
import '../styles/Home.css';
import { Jumbotron } from "../components/Jumbotron.jsx";
import HomeDiscover from './../components/HomeDiscover';


export const Home = () => {
	return (
		<div>
			{/* Aquí puede ir tu Hero Section o Navbar */}

			{/* Aquí puede ir tu Jumbotron u otras secciones */}
			<Jumbotron />
			<HomeDiscover />
			<Testimonials />
			<WhyUs />

			{/* Aquí puede ir tu Footer u otras secciones */}
		</div>
	);
};