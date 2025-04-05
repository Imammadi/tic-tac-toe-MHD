document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const status = document.getElementById('status');
  const resetButton = document.getElementById('reset');
  const gameContainer = document.getElementById('game');
  const flash = document.getElementById('flash');
  const speedLines = document.getElementById('speedLines');

  // Create particles container
  const particlesContainer = document.createElement('div');
  particlesContainer.classList.add('particles');
  document.body.appendChild(particlesContainer);

  // Create speed lines
  for (let i = 0; i < 20; i++) {
    const line = document.createElement('div');
    line.classList.add('speed-line');
    line.style.top = `${Math.random() * 100}%`;
    line.style.width = `${50 + Math.random() * 150}px`;
    line.style.animationDuration = `${1 + Math.random() * 2}s`;
    line.style.animationDelay = `${Math.random() * 2}s`;
    speedLines.appendChild(line);
  }

  let currentPlayer = 'x';
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // Create win line elements
  winningConditions.forEach((condition, index) => {
    const line = document.createElement('div');
    line.classList.add('win-line');
    line.id = `line-${index}`;

    // Set line position and dimensions based on the winning condition
    if (index < 3) {
      // Horizontal lines
      line.style.width = '370px';
      line.style.height = '5px';
      line.style.top = `${55 + index * 110}px`;
      line.style.left = '0';
      line.style.background =
        'linear-gradient(90deg, #8a2be2, #e94560, #8a2be2)';
      line.style.backgroundSize = '200% 100%';
    } else if (index < 6) {
      // Vertical lines
      line.style.width = '5px';
      line.style.height = '320px';
      line.style.left = `${55 + (index - 3) * 110}px`;
      line.style.top = '0';
      line.style.background =
        'linear-gradient(0deg, #8a2be2, #e94560, #8a2be2)';
      line.style.backgroundSize = '100% 200%';
    } else if (index === 6) {
      // Diagonal top-left to bottom-right
      line.style.width = '5px';
      line.style.height = '450px';
      line.style.left = '155px';
      line.style.top = '-65px';
      line.style.background =
        'linear-gradient(45deg, #8a2be2, #e94560, #8a2be2)';
      line.style.backgroundSize = '200% 200%';
      line.style.transform = 'rotate(45deg) scale(0)';
    } else {
      // Diagonal top-right to bottom-left
      line.style.width = '5px';
      line.style.height = '450px';
      line.style.left = '155px';
      line.style.top = '-65px';
      line.style.background =
        'linear-gradient(45deg, #8a2be2, #e94560, #8a2be2)';
      line.style.backgroundSize = '200% 200%';
      line.style.transform = 'rotate(-45deg) scale(0)';
    }

    gameContainer.appendChild(line);
  });

  // Initialize grid lines
  setTimeout(() => {
    gameContainer.classList.add('active');
  }, 500);

  // Create particles effect
  const createParticles = (x, y, color = '#8a2be2', count = 20) => {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      // Randomize properties
      const size = 3 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      const distance = 30 + Math.random() * 50;
      const life = 500 + Math.random() * 1000;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.boxShadow = `0 0 ${size}px ${color}`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      particlesContainer.appendChild(particle);

      // Animate the particle
      const endX = x + Math.cos(angle) * distance;
      const endY = y + Math.sin(angle) * distance;

      // Create animation
      particle.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          {
            transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: life,
          easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        }
      );

      // Remove the particle after animation
      setTimeout(() => {
        particle.remove();
      }, life);
    }
  };

  // Flash effect with bubuuh
  const flashEffect = () => {
    flash.style.opacity = '1';

    // Activate speed lines
    document.querySelectorAll('.speed-line').forEach((line) => {
      line.style.opacity = '0.7';
    });

    // Create a subtle shake
    document.body.animate(
      [
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' },
      ],
      {
        duration: 500,
        easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      }
    );

    setTimeout(() => {
      flash.style.opacity = '0';

      // Deactivate speed lines gradually
      setTimeout(() => {
        document.querySelectorAll('.speed-line').forEach((line) => {
          line.style.opacity = '0';
        });
      }, 1000);
    }, 300);
  };

  const cellClicked = (event) => {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;

    // Add the class for the current player
    cell.classList.add(currentPlayer);

    // Get cell position for effects
    const rect = cell.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create particles effect
    const particleColor = currentPlayer === 'x' ? '#e94560' : '#8a2be2';
    createParticles(centerX, centerY, particleColor, 15);

    // Flash effect
    flashEffect();

    setTimeout(() => {
      cell.classList.add('active');
    }, 50);

    // Activate speed lines for a moment
    document.querySelectorAll('.speed-line').forEach((line) => {
      line.style.opacity = '0.4';
      setTimeout(() => {
        line.style.opacity = '0';
      }, 800);
    });

    // Check if the game has been won
    const result = checkWinner();

    if (result.winner) {
      gameActive = false;

      // Highlight the winning cells and show the line
      const winLine = document.getElementById(`line-${result.lineIndex}`);
      winLine.classList.add('active');

      // Activate all speed lines
      document.querySelectorAll('.speed-line').forEach((line) => {
        line.style.opacity = '0.7';
      });

      // Big flash and particles effect for win - BUBUUH!
      setTimeout(() => {
        flashEffect();

        result.line.forEach((index) => {
          const winCell = cells[index];
          winCell.classList.add('win-animation');

          const cellRect = winCell.getBoundingClientRect();
          createParticles(
            cellRect.left + cellRect.width / 2,
            cellRect.top + cellRect.height / 2,
            result.winner === 'x' ? '#e94560' : '#8a2be2',
            30
          );
        });

        // Bigger bubuuh effect
        gameContainer.animate(
          [
            { transform: 'scale(1) rotate(0deg)' },
            { transform: 'scale(1.05) rotate(1deg)' },
            { transform: 'scale(1) rotate(0deg)' },
          ],
          {
            duration: 500,
            easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)',
          }
        );
      }, 300);

      status.textContent =
        result.winner === 'draw'
          ? 'НИЧЬЯ!'
          : `ИГРОК ${currentPlayer.toUpperCase()} ПОБЕДИЛ!`;
    } else {
      currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
      status.textContent = `ИГРОК ${currentPlayer.toUpperCase()} ХОДИТ`;
    }
  };

  const checkWinner = () => {
    let winner = null;
    let winLine = null;
    let lineIndex = null;

    // Check if there's a winner
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];

      if (
        gameState[a] !== '' &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c]
      ) {
        winner = gameState[a];
        winLine = [a, b, c];
        lineIndex = i;
        break;
      }
    }

    // Check for a draw
    if (!winner && !gameState.includes('')) {
      winner = 'draw';
    }

    return {
      winner,
      line: winLine,
      lineIndex,
    };
  };

  const resetGame = () => {
    currentPlayer = 'x';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = `ИГРОК X ХОДИТ`;

    // Big bubuuh effect on reset
    flashEffect();

    // Particles burst from the center
    const gameBounds = gameContainer.getBoundingClientRect();
    const centerX = gameBounds.left + gameBounds.width / 2;
    const centerY = gameBounds.top + gameBounds.height / 2;

    createParticles(centerX, centerY, '#8a2be2', 40);

    // Speed lines effect
    document.querySelectorAll('.speed-line').forEach((line) => {
      line.style.opacity = '1';
      setTimeout(() => {
        line.style.opacity = '0';
      }, 1000);
    });

    // Remove marks from cells with animation
    cells.forEach((cell) => {
      if (cell.classList.contains('active')) {
        cell.classList.remove('active');

        // Delay the complete removal to allow for exit animation
        setTimeout(() => {
          cell.classList.remove('x', 'o', 'win-animation');
        }, 300);
      } else {
        cell.classList.remove('x', 'o', 'win-animation');
      }
    });

    // Hide win lines
    document.querySelectorAll('.win-line').forEach((line) => {
      line.classList.remove('active');
    });

    // Reset grid animation
    gameContainer.classList.remove('active');
    setTimeout(() => {
      gameContainer.classList.add('active');
    }, 100);
  };

  // Initial speed lines effect
  setTimeout(() => {
    document.querySelectorAll('.speed-line').forEach((line) => {
      line.style.opacity = '0.7';
      setTimeout(() => {
        line.style.opacity = '0';
      }, 1500);
    });

    // Initial particles
    const gameBounds = gameContainer.getBoundingClientRect();
    createParticles(
      gameBounds.left + gameBounds.width / 2,
      gameBounds.top + gameBounds.height / 2,
      '#8a2be2',
      20
    );
  }, 300);

  // Add event listeners
  cells.forEach((cell) => {
    cell.addEventListener('click', cellClicked);
  });

  resetButton.addEventListener('click', resetGame);
});
