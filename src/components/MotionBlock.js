import React, { useState } from 'react';

const MotionBlock = ({ onDragStart }) => {
  const [steps, setSteps] = useState(10);
  const [degrees, setDegrees] = useState(90);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [repeat, setRepeat] = useState(1);

  const handleDragStart = (e, type) => {
    const payload = {
      type: type,
      value: type === 'move' ? steps :
             type === 'turn' ? degrees :
             type === 'goto' ? coordinates :
             type === 'repeat' ? repeat : null
    };
    onDragStart(e, payload);
  };

  return (
    <div className="space-y-2 p-4 bg-white rounded-lg shadow">
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'move')}
        className="flex items-center space-x-2 p-2 bg-blue-100 rounded cursor-move hover:bg-blue-200"
      >
        <span>Move</span>
        <input
          type="number"
          value={steps}
          onChange={(e) => setSteps(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded"
          onClick={(e) => e.stopPropagation()}
        />
        <span>steps</span>
      </div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'turn')}
        className="flex items-center space-x-2 p-2 bg-blue-100 rounded cursor-move hover:bg-blue-200"
      >
        <span>Turn</span>
        <input
          type="number"
          value={degrees}
          onChange={(e) => setDegrees(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded"
          onClick={(e) => e.stopPropagation()}
        />
        <span>degrees</span>
      </div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'goto')}
        className="flex items-center space-x-2 p-2 bg-blue-100 rounded cursor-move hover:bg-blue-200"
      >
        <span>Go to</span>
        <span>x:</span>
        <input
          type="number"
          value={coordinates.x}
          onChange={(e) => setCoordinates(prev => ({ ...prev, x: Number(e.target.value) }))}
          className="w-16 px-2 py-1 border rounded"
          onClick={(e) => e.stopPropagation()}
        />
        <span>y:</span>
        <input
          type="number"
          value={coordinates.y}
          onChange={(e) => setCoordinates(prev => ({ ...prev, y: Number(e.target.value) }))}
          className="w-16 px-2 py-1 border rounded"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'repeat')}
        className="flex items-center space-x-2 p-2 bg-blue-100 rounded cursor-move hover:bg-blue-200"
      >
        <span>Repeat</span>
        <input
          type="number"
          value={repeat}
          onChange={(e) => setRepeat(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded"
          onClick={(e) => e.stopPropagation()}
        />
        <span>times</span>
      </div>
    </div>
  );
};

export default MotionBlock;