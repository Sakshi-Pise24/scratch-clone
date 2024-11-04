import React, { useRef, useState, useEffect, useCallback } from 'react';

const Sprite = ({ 
    id, 
    image, 
    position, 
    rotation, 
    onMove, 
    onRotate, 
    onClick,
    isSelected,
    onDrop
}) => {
    const spriteRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const newX = e.clientX - offset.x;
            const newY = e.clientY - offset.y;
            onMove(id, newX, newY);
        }
    }, [isDragging, offset, onMove, id]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(e);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove]);

    return (
        <div
            ref={spriteRef}
            className={`absolute cursor-pointer select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                left: position.x,
                top: position.y,
                transform: `rotate(${rotation}deg)`,
                width: '50px',
                height: '50px',
                transition: isDragging ? 'none' : 'transform 0.3s ease'
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <img
                src={image}
                alt="sprite"
                className="w-full h-full object-contain"
                draggable="false"
            />
        </div>
    );
};

export default Sprite;