import React, { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

// Types
type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  category: string;
  rating: number;
  amazonLink?: string;
};

interface BookImageAnimationProps {
  books: Book[];
}

const BookImageAnimation: React.FC<BookImageAnimationProps> = ({ books }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const panelImgRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Track state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize any external scripts if necessary
    const preloadImages = () => {
      return new Promise((resolve) => {
        const images = document.querySelectorAll('.grid__item-image');
        // Basic preloading
        let loaded = 0;
        const total = images.length;
        
        if (total === 0) resolve(true);
        
        images.forEach((img) => {
          const background = window.getComputedStyle(img as Element).backgroundImage;
          if (background !== 'none') {
            const tempImg = new Image();
            tempImg.onload = () => {
              loaded++;
              if (loaded === total) resolve(true);
            };
            tempImg.onerror = () => {
              loaded++;
              if (loaded === total) resolve(true);
            };
            tempImg.src = background.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
          } else {
            loaded++;
            if (loaded === total) resolve(true);
          }
        });
      });
    };

    preloadImages().then(() => {
      document.body.classList.remove('loading');
      setIsLoading(false);
    });

    return () => {
      // Cleanup
      gsap.killTweensOf('*');
    };
  }, []);

  // Get center of an element
  const getElementCenter = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  // Position the panel based on click position
  const positionPanelBasedOnClick = (clickedItem: HTMLElement) => {
    const centerX = getElementCenter(clickedItem).x;
    const windowHalf = window.innerWidth / 2;

    const isLeftSide = centerX < windowHalf;
    setPanelSide(isLeftSide ? 'right' : 'left');
  };

  // Generate movers between start and end elements
  const generateMotionPath = (startRect: DOMRect, endRect: DOMRect, steps: number) => {
    const path = [];
    const fullSteps = steps + 2;
    
    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };
    
    const endCenter = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    };

    // Linear interpolation helper
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    for (let i = 0; i < fullSteps; i++) {
      const t = i / (fullSteps - 1);
      const width = lerp(startRect.width, endRect.width, t);
      const height = lerp(startRect.height, endRect.height, t);
      const centerX = lerp(startCenter.x, endCenter.x, t);
      const centerY = lerp(startCenter.y, endCenter.y, t);

      // Apply a slight sine wave motion for visual interest
      const sineOffset = Math.sin(t * Math.PI) * 20;

      path.push({
        left: centerX - width / 2,
        top: centerY - height / 2 + sineOffset,
        width,
        height,
      });
    }

    // Return all path points except first and last (which are the start and end elements)
    return path.slice(1, -1);
  };

  // Handle grid item click
  const handleItemClick = (e: React.MouseEvent<HTMLElement>, book: Book) => {
    if (isAnimating || isPanelOpen) return;
    
    setIsAnimating(true);
    setCurrentBook(book);
    
    const item = e.currentTarget;
    positionPanelBasedOnClick(item);
    
    // Get image element within the clicked item
    const imgEl = item.querySelector('.grid__item-image') as HTMLElement;
    const panelImg = panelImgRef.current;
    
    if (!imgEl || !panelImg || !gridRef.current || !panelRef.current || !frameRef.current) {
      setIsAnimating(false);
      return;
    }
    
    // Hide frame
    gsap.to(frameRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'sine.inOut',
      pointerEvents: 'none',
    });
    
    // Set up animation constants
    const STEPS = 5;
    const STEP_DURATION = 0.3;
    const STEP_INTERVAL = 0.05;
    
    // Create path for animation
    const path = generateMotionPath(
      imgEl.getBoundingClientRect(),
      panelImg.getBoundingClientRect(),
      STEPS
    );
    
    // Prepare movers container
    const moversContainer = document.createElement('div');
    moversContainer.className = 'movers-container';
    document.body.appendChild(moversContainer);
    
    // Create and animate movers
    path.forEach((step, index) => {
      const mover = document.createElement('div');
      mover.className = 'mover';
      gsap.set(mover, {
        backgroundImage: `url(${book.coverImage})`,
        position: 'fixed',
        left: step.left,
        top: step.top,
        width: step.width,
        height: step.height,
        clipPath: 'inset(100% 0% 0% 0%)',
        zIndex: 1000 + index,
        backgroundPosition: '50% 50%',
        backgroundSize: 'cover',
        rotationZ: gsap.utils.random(-5, 5),
      });
      moversContainer.appendChild(mover);

      const delay = index * STEP_INTERVAL;
      gsap
        .timeline({ delay })
        .fromTo(
          mover,
          { opacity: 0.4, clipPath: 'inset(100% 0% 0% 0%)' },
          {
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: STEP_DURATION,
            ease: 'sine.in',
          }
        )
        .to(
          mover,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: STEP_DURATION,
            ease: 'sine',
          },
          '+=0.1'
        );
    });
    
    // Fade out grid items
    gsap.to('.grid__item', {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'sine',
      stagger: 0.02,
    });
    
    // Reveal the panel
    gsap.set(panelContentRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 1, pointerEvents: 'auto' });
    
    gsap
      .timeline({
        defaults: {
          duration: STEP_DURATION * 2,
          ease: 'sine.inOut',
        },
        onComplete: () => {
          setIsAnimating(false);
          setIsPanelOpen(true);
          // Remove movers after animation
          setTimeout(() => {
            moversContainer.remove();
          }, 500);
        },
      })
      .fromTo(
        panelImg,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          pointerEvents: 'auto',
          delay: STEPS * STEP_INTERVAL,
        }
      )
      .fromTo(
        panelContentRef.current,
        { y: 25 },
        {
          duration: 1,
          ease: 'expo',
          opacity: 1,
          y: 0,
        },
        '<-=0.2'
      );
  };

  // Reset view (close panel)
  const resetView = () => {
    if (isAnimating || !isPanelOpen) return;
    setIsAnimating(true);
    
    if (!panelRef.current || !frameRef.current) {
      setIsAnimating(false);
      return;
    }
    
    gsap
      .timeline({
        defaults: { duration: 0.3, ease: 'expo' },
        onComplete: () => {
          setIsAnimating(false);
          setIsPanelOpen(false);
          setCurrentBook(null);
        },
      })
      .to(panelRef.current, { opacity: 0 })
      .add(() => {
        // Show frame
        gsap.to(frameRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: 'sine.inOut',
          pointerEvents: 'auto',
        });
      }, 0)
      .set(panelRef.current, { opacity: 0, pointerEvents: 'none' })
      .set(panelImgRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })
      .set('.grid__item', { clipPath: 'none' })
      .to('.grid__item', {
        opacity: 1,
        scale: 1,
        stagger: 0.02,
      });
  };

  // Simple StarRating component
  const StarRating = ({ rating, className = '' }: { rating: number, className?: string }) => {
    return (
      <div className={`flex ${className}`}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-bar"></div>
          <p>Loading book collection...</p>
        </div>
      ) : (
        <>
          {/* Frame */}
          <div ref={frameRef} className="frame">
            <div className="heading">
              <h1 className="heading__title">Book Collection</h1>
              <div className="heading__meta">
                A curated selection of books that have influenced me
              </div>
            </div>
          </div>
      
          {/* Grid */}
          <div ref={gridRef} className="grid">
            {books.map((book) => (
              <figure 
                key={book.id} 
                className="grid__item" 
                onClick={(e) => handleItemClick(e, book)}
              >
                <div 
                  className="grid__item-image" 
                  style={{ backgroundImage: `url(${book.coverImage})` }}
                >
                  <span className="category-tag">{book.category}</span>
                </div>
                <figcaption className="grid__item-caption">
                  <h3>{book.title}</h3>
                  <p className="text-sm text-gray-500">by {book.author}</p>
                  <StarRating rating={book.rating} className="mt-1" />
                  <p>{book.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
      
          {/* Panel */}
          <figure 
            ref={panelRef} 
            className={`panel ${panelSide === 'right' ? 'panel--right' : ''}`}
            style={{ opacity: 0, pointerEvents: 'none' }}
          >
            <div 
              ref={panelImgRef}
              className="panel__img" 
              style={{ 
                backgroundImage: currentBook ? `url(${currentBook.coverImage})` : 'none',
                clipPath: 'inset(100% 0% 0% 0%)'
              }}
            />
            <figcaption ref={panelContentRef} className="panel__content">
              {currentBook && (
                <>
                  <h3>{currentBook.title}</h3>
                  <p>By {currentBook.author}</p>
                  <div className="flex flex-wrap items-center gap-2 my-2">
                    <StarRating rating={currentBook.rating} />
                    <span className="panel-category">{currentBook.category}</span>
                  </div>
                  <p>{currentBook.description}</p>
                  {currentBook.amazonLink && (
                    <a 
                      href={currentBook.amazonLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="panel__button flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.42,14.75C16.56,16.13 14.3,17 12,17C9.03,17 6.2,15.73 4.06,13.57C3.68,13.19 3.7,12.59 4.1,12.25C4.48,11.9 5.08,11.9 5.45,12.28C7.23,14.03 9.58,15 12,15C13.84,15 15.67,14.34 17.23,13.28C17.68,12.96 18.29,13.05 18.62,13.5C18.95,13.97 18.87,14.57 18.42,14.75M20.03,12C20,12 20,11.96 19.97,11.93C18.08,9.03 15.08,7 12,7C8.91,7 5.92,9.03 4.03,11.93C4,11.96 4,12 4,12C4,12.04 4,12.07 4.03,12.1C5.92,15 8.91,17 12,17C15.08,17 18.08,15 19.97,12.07C20,12.04 20,12 20,12M11.83,9C13.6,9 15.05,10.45 15.05,12.22C15.05,14 13.6,15.45 11.83,15.45C10.05,15.45 8.6,14 8.6,12.22C8.6,10.45 10.05,9 11.83,9M12,10.68C10.96,10.68 10.13,11.5 10.13,12.54C10.13,13.57 10.96,14.39 12,14.39C13.03,14.39 13.85,13.57 13.85,12.54C13.85,11.5 13.03,10.68 12,10.68Z" />
                      </svg>
                      View on Amazon
                    </a>
                  )}
                  <button onClick={resetView} className="panel__close">
                    close
                  </button>
                </>
              )}
            </figcaption>
          </figure>
        </>
      )}
      
      {/* CSS */}
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          width: 100%;
        }
        
        .loading-bar {
          width: 50%;
          max-width: 300px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #bb6826, transparent);
          background-size: 200% 100%;
          animation: loading 2s infinite;
          margin-bottom: 1rem;
          border-radius: 3px;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .frame {
          padding: 1.5rem;
          font-size: 18px;
          font-weight: 500;
          display: grid;
          z-index: 1000;
          width: 100%;
          position: relative;
          pointer-events: auto;
        }
        
        .heading {
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          justify-content: space-between;
          gap: 1rem;
          margin: 5rem 0 1rem;
        }
        
        .heading__title {
          font-weight: 700;
          font-size: clamp(2rem, 10vw, 6rem);
          margin: 0;
          line-height: 0.9;
        }
        
        .heading__meta {
          font-size: 1.1rem;
        }
        
        .heading__meta::after {
          content: '·';
          font-family: serif;
          font-size: 3.5rem;
          line-height: 0.2;
          vertical-align: middle;
          margin-left: 0.5rem;
          display: inline-flex;
        }
        
        .grid {
          padding: 1rem 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }
        
        .grid__item {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          cursor: pointer;
          will-change: transform, clip-path;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), 
                      box-shadow 0.3s cubic-bezier(0.33, 1, 0.68, 1);
        }
        
        .grid__item:hover {
          transform: translateY(-5px);
        }
        
        .grid__item:hover .grid__item-image {
          opacity: 0.9;
        }
        
        .grid__item-image {
          width: 100%;
          aspect-ratio: 4/5;
          background-size: cover;
          background-position: 50% 50%;
          border-radius: 8px;
          transition: opacity 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        .category-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(255, 255, 255, 0.9);
          color: #333;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .grid__item-caption h3 {
          font-size: 1rem;
          font-weight: 500;
          margin: 0.5rem 0 0 0;
          text-align: left;
        }
        
        .grid__item-caption p {
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0.25rem 0;
          color: #666;
        }
        
        .grid__item-caption p:last-of-type {
          display: none; /* Hide the description in the grid but show in panel */
        }
        
        .panel {
          position: fixed;
          margin: 0;
          width: 100%;
          height: 100vh;
          padding: 1.5rem;
          top: 0;
          left: 0;
          display: grid;
          gap: 1rem;
          opacity: 0;
          pointer-events: none;
          z-index: 2000;
          will-change: transform, clip-path;
          justify-content: center;
          grid-template-rows: 1fr min-content;
          grid-template-columns: 100%;
          grid-template-areas: 'panel-image' 'panel-content';
          background-color: rgba(255, 255, 255, 0.97);
        }
        
        @media screen and (min-width: 768px) {
          .panel {
            grid-template-columns: calc((100vh - 3rem) * 4 / 5 - 1rem) 1fr;
            grid-template-areas: 'panel-image panel-content';
            grid-template-rows: 100%;
          }
          
          .panel--right {
            grid-template-columns: 1fr calc((100vh - 3rem) * 4 / 5 - 1rem);
            grid-template-areas: 'panel-content panel-image';
          }
        }
        
        .panel__img {
          grid-area: panel-image;
          background-size: cover;
          background-position: center;
          width: 100%;
          height: auto;
          aspect-ratio: 4/5;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        @media screen and (min-width: 768px) {
          .panel__img {
            height: 100%;
            width: auto;
            max-width: 100%;
          }
        }
        
        .panel__content {
          grid-area: panel-content;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
          align-items: flex-start;
          text-align: left;
          padding: 1rem;
        }
        
        .panel__content h3 {
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
          color: #333;
        }
        
        .panel__content p {
          margin: 0.5rem 0;
          max-width: 30rem;
          line-height: 1.6;
          color: #555;
          font-size: 1.1rem;
        }
        
        .panel-category {
          background-color: #f3f4f6;
          color: #333;
          padding: 4px 12px;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 20px;
        }
        
        .panel__button {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #bb6826;
          color: white;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }
        
        .panel__button:hover {
          background-color: #943706;
        }
        
        .panel__close {
          background: none;
          border: 0;
          padding: 0;
          margin: 2rem 0 0;
          font: inherit;
          cursor: pointer;
          color: #bb6826;
          font-weight: 500;
          align-self: flex-start;
        }
        
        .panel__close:hover {
          text-decoration: underline;
        }
        
        .mover {
          position: fixed;
          aspect-ratio: 4/5;
          background-size: cover;
          background-position: 50% 50%;
          will-change: transform, clip-path;
          pointer-events: none;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default BookImageAnimation;