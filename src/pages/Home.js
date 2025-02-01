import React from 'react';
import home from '../assets/home.jpg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()

    const handleStart = () => {
        navigate('/mode');
    }
    return (
        <div className='homeImg'>
            <img src={home} alt="Home-image" />
            <div className='content'>
                <h1 className="animated-text">Rock Paper Scissor</h1>
                <button onClick={handleStart} >Start</button>
            </div>
        </div>
    );
}
export default Home;
