import React, { useState, useRef, useEffect } from 'react';
import { ELEMENTS } from '../data/elementData';
import { ElementData } from '../types';
import { getCategoryColor } from '../utils/colors';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface PeriodicTableProps {
  onSelect: (element: ElementData) => void;
}

interface TileProps {
  e: ElementData;
  onSelect: (element: ElementData) => void;
  isFBlock?: boolean;
}

const Tile: React.FC<TileProps> = ({ e, onSelect, isFBlock }) => {
  const color = getCategoryColor(e.category);
  
  let style: React.CSSProperties = {};

  if (!isFBlock) {
    if (e.number === 1) style = { gridRow: 1, gridColumn: 1 };
    else if (e.number === 2) style = { gridRow: 1, gridColumn: 18 };
    else if (e.number >= 3 && e.number <= 4) style = { gridRow: 2, gridColumn: e.number - 2 };
    else if (e.number >= 5 && e.number <= 10) style = { gridRow: 2, gridColumn: e.number + 8 };
    else if (e.number >= 11 && e.number <= 12) style = { gridRow: 3, gridColumn: e.number - 10 };
    else if (e.number >= 13 && e.number <= 18) style = { gridRow: 3, gridColumn: e.number }; 
    else if (e.number >= 19 && e.number <= 36) style = { gridRow: 4, gridColumn: e.number - 18 };
    else if (e.number >= 37 && e.number <= 54) style = { gridRow: 5, gridColumn: e.number - 36 };
    else if (e.number >= 55 && e.number <= 56) style = { gridRow: 6, gridColumn: e.number - 54 };
    else if (e.number >= 72 && e.number <= 86) style = { gridRow: 6, gridColumn: e.number - 68 };
    else if (e.number >= 87 && e.number <= 88) style = { gridRow: 7, gridColumn: e.number - 86 };
    else if (e.number >= 104 && e.number <= 118) style = { gridRow: 7, gridColumn: e.number - 100 };
  }

  return (
    <button
      onClick={(evt) => {
        // Prevent click if we were dragging
        if (evt.defaultPrevented) return;
        onSelect(e);
      }}
      style={style}
      className={`
        relative w-full aspect-square flex flex-col items-center justify-center 
        border border-white/10 rounded-md transition-all duration-200 
        hover:border-white/50 hover:bg-white/10
        group
        ${isFBlock ? 'hover:scale-110 z-10' : 'hover:scale-110 hover:z-20'}
      `}
    >
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity rounded-md" 
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-[0.6rem] absolute top-1 left-1 opacity-70 select-none">{e.number}</span>
      <span className="font-bold text-sm md:text-lg lg:text-xl select-none">{e.symbol}</span>
      <span className="text-[0.6rem] opacity-70 truncate w-full text-center px-1 hidden sm:block select-none">
        {e.name_en}
      </span>
    </button>
  );
};

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pan and Zoom State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for gesture calculations to avoid stale closures in event listeners
  const gesture = useRef({
    startX: 0,
    startY: 0,
    startTransformX: 0,
    startTransformY: 0,
    initialDistance: 0,
    initialScale: 1,
    isPinching: false,
    hasMoved: false
  });

  // Center the table on mount
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = 900; // Min width of table
      
      // If mobile, start zoomed out a bit
      const initialScale = containerWidth < 768 ? (containerWidth / contentWidth) * 0.9 : 0.9;
      const centeredX = (containerWidth - contentWidth * initialScale) / 2;
      const centeredY = 40; // Top padding

      setTransform({ x: centeredX, y: centeredY, scale: initialScale });
    }
  }, []);

  // Mouse Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    gesture.current.startX = e.clientX;
    gesture.current.startY = e.clientY;
    gesture.current.startTransformX = transform.x;
    gesture.current.startTransformY = transform.y;
    gesture.current.hasMoved = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.clientX - gesture.current.startX;
    const dy = e.clientY - gesture.current.startY;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
       gesture.current.hasMoved = true;
    }

    setTransform(prev => ({
      ...prev,
      x: gesture.current.startTransformX + dx,
      y: gesture.current.startTransformY + dy
    }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    // If it was a drag, prevent the click from firing on the button
    if (gesture.current.hasMoved) {
      e.preventDefault();
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(transform.scale + delta, 0.2), 3);
    
    // Zoom towards center of container for simplicity, or mouse position if we wanted complex math
    // Keeping it simple: Zoom center usually works fine for this UI
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  // Touch Handlers for Mobile (Pan & Pinch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      gesture.current.startX = e.touches[0].clientX;
      gesture.current.startY = e.touches[0].clientY;
      gesture.current.startTransformX = transform.x;
      gesture.current.startTransformY = transform.y;
      gesture.current.hasMoved = false;
      gesture.current.isPinching = false;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      gesture.current.isPinching = true;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      gesture.current.initialDistance = dist;
      gesture.current.initialScale = transform.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default browser scrolling
    // e.preventDefault() is handled by CSS touch-action: none usually, but we might need it here depending on browser support
    
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - gesture.current.startX;
      const dy = e.touches[0].clientY - gesture.current.startY;
      
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
         gesture.current.hasMoved = true;
      }

      setTransform(prev => ({
        ...prev,
        x: gesture.current.startTransformX + dx,
        y: gesture.current.startTransformY + dy
      }));
    } else if (gesture.current.isPinching && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = dist / gesture.current.initialDistance;
      const newScale = Math.min(Math.max(gesture.current.initialScale * scaleFactor, 0.2), 3);
      setTransform(prev => ({ ...prev, scale: newScale }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    gesture.current.isPinching = false;
  };

  // Controls
  const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 3) }));
  const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.2) }));
  const reset = () => {
     if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const initialScale = containerWidth < 768 ? (containerWidth / 900) * 0.9 : 0.9;
        const centeredX = (containerWidth - 900 * initialScale) / 2;
        setTransform({ x: centeredX, y: 40, scale: initialScale });
     }
  };

  // Filter Elements
  const isLanthanide = (n: number) => n >= 57 && n <= 71;
  const isActinide = (n: number) => n >= 89 && n <= 103;
  const mainTableElements = ELEMENTS.filter(e => !isLanthanide(e.number) && !isActinide(e.number));
  const lanthanides = ELEMENTS.filter(e => isLanthanide(e.number));
  const actinides = ELEMENTS.filter(e => isActinide(e.number));

  return (
    <div className="w-full h-full flex flex-col items-center">
      
      {/* Floating Controls */}
      <div className="sticky top-20 z-30 flex items-center gap-2 bg-[#1e293b]/90 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-xl mb-4 pointer-events-auto">
        <button onClick={zoomOut} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors" title="Zoom Out"><ZoomOut size={18} /></button>
        <button onClick={zoomIn} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors" title="Zoom In"><ZoomIn size={18} /></button>
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <button onClick={reset} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors" title="Reset View"><RotateCcw size={14} /></button>
        <div className="hidden md:flex items-center gap-1 ml-2 text-xs text-white/30 border-l border-white/10 pl-2">
           <Move size={10} /> <span>Drag to Pan</span>
        </div>
      </div>

      {/* Viewport Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden bg-white/5 border border-white/5 rounded-xl cursor-grab active:cursor-grabbing touch-none shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="absolute origin-top-left will-change-transform"
          style={{ 
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transition: isDragging || gesture.current.isPinching ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div className="min-w-[900px] flex flex-col items-center select-none pb-20">
            {/* Main Grid: 18 Columns */}
            <div 
              className="grid gap-1 md:gap-2 w-full mb-4" 
              style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, 1fr)' }}
            >
              {mainTableElements.map(e => <Tile key={e.number} e={e} onSelect={(el) => !gesture.current.hasMoved && onSelect(el)} />)}
              
              <div style={{ gridRow: 6, gridColumn: 3 }} className="border border-white/10 rounded-md flex items-center justify-center text-xs text-white/40 font-mono">57-71</div>
              <div style={{ gridRow: 7, gridColumn: 3 }} className="border border-white/10 rounded-md flex items-center justify-center text-xs text-white/40 font-mono">89-103</div>
            </div>

            {/* F-Block */}
            <div className="min-w-[900px] mt-6 flex flex-col gap-2 w-full">
              <div className="grid gap-1 md:gap-2" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                  <div className="col-span-2 flex items-center justify-end pr-4 text-xs text-white/30 font-mono tracking-wider">Lanthanides</div>
                  {lanthanides.map(e => <Tile key={e.number} e={e} onSelect={(el) => !gesture.current.hasMoved && onSelect(el)} isFBlock />)}
              </div>
              <div className="grid gap-1 md:gap-2" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                  <div className="col-span-2 flex items-center justify-end pr-4 text-xs text-white/30 font-mono tracking-wider">Actinides</div>
                  {actinides.map(e => <Tile key={e.number} e={e} onSelect={(el) => !gesture.current.hasMoved && onSelect(el)} isFBlock />)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Helper Hint for Mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden bg-black/40 backdrop-blur px-3 py-1 rounded-full text-xs text-white/50 pointer-events-none">
          Pinch to Zoom • Drag to Move
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
