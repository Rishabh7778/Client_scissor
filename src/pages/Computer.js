import React, { useState } from 'react';
import victorySound from '../assets/victory.mp3'; // Ensure the file is correctly placed in the assets folder

const choices = ['✊', '✋', '✌️'];

const Computer = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ user: 0, computer: 0 });
  const [gameWinner, setGameWinner] = useState(null);

  const winSound = new Audio(victorySound);

  const getComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (user, computer) => {
    if (user === computer) return 'tie';
    if (
      (user === '✊' && computer === '✌️') ||
      (user === '✋' && computer === '✊') ||
      (user === '✌️' && computer === '✋')
    ) {
      return 'user';
    }
    return 'computer';
  };

  const handlePlay = (choice) => {
    if (gameWinner) return;

    const computer = getComputerChoice();
    setUserChoice(choice);
    setComputerChoice(computer);

    const winner = determineWinner(choice, computer);

    setScore(prev => {
      const newScore = { ...prev };
      if (winner === 'user') newScore.user += 1;
      if (winner === 'computer') newScore.computer += 1;

      // Check if anyone has reached 10 points
      if (newScore.user >= 10 || newScore.computer >= 10) {
        setGameWinner(newScore.user >= 10 ? 'user' : 'computer');
        if (newScore.user >= 10) {
          // Play the victory sound when user wins
          winSound.play();
        }
      }

      return newScore;
    });

    // Set the result message after determining the winner
    if (winner === 'user') {
      setResult('You win! 🎉');
    } else if (winner === 'computer') {
      setResult('Computer wins! 😢');
    } else {
      setResult("It's a tie! 🤝");
    }
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setScore({ user: 0, computer: 0 });
    setGameWinner(null);
  };

  return (
    <div className="game-container">
      <div className="choices">
        <div className="choice">
          <h2>You</h2>
          {userChoice || '❔'}
        </div>
        <div className="choice">
          <h2>Computer</h2>
          {computerChoice || '❔'}
        </div>
      </div>

      {gameWinner ? (
        <div className="game-result">
          <h2>{gameWinner === 'user' ? '🎉 You won the game! 🎉' : '😢 Computer won the game! 😢'}</h2>
          <button onClick={resetGame} className="reset-btn">
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="buttons">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handlePlay(choice)}
                className="choice-btn"
                disabled={!!gameWinner}
              >
                {choice}
              </button>
            ))}
          </div>

          <h2 className="result">{result}</h2>
        </>
      )}

      <div className="score">
        <p>Your Score: {score.user}</p>
        <p>Computer Score: {score.computer}</p>
      </div>
    </div>
  );
};

export default Computer;
