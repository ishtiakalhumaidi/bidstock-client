import React from 'react';
import Hero from './sections/Hero';
import Features from './sections/Features';
import HowItWorks from './sections/HowItWorks';
import FooterCTA from './sections/FooterCTA';

const Home = () => {
    return (
        <div>
            <Hero/>
            <Features/>
            <HowItWorks/>
            <FooterCTA/>
        </div>
    );
};

export default Home;