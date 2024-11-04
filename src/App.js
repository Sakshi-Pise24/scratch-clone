import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Sprite from './components/Sprite';
import MotionBlock from './components/MotionBlock';

const App = () => {
    const [sprites, setSprites] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [spriteActions, setSpriteActions] = useState({});
    const [selectedSprite, setSelectedSprite] = useState(null);

    const addSprite = (sprite) => {
        const newSpriteId = `${sprite.id}-${Date.now()}`;
        setSprites(prev => [...prev, {
            ...sprite,
            id: newSpriteId,
            position: { x: 50, y: 50 },
            rotation: 0
        }]);
        setSpriteActions(prev => ({
            ...prev,
            [newSpriteId]: []
        }));
    };

    // New function to handle sprite selection
    const handleSpriteClick = (spriteId) => {
        setSelectedSprite(spriteId);
    };

    const handleMove = (id, newX, newY) => {
        setSprites(prevSprites =>
            prevSprites.map(sprite =>
                sprite.id === id ? {
                    ...sprite,
                    position: {
                        x: Math.max(0, Math.min(newX, 750)),
                        y: Math.max(0, Math.min(newY, 550))
                    }
                } : sprite
            )
        );
    };

    const handleRotate = (id, angle) => {
        setSprites(prevSprites =>
            prevSprites.map(sprite =>
                sprite.id === id ? { 
                    ...sprite, 
                    rotation: (sprite.rotation + angle) % 360 
                } : sprite
            )
        );
    };

    const handleAction = (sprite, action) => {
        switch (action.type) {
            case 'move':
                const angleInRadians = sprite.rotation * (Math.PI / 180);
                const deltaX = action.value * Math.cos(angleInRadians);
                const deltaY = action.value * Math.sin(angleInRadians);
                const newX = sprite.position.x + deltaX;
                const newY = sprite.position.y + deltaY;
                handleMove(sprite.id, newX, newY);
                break;
            case 'turn':
                handleRotate(sprite.id, action.value);
                break;
            case 'goto':
                handleMove(sprite.id, action.value.x, action.value.y);
                break;
            case 'repeat':
                const previousActions = spriteActions[sprite.id] || [];
                if (previousActions.length > 0) {
                    const lastAction = previousActions[previousActions.length - 1];
                    const repeatedActions = Array(action.value).fill(lastAction);
                    setSpriteActions(prev => ({
                        ...prev,
                        [sprite.id]: [...previousActions, ...repeatedActions]
                    }));
                }
                break;
            default:
                break;
        }
    };

    const addActionToSprite = (spriteId, action) => {
        setSpriteActions(prev => ({
            ...prev,
            [spriteId]: [...(prev[spriteId] || []), action]
        }));
    };

    // Updated handleDrop to work with workspace and sprite drops
    const handleDrop = (e, targetArea = 'workspace') => {
        e.preventDefault();
        const data = e.dataTransfer.getData('action');
        if (!data) return;
        
        const action = JSON.parse(data);
        
        if (targetArea === 'workspace') {
            // If dropping on workspace, use selected sprite
            if (selectedSprite) {
                addActionToSprite(selectedSprite, action);
            }
        } else {
            // If dropping directly on a sprite
            addActionToSprite(targetArea, action);
        }
    };

    const checkCollision = (sprite1, sprite2) => {
        const tolerance = 50;
        return Math.abs(sprite1.position.x - sprite2.position.x) < tolerance &&
               Math.abs(sprite1.position.y - sprite2.position.y) < tolerance;
    };

    const swapActions = (sprite1Id, sprite2Id) => {
        setSpriteActions(prev => {
            const sprite1Actions = [...(prev[sprite1Id] || [])];
            const sprite2Actions = [...(prev[sprite2Id] || [])];
            
            if (sprite1Actions.length > 0 && sprite2Actions.length > 0) {
                return {
                    ...prev,
                    [sprite1Id]: sprite2Actions,
                    [sprite2Id]: sprite1Actions
                };
            }
            return prev;
        });
    };

    // Animation and collision detection loop
    useEffect(() => {
        if (!isPlaying) return;

        const animationInterval = setInterval(() => {
            setSprites(prevSprites => {
                const newSprites = [...prevSprites];
                
                // Move sprites based on their actions
                newSprites.forEach(sprite => {
                    const currentAction = spriteActions[sprite.id]?.[0];
                    if (currentAction) {
                        handleAction(sprite, currentAction);
                    }
                });

                // Check for collisions
                for (let i = 0; i < newSprites.length; i++) {
                    for (let j = i + 1; j < newSprites.length; j++) {
                        if (checkCollision(newSprites[i], newSprites[j])) {
                            swapActions(newSprites[i].id, newSprites[j].id);
                        }
                    }
                }

                return newSprites;
            });

            // Rotate actions queue for continuous animation
            setSpriteActions(prev => {
                const newActions = { ...prev };
                Object.keys(newActions).forEach(spriteId => {
                    if (newActions[spriteId].length > 0) {
                        const [first, ...rest] = newActions[spriteId];
                        newActions[spriteId] = [...rest, first];
                    }
                });
                return newActions;
            });
        }, 100);

        return () => clearInterval(animationInterval);
    }, [isPlaying]);

    return (
        <div className="flex h-screen">
            <Sidebar 
                addSprite={addSprite} 
                onDragStart={(e, payload) => {
                    e.dataTransfer.setData('action', JSON.stringify(payload));
                }} 
            />
            <div className="flex-1 relative">
                {/* Controls */}
                <div className="absolute top-4 right-4 space-x-4">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-4 py-2 rounded text-white ${
                            isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isPlaying ? 'Stop' : 'Play'}
                    </button>
                </div>

                {/* Workspace */}
                <div
                    className="workspace bg-white m-4"
                    onDrop={(e) => handleDrop(e, 'workspace')}
                    onDragOver={(e) => e.preventDefault()}
                    style={{ 
                        width: '800px', 
                        height: '600px', 
                        border: '2px solid #ccc', 
                        position: 'relative',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    {sprites.map((sprite) => (
                        <Sprite 
                            key={sprite.id}
                            id={sprite.id}
                            image={sprite.image}
                            position={sprite.position}
                            rotation={sprite.rotation}
                            onMove={handleMove}
                            onRotate={handleRotate}
                            onClick={() => handleSpriteClick(sprite.id)}
                            isSelected={selectedSprite === sprite.id}
                            onDrop={(e) => handleDrop(e, sprite.id)}
                        />
                    ))}
                </div>

                {/* Action List */}
                <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow">
                    <h3 className="font-bold mb-2">Sprite Actions</h3>
                    {sprites.map(sprite => (
                        <div 
                            key={sprite.id} 
                            className={`p-2 mb-2 rounded ${
                                selectedSprite === sprite.id ? 'bg-blue-100' : ''
                            }`}
                            onClick={() => handleSpriteClick(sprite.id)}
                        >
                            <div className="font-medium">{sprite.id}</div>
                            <div className="text-sm">
                                Actions: {spriteActions[sprite.id]?.length || 0}
                                {spriteActions[sprite.id]?.map((action, index) => (
                                    <div key={index} className="ml-2 text-gray-600">
                                        {action.type}: {action.value}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;