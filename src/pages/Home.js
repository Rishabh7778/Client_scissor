import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import rock from '../assets/fist.png';
import scissor from '../assets/scissors.png';
import paper from '../assets/hand-paper.png';

const socket = io('http://localhost:8000');

const Home = () => {
    const [gameStatus, setGameStatus] = useState('Waiting for players...');
    const [result, setResult] = useState('');
    const [choicesVisible, setChoicesVisible] = useState(false);
    const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
    const [playerName, setPlayerName] = useState('');
    const [waitingMessage, setWaitingMessage] = useState('');
    const [scores, setScores] = useState({ player1: 0, player2: 0 });
    const [waitingForOpponentChoice, setWaitingForOpponentChoice] = useState(false);

    useEffect(() => {
        socket.on('game_start', (message) => {
            setGameStatus(message);
            setChoicesVisible(true);
            setWaitingMessage('');
            setWaitingForOpponentChoice(false);
        });

        socket.on('waiting_for_opponent', (message) => {
            setWaitingMessage(message);
            setWaitingForOpponentChoice(false);
        });

        socket.on('player_names', (names) => {
            setPlayerNames(names);
            setScores(names.scores);
        });

        socket.on('game_over', ({ result, scores }) => {
            setResult(result);
            setScores(scores);
            setChoicesVisible(false);
            setWaitingForOpponentChoice(false);
            setTimeout(() => {
                setResult('');
                setGameStatus('Waiting for next round...');
            }, 3000);
        });

        socket.on('restart', ({ message, scores }) => {
            setGameStatus(message);
            setResult('');
            setScores(scores);
            setChoicesVisible(true);
            setWaitingForOpponentChoice(false);
        });

        return () => {
            socket.off('game_start');
            socket.off('waiting_for_opponent');
            socket.off('player_names');
            socket.off('game_over');
            socket.off('restart');
        };
    }, []);

    const handleSetName = () => {
        if (playerName.trim()) {
            socket.emit('set_name', playerName);
        }
    };

    const handleChoice = (choice) => {
        socket.emit('make_choice', choice);
        setChoicesVisible(false);
        setWaitingForOpponentChoice(true);
    };

    const handleRestart = () => {
        socket.emit('restart_game');
    };

    return (
        <div>
            {!playerNames.player1 || !playerNames.player2 ? (
                <div className='section1'>
                    <h2>Enter your name:</h2>
                    <input 
                        type="text" 
                        value={playerName} 
                        onChange={(e) => setPlayerName(e.target.value)} 
                    />
                    <button className='button1' onClick={handleSetName}>Join Game</button>
                    {waitingMessage && <p>{waitingMessage}</p>}
                </div>
            ) : (
                <>
                    <div className='section2'>
                        <div>
                            <h2>{playerNames.player1}</h2>
                            <p>Score: {playerNames.player1} ({scores.player1})</p>
                        </div>
                        <h1 className='status'>{gameStatus}</h1>
                        <div>
                            <h2>{playerNames.player2}</h2>
                            <p>Score: {playerNames.player2} ({scores.player2})</p>
                        </div>
                    </div>
                    <div className='section3'>
                        {choicesVisible && (
                            <div id="choices">
                                <button className='button-icons' onClick={() => handleChoice('rock')}>
                                    <img src={rock} alt="rock" />
                                </button>
                                <button className='button-icons' onClick={() => handleChoice('paper')}>
                                    <img src={paper} alt="paper" />
                                </button>
                                <button className='button-icons' onClick={() => handleChoice('scissors')}>
                                    <img src={scissor} alt="scissors" />
                                </button>
                            </div>
                        )}
                        
                        {waitingForOpponentChoice && (
                            <div className='section3'>
                                <p>Waiting for opponent's choice...</p>
                            </div>
                        )}

                        <div id="result">
                            {result && <h2>{result}</h2>}
                        </div>

                        <button className='button1' onClick={handleRestart}>Restart Game</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;