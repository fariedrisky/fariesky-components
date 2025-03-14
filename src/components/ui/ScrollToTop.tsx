"use client";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";

const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	// Show button when page is scrolled up to given distance
	const toggleVisibility = () => {
		if (window.scrollY > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// Set the scroll event listener
	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);

		// Cleanup function
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	// Scroll to top smoothly
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			onClick={scrollToTop}
			className={`hover:bg-primary-hover fixed bottom-4 right-4 z-50 rounded-full bg-primary p-2 shadow-lg transition-all duration-300 ${
				isVisible ? "opacity-100" : "opacity-0"
			} pointer-events-auto`}
			aria-label="Scroll to top"
			style={{ transition: "opacity 0.3s ease" }}
		>
			<FaArrowUp className="h-6 w-6 text-white" />
		</button>
	);
};

export default ScrollToTop;
