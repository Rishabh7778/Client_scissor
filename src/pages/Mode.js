import React from 'react';
import { useNavigate } from 'react-router-dom';

const Mode = () => {
    const navigate = useNavigate();

    const handleOnline = () =>{
        navigate('/Online');
    }

    const handleOffline = () =>{
        navigate('/Computer');
    }

    return (
        <div className='mode'>
            <h1>Please Select a Mode</h1>
            <button onClick={handleOnline} className="btn">Play Online</button>
            <button onClick={handleOffline}  className="btn">Play Computer</button>
        </div>
    );
}

export default Mode;
