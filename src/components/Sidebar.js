import React, { useState } from 'react';
import MotionBlock from './MotionBlock';

const spriteOptions = [
  { id: 'cat', image: '/MyCat.png', name: 'Cat' },
  { id: 'dog', image: '/Dog.png', name: 'Dog' },
  { id: 'ball', image: '/SmilingBall.jpg', name: 'Ball' },
];

const Sidebar = ({ addSprite, onDragStart }) => {
  const [selectedSprite, setSelectedSprite] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleAddSprite = () => {
    if (selectedSprite) {
      const spriteToAdd = spriteOptions.find(sprite => sprite.image === selectedSprite);
      if (spriteToAdd) {
        addSprite(spriteToAdd);
      }
      setSelectedSprite(null);
      setShowOptions(false);
    }
  };

  const handleBlockDragStart = (e, payload) => {
    e.dataTransfer.setData('action', JSON.stringify(payload));
  };

  return (
    <div className="w-64 bg-gray-100 p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Motion Blocks</h2>
      <MotionBlock onDragStart={handleBlockDragStart} />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Sprites</h2>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {showOptions ? 'Cancel' : 'Add Sprite'}
        </button>
        
        {showOptions && (
          <div className="mt-4 space-y-2">
            {spriteOptions.map(sprite => (
              <div key={sprite.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sprite"
                  onChange={() => setSelectedSprite(sprite.image)}
                />
                <span>{sprite.name}</span>
              </div>
            ))}
            <button
              onClick={handleAddSprite}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Confirm Add Sprite
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;