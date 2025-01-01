// src/components/CustomTooltip.jsx
import React, { useState, useRef, useEffect } from 'react';

const CustomTooltip = ({ children, content, direction = 'top', delay = 200 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);
    const tooltipRef = useRef(null);
    const containerRef = useRef(null);


    const showTooltip = () => {
         timeoutRef.current = setTimeout(() => {
             setIsVisible(true)
          }, delay)
    }
    const hideTooltip = () => {
          clearTimeout(timeoutRef.current);
         setIsVisible(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
           if(containerRef.current && !containerRef.current.contains(event.target)){
                hideTooltip();
           }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
             document.removeEventListener('mousedown', handleClickOutside)
         }
    }, []);


    let tooltipPosition = {};
      if (tooltipRef.current && containerRef.current) {
           const containerRect = containerRef.current.getBoundingClientRect();
           const tooltipRect = tooltipRef.current.getBoundingClientRect();
             switch (direction) {
                case 'top':
                    tooltipPosition = {
                         bottom: containerRect.top - tooltipRect.height - 5,
                      };
                    break;
               case 'bottom':
                    tooltipPosition = {
                         top: containerRect.bottom + 5,
                       };
                    break;
                case 'left':
                    tooltipPosition = {
                          right: containerRect.left - tooltipRect.width - 5,
                         };
                    break;
               case 'right':
                   tooltipPosition = {
                         left: containerRect.right + 5,
                     };
                   break;
                default:
                     tooltipPosition = {
                       bottom: containerRect.top - tooltipRect.height - 5,
                      };
            }
    }
     const tooltipClass = isVisible ? "absolute z-10  bg-gray-800 text-white p-2 rounded shadow-md" : 'hidden';
    return (
        <div
            className="relative inline-block"
             ref={containerRef}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
             {children}
             <div
                 ref={tooltipRef}
               className={tooltipClass}
                 style={{ ...tooltipPosition}}
            >
                 {content}
            </div>
        </div>
    );
};

export default CustomTooltip;