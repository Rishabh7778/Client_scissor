import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import rock from '../assets/fist.png';
import scissor from '../assets/scissors.png';
import paper from '../assets/hand-paper.png';
import victorySound from '../assets/victory.mp3';
import { useNavigate } from 'react-router-dom';

const socket = io('https://server-rock-paper-scissor.onrender.com');

const Online = () => {
    const navigate = useNavigate();
    const [gameStatus, setGameStatus] = useState('Waiting for players...');
    const [result, setResult] = useState('');
    const [choicesVisible, setChoicesVisible] = useState(false);
    const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
    const [playerName, setPlayerName] = useState('');
    const [waitingMessage, setWaitingMessage] = useState('');
    const [scores, setScores] = useState({ player1: 0, player2: 0 });
    const [waitingForOpponentChoice, setWaitingForOpponentChoice] = useState(false);
    const [gameWinner, setGameWinner] = useState(null);
    const [joined, setJoined] = useState(false);
    const [playerChoice, setPlayerChoice] = useState(null);
    const [opponentChoice, setOpponentChoice] = useState(null);


    
    useEffect(() => {
        const winnerSound = new Audio(victorySound);
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
            setScores({ player1: 0, player2: 0 }); 
        });

        socket.on('game_over', ({ result, scores }) => {
            setResult(result);
            setScores(scores);
            setChoicesVisible(false);
            setWaitingForOpponentChoice(false);

            setTimeout(() => {
                setResult('');
                setGameStatus('Game is started');
                setChoicesVisible(true);
            }, 3000);
        });

        socket.on('game_winner', ({ winner }) => {
            setGameWinner(winner);
            setResult(`${winner} wins the game! 🏆`);
            setChoicesVisible(false);
            setWaitingForOpponentChoice(false);
            setGameStatus('Game Over!');

            // Play the winner sound when a winner is announced
            winnerSound.play().catch((error) => {
                console.error("Error playing sound:", error);
            });
        });

        socket.on('restart', ({ message, scores }) => {
            setGameWinner(null);
            setGameStatus(message);
            setResult('');
            setScores(scores);
            setChoicesVisible(true);
            setWaitingForOpponentChoice(false);
        });

        socket.on('opponent_choice', (choice) => {
            setOpponentChoice(choice);
            setWaitingForOpponentChoice(false);  // Stop showing waiting message when both choices are made
        });

        return () => {
            socket.off('game_start');
            socket.off('waiting_for_opponent');
            socket.off('player_names');
            socket.off('game_over');
            socket.off('game_winner');
            socket.off('restart');
            socket.off('opponent_choice');
        };
    }, []);

    const handleSetName = () => {
        if (playerName.trim() && !joined) {
            socket.emit('set_name', playerName);
            setJoined(true);
        }
    };

    const handleChoice = (choice) => {
        setPlayerChoice(choice);  // Set the player's choice
        socket.emit('make_choice', choice);
        setChoicesVisible(false);
        setWaitingForOpponentChoice(true);
    };

    const handleRestart = () => {
        socket.emit('restart_game');
        setJoined(false);
    };

    const handleBack = () => {
        navigate('/mode')
    }

    // Reset choices after a delay
    useEffect(() => {
        if (playerChoice && opponentChoice) {
            setTimeout(() => {
                setPlayerChoice(null);
                setOpponentChoice(null);
            }, 3000); // Reset after 1 second
        }
    }, [playerChoice, opponentChoice]);

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
                    <button className='button1' onClick={handleSetName} disabled={joined}>Join Game</button>
                    {waitingMessage && <p>{waitingMessage}</p>}
                </div>
            ) : (
                <>
                    <div className='section2'>
                        <div>
                            <h2>{playerNames.player1}</h2>
                            <p>Score: {scores.player1}</p>
                        </div>
                        <h1 className='status'>{gameStatus}</h1>
                        <div>
                            <h2>{playerNames.player2}</h2>
                            <p>Score: {scores.player2}</p>
                        </div>
                    </div>
                    <div className='section3'>
                        {choicesVisible && !gameWinner && (
                            <div id="choices">
                                <button className='button-icons' onClick={() => handleChoice('rock')}>
                                    <img src={rock} alt="rock" />Scissor
                                </button>
                                <button className='button-icons' onClick={() => handleChoice('paper')}>
                                    <img src={paper} alt="paper" />Paper
                                </button>
                                <button className='button-icons' onClick={() => handleChoice('scissors')}>
                                    <img src={scissor} alt="scissors" />Rock
                                </button>
                            </div>
                        )}

                        {waitingForOpponentChoice && !opponentChoice && (
                            <p>Waiting for opponent's choice...</p>
                        )}

                        <div id="result">
                            {result && <h2>{result}</h2>}
                        </div>

                        {/* Explicit check for both player and opponent choice */}
                        {playerChoice !== null && opponentChoice !== null && (
                            <div>
                                <h3>Your Choice: {playerChoice}</h3>
                                <h3>Opponent's Choice: {opponentChoice}</h3>
                            </div>
                        )}

                        {gameWinner && (scores.player1 === 10 || scores.player2 === 10) && (
                            <>
                                <button className='button1' onClick={handleRestart}>Play Again</button>
                                <button className='button1' onClick={handleBack}>Back</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Online;
