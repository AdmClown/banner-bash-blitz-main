
import React, { useEffect, useState, useRef } from 'react';

interface GameBoardProps {
  isPlaying: boolean;
  onGameEnd: (points: number) => void;
  ballColor: string;
  ballSize: number;
  difficulty: string;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
}

interface Peg {
  x: number;
  y: number;
}

interface Bucket {
  x: number;
  width: number;
  multiplier: number;
}

const multipliers = [2, 3, 5, 3, 2];

const GameBoard: React.FC<GameBoardProps> = ({ 
  isPlaying, 
  onGameEnd, 
  ballColor,
  ballSize,
  difficulty 
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [pegs, setPegs] = useState<Peg[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });
  const ballIdRef = useRef(0);
  
  // Settings based on difficulty
  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return { pegDensity: 0.8, ballSpeed: 1, gravity: 0.2 };
      case 'hard':
        return { pegDensity: 1.2, ballSpeed: 1.5, gravity: 0.4 };
      case 'medium':
      default:
        return { pegDensity: 1, ballSpeed: 1.2, gravity: 0.3 };
    }
  };
  
  const { pegDensity, ballSpeed, gravity } = getDifficultySettings();

  // Initialize the board dimensions and create pegs
  useEffect(() => {
    if (boardRef.current) {
      const width = boardRef.current.clientWidth;
      const height = boardRef.current.clientHeight;
      setBoardDimensions({ width, height });
      
      // Create pegs in a grid pattern
      const newPegs: Peg[] = [];
      const pegRadius = 8;
      const horizontalSpacing = width / 9;
      const verticalSpacing = height / 15;
      const startY = height * 0.15;
      
      // Create 10 rows of pegs with alternating offsets
      for (let row = 0; row < 10; row++) {
        const offsetX = row % 2 === 0 ? 0 : horizontalSpacing / 2;
        const pegsInRow = row % 2 === 0 ? 9 : 8;
        
        for (let col = 0; col < pegsInRow; col++) {
          newPegs.push({
            x: offsetX + col * horizontalSpacing + pegRadius,
            y: startY + row * verticalSpacing + pegRadius
          });
        }
      }
      
      setPegs(newPegs);
      
      // Create buckets at the bottom
      const newBuckets: Bucket[] = [];
      const bucketWidth = width / 5;
      
      for (let i = 0; i < 5; i++) {
        newBuckets.push({
          x: i * bucketWidth,
          width: bucketWidth,
          multiplier: multipliers[i]
        });
      }
      
      setBuckets(newBuckets);
    }
    
    // Cleanup function
    return () => {
      setBalls([]);
    };
  }, []);
  
  // Start the game when isPlaying changes to true
  useEffect(() => {
    if (isPlaying && boardDimensions.width > 0) {
      // Create a new ball at the top center
      const newBall: Ball = {
        x: boardDimensions.width / 2,
        y: 20,
        vx: (Math.random() - 0.5) * 1,  // Small random initial horizontal velocity
        vy: 0,                          // Start with zero vertical velocity
        id: ballIdRef.current++
      };
      
      setBalls([newBall]);
    }
  }, [isPlaying, boardDimensions]);
  
  // Game physics update loop
  useEffect(() => {
    if (balls.length === 0 || !isPlaying) return;
    
    const updateInterval = setInterval(() => {
      setBalls(prevBalls => {
        // Fix: Explicitly type the mapped array to ensure it returns Ball[]
        const updatedBalls: Ball[] = prevBalls.map(ball => {
          // Apply gravity
          let newVy = ball.vy + gravity * ballSpeed;
          let newVx = ball.vx;
          let newX = ball.x + newVx;
          let newY = ball.y + newVy;
          
          // Ball-wall collision
          if (newX < ballSize/2) {
            newX = ballSize/2;
            newVx = -newVx * 0.7;  // Bounce with some energy loss
          } else if (newX > boardDimensions.width - ballSize/2) {
            newX = boardDimensions.width - ballSize/2;
            newVx = -newVx * 0.7;  // Bounce with some energy loss
          }
          
          // Check ball-peg collisions
          pegs.forEach(peg => {
            const dx = newX - peg.x;
            const dy = newY - peg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ballSize/2 + 8;  // Ball radius + peg radius
            
            if (distance < minDistance) {
              // Calculate bounce direction
              const angle = Math.atan2(dy, dx);
              
              // Move ball outside of collision
              const overlapDistance = minDistance - distance;
              newX += Math.cos(angle) * overlapDistance * 1.01;
              newY += Math.sin(angle) * overlapDistance * 1.01;
              
              // Calculate new velocity (bounce)
              const bounceAngle = Math.atan2(dy, dx);
              const speed = Math.sqrt(newVx * newVx + newVy * newVy) * 0.75;  // Reduce speed slightly
              
              // Add some randomness to the bounce
              const randomAngleOffset = (Math.random() - 0.5) * 0.5;
              const finalBounceAngle = bounceAngle + randomAngleOffset;
              
              newVx = Math.cos(finalBounceAngle) * speed;
              newVy = Math.sin(finalBounceAngle) * speed;
            }
          });
          
          // Check if ball has reached a bucket
          if (newY > boardDimensions.height - 30) {
            // Find which bucket the ball is in
            let bucketIndex = -1;
            for (let i = 0; i < buckets.length; i++) {
              if (newX >= buckets[i].x && newX < buckets[i].x + buckets[i].width) {
                bucketIndex = i;
                break;
              }
            }
            
            if (bucketIndex !== -1) {
              const winAmount = 100 * buckets[bucketIndex].multiplier;
              // End the game and pass the points won
              setTimeout(() => {
                onGameEnd(winAmount);
              }, 500);
              return [];  // Remove the ball
            }
          }
          
          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        });
        
        return updatedBalls;
      });
    }, 16);  // ~60fps
    
    return () => clearInterval(updateInterval);
  }, [balls, isPlaying, pegs, buckets, boardDimensions, onGameEnd, ballSize, ballSpeed, gravity]);
  
  return (
    <div 
      ref={boardRef} 
      className="plinko-game-board w-full h-[600px]"
    >
      {/* Render pegs */}
      {pegs.map((peg, index) => (
        <div 
          key={`peg-${index}`}
          className="plinko-peg"
          style={{
            left: `${peg.x - 8}px`,
            top: `${peg.y - 8}px`
          }}
        />
      ))}
      
      {/* Render buckets */}
      {buckets.map((bucket, index) => (
        <div 
          key={`bucket-${index}`}
          className="plinko-bucket"
          style={{
            left: `${bucket.x}px`,
            width: `${bucket.width}px`
          }}
        >
          <span className="text-plinko-gold text-2xl font-bold animate-bounce-slow">
            {bucket.multiplier}x
          </span>
        </div>
      ))}
      
      {/* Render balls */}
      {balls.map(ball => (
        <div 
          key={`ball-${ball.id}`}
          className="plinko-ball"
          style={{
            left: `${ball.x - ballSize/2}px`,
            top: `${ball.y - ballSize/2}px`,
            width: `${ballSize}px`,
            height: `${ballSize}px`,
            background: ballColor,
            transform: `rotate(${ball.vx * 20}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default GameBoard;
