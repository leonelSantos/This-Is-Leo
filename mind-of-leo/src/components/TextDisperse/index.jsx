import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { disperse } from './animation';

export default function TextDipserse({ children, setBackground }) {
  const [isAnimated, setIsAnimated] = useState(false);

  const getChars = (text) => {
    let chars = [];
    // Handle different types of children
    let word = '';
    if (typeof text === 'string') {
      word = text;
    } else if (React.isValidElement(text)) {
      // If it's a React element, extract the text from it
      word = text.props.children;
    } else if (Array.isArray(text)) {
      // If it's an array of elements, join them
      word = text.join('');
    }

    // Make sure word is a string before splitting
    if (typeof word === 'string') {
      word.split("").forEach((char, i) => {
        chars.push(
          <motion.span 
            custom={i} 
            variants={disperse} 
            animate={isAnimated ? "open" : "closed"} 
            key={char + i}
          >
            {char}
          </motion.span>
        );
      });
    }
    return chars;
  };

  const manageMouseEnter = () => {
    setBackground(true);
    setIsAnimated(true);
  };
  
  const manageMouseLeave = () => {
    setBackground(false);
    setIsAnimated(false);
  };

  return (
    <div style={{cursor: "pointer"}} onMouseEnter={() => {manageMouseEnter()}} onMouseLeave={() => {manageMouseLeave(false)}} className='introLine'>
      { getChars(children) }
      </div>
  );
}