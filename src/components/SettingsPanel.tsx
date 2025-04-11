
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX } from "lucide-react";

interface SettingsPanelProps {
  ballColor: string;
  setBallColor: (color: string) => void;
  ballSize: number;
  setBallSize: (size: number) => void;
  difficultyLevel: string;
  setDifficultyLevel: (level: string) => void;
  muted: boolean;
  toggleMute: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  ballColor,
  setBallColor,
  ballSize,
  setBallSize,
  difficultyLevel,
  setDifficultyLevel,
  muted,
  toggleMute
}) => {
  const colorOptions = [
    { value: '#fc2bff', label: 'Розовый', class: 'bg-[#fc2bff]' },
    { value: '#2b95ff', label: 'Синий', class: 'bg-[#2b95ff]' },
    { value: '#ffb52b', label: 'Золотой', class: 'bg-[#ffb52b]' },
    { value: '#2bff95', label: 'Зеленый', class: 'bg-[#2bff95]' },
  ];

  return (
    <div className="space-y-6 p-2 text-white">
      {/* Ball Color Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Цвет шарика</h3>
        <div className="flex space-x-3 justify-between">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={`h-10 w-16 rounded-lg ${color.class} ${
                ballColor === color.value ? 'ring-4 ring-white' : 'opacity-70'
              }`}
              onClick={() => setBallColor(color.value)}
            />
          ))}
        </div>
      </div>

      {/* Ball Size Slider */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Размер шарика</h3>
          <span>{ballSize}px</span>
        </div>
        <Slider
          value={[ballSize]}
          min={16}
          max={32}
          step={2}
          onValueChange={(values) => setBallSize(values[0])}
          className="py-2"
        />
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Сложность</h3>
        <RadioGroup
          value={difficultyLevel}
          onValueChange={setDifficultyLevel}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="easy" id="easy" />
            <Label htmlFor="easy" className="text-white">Легко</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-white">Средне</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hard" id="hard" />
            <Label htmlFor="hard" className="text-white">Сложно</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sound Toggle */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Звук</h3>
        <div className="flex items-center space-x-3">
          <Switch
            checked={!muted}
            onCheckedChange={toggleMute}
            id="sound-toggle"
          />
          <Label htmlFor="sound-toggle" className="text-white flex items-center">
            {muted ? <VolumeX className="mr-2" size={18} /> : <Volume2 className="mr-2" size={18} />}
            {muted ? 'Звук выключен' : 'Звук включен'}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
