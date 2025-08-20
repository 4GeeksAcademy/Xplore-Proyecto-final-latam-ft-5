import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { WhyUs } from '../components/WhyUs.jsx';
import { Testimonials } from '../components/Testimonials.jsx';
import '../styles/Home.css';

export const Home = () => {
	return (
		<div>
			{/* Aquí puede ir tu Hero Section o Navbar */}

			<Testimonials />
			<WhyUs />

			{/* Aquí puede ir tu Footer u otras secciones */}
		</div>
	);
};