
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Settings, Play, Volume2, VolumeX, HelpCircle } from "lucide-react";
import GameBoard from './GameBoard';
import SettingsPanel from './SettingsPanel';

const PlinkoGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ballColor, setBallColor] = useState('#fc2bff');
  const [ballSize, setBallSize] = useState(24);
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(1000);

  const startGame = () => {
    if (coins < 100) {
      toast({
        title: "Недостаточно монет",
        description: "У вас недостаточно монет для начала игры.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlaying(true);
    setCoins(prev => prev - 100);
    toast({
      title: "Игра началась!",
      description: "Наблюдайте за падением шарика и получайте выигрыш!",
    });
  };

  const handleGameEnd = (points: number) => {
    setIsPlaying(false);
    setScore(prev => prev + points);
    setCoins(prev => prev + points);
    
    toast({
      title: "Игра завершена!",
      description: `Вы выиграли ${points} монет!`,
      variant: "default"
    });
  };

  const toggleMute = () => {
    setMuted(!muted);
    toast({
      title: muted ? "Звук включен" : "Звук выключен",
      description: muted ? "Теперь вы будете слышать звуки игры" : "Звуки игры отключены",
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-plinko-gradient py-8 px-4">
      <div className="w-full max-w-4xl">
        {/* Game Header */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-plinko-purple to-plinko-accent animate-glow">
            PLiNKO
          </h1>
          <p className="text-white/80 text-lg mb-4">Испытайте свою удачу!</p>
          
          {/* Stats Bar */}
          <div className="flex items-center justify-between w-full bg-black/30 rounded-lg p-3 mb-4 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="text-plinko-gold font-bold">
                МОНЕТЫ: {coins}
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-plinko-pink font-bold mr-8">
                СЧЁТ: {score}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={toggleMute} 
                  className="bg-white/10 hover:bg-white/20 border-none text-white">
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => setShowRules(true)}
                  className="bg-white/10 hover:bg-white/20 border-none text-white">
                  <HelpCircle size={20} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}
                  className="bg-white/10 hover:bg-white/20 border-none text-white">
                  <Settings size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Board Area */}
        <div className="relative bg-black/30 rounded-xl p-4 backdrop-blur-sm neon-glow">
          <GameBoard
            isPlaying={isPlaying}
            onGameEnd={handleGameEnd}
            ballColor={ballColor}
            ballSize={ballSize}
            difficulty={difficultyLevel}
          />
          
          {/* Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
              <Button 
                className="px-8 py-6 text-xl bg-gradient-to-r from-plinko-accent to-plinko-purple hover:opacity-90 transition-all duration-300 shadow-xl"
                onClick={startGame}
              >
                <Play className="mr-2" size={24} />
                ИГРАТЬ (100 монет)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-plinko-dark border-plinko-purple">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-white">Настройки</DialogTitle>
          </DialogHeader>
          <SettingsPanel 
            ballColor={ballColor}
            setBallColor={setBallColor}
            ballSize={ballSize}
            setBallSize={setBallSize}
            difficultyLevel={difficultyLevel}
            setDifficultyLevel={setDifficultyLevel}
            muted={muted}
            toggleMute={toggleMute}
          />
        </DialogContent>
      </Dialog>

      {/* Game Rules Dialog */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="bg-plinko-dark border-plinko-purple">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-white">Правила игры</DialogTitle>
          </DialogHeader>
          <div className="text-white/90 space-y-4">
            <p>
              PLINKO - это игра на удачу, где шарик падает через поле с колышками и попадает в одну из корзин с разными призами.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Стоимость одной игры - 100 монет</li>
              <li>Шарик случайным образом отскакивает от колышков</li>
              <li>Каждая корзина содержит разный приз:</li>
            </ul>
            <div className="grid grid-cols-5 gap-2 pt-2">
              <div className="text-center text-plinko-gold">2x</div>
              <div className="text-center text-plinko-gold">3x</div>
              <div className="text-center text-plinko-gold">5x</div>
              <div className="text-center text-plinko-gold">3x</div>
              <div className="text-center text-plinko-gold">2x</div>
            </div>
            <p className="text-white/70 italic text-sm">
              Удачи вам в игре! Помните, что это игра на удачу, и результаты полностью случайны.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlinkoGame;
