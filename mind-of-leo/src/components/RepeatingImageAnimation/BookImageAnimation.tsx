/**
 * BookImageAnimation Component
 * 
 * An interactive grid of book covers that expands into detailed panels with animations.
 * Features a fluid transition animation when clicking on a book cover.
 * 
 * The component uses GSAP for animations and manages its own loading state.
 */

import React, { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import './BookAnimation.css'; // Import the CSS file

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
  // Refs to access DOM elements for animations
  const gridRef = useRef<HTMLDivElement>(null); // Main grid container
  const panelRef = useRef<HTMLDivElement>(null); // Expanded panel when a book is clicked
  const panelContentRef = useRef<HTMLDivElement>(null); // Currently selected book
  const panelImgRef = useRef<HTMLDivElement>(null); // Panel position based on click location
  const frameRef = useRef<HTMLDivElement>(null); // Initial loading state for images
  const contentWrapperRef = useRef<HTMLDivElement>(null); // Wrapper for scrollable content

  // Component state
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Whether a book panel is open
  const [isAnimating, setIsAnimating] = useState(false); // Whether an animation is in progress
  const [currentBook, setCurrentBook] = useState<Book | null>(null); // Currently selected book
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right'); // Panel position based on click location
  const [isLoading, setIsLoading] = useState(true); // Initial loading state for images

   // Initialize component and preload images
  useEffect(() => {
    /**
     * Preloads all book cover images to prevent flickering during animations
     * Returns a promise that resolves when all images are loaded
     */ 

    const preloadImages = () => {
      return new Promise((resolve) => {
        const images = document.querySelectorAll('.grid__item-image');
        // Track loading progress
        let loaded = 0;
        const total = images.length;
        
        // If no images, resolve immediately
        if (total === 0) resolve(true);
        
        // Preload each background image
        images.forEach((img) => {
          const background = window.getComputedStyle(img as Element).backgroundImage;
          if (background !== 'none') {
            const tempImg = new Image();
            // Track successful loads
            tempImg.onload = () => {
              loaded++;
              if (loaded === total) resolve(true);
            };
            // Also track errors to prevent hanging
            tempImg.onerror = () => {
              loaded++;
              if (loaded === total) resolve(true);
            };
            // Extract the URL from the background-image CSS
            tempImg.src = background.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
          } else {
            // If no background image, count as loaded
            loaded++;
            if (loaded === total) resolve(true);
          }
        });
      });
    };

    // When images are loaded, remove loading state
    preloadImages().then(() => {
      document.body.classList.remove('loading');
      setIsLoading(false);
    });

    // Cleanup GSAP animations when component unmounts
    return () => {
      gsap.killTweensOf('*');
    };
  }, []);

  // Add an effect to scroll to top when panel is opened
  useEffect(() => {
    if (isPanelOpen && panelContentRef.current) {
      panelContentRef.current.scrollTop = 0;
    }
  }, [isPanelOpen]);

  /**
   * Calculates the center coordinates of an HTML element
   * Used to determine which side of the screen was clicked
   */
  const getElementCenter = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  /**
   * Determines whether to open the panel on the left or right side
   * based on where the user clicked on the screen
   */
  const positionPanelBasedOnClick = (clickedItem: HTMLElement) => {
    const centerX = getElementCenter(clickedItem).x;
    const windowHalf = window.innerWidth / 2;

    const isLeftSide = centerX < windowHalf;
    setPanelSide(isLeftSide ? 'right' : 'left');
  };

  /**
   * Generates animation path points between start and end elements
   * Creates a smooth transition path with a slight arc motion
   * 
   * @param startRect - DOMRect of the source element (book thumbnail)
   * @param endRect - DOMRect of the target element (expanded panel image)
   * @param steps - Number of intermediate steps in the animation
   * @returns Array of position objects for animation frames
   */
  const generateMotionPath = (startRect: DOMRect, endRect: DOMRect, steps: number) => {
    const path = [];
    const fullSteps = steps + 2; // Including start and end positions
    
    // Calculate centers of start and end elements
    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };
    
    const endCenter = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    };

    // Linear interpolation helper function
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Generate path points for each step
    for (let i = 0; i < fullSteps; i++) {
      const t = i / (fullSteps - 1); // Normalized time (0 to 1)
      const width = lerp(startRect.width, endRect.width, t);
      const height = lerp(startRect.height, endRect.height, t);
      const centerX = lerp(startCenter.x, endCenter.x, t);
      const centerY = lerp(startCenter.y, endCenter.y, t);

      // Apply a sine wave offset for a more natural arc motion
      const sineOffset = Math.sin(t * Math.PI) * 20;

      // Calculate position and dimensions for this step
      path.push({
        left: centerX - width / 2,
        top: centerY - height / 2 + sineOffset,
        width,
        height,
      });
    }

    // Return intermediate steps (exclude start and end positions)
    return path.slice(1, -1);
  };

  /**
   * Handles clicking on a book grid item
   * Triggers the expanding animation sequence and opens the detailed panel
   * 
   * @param e - Mouse event from the click
   * @param book - The book data that was clicked
   */
  const handleItemClick = (e: React.MouseEvent<HTMLElement>, book: Book) => {
    // Prevent multiple animations from running simultaneously
    if (isAnimating || isPanelOpen) return;
    
    // Update state to begin animation sequence
    setIsAnimating(true);
    setCurrentBook(book);
    
    // Determine which side to position the panel
    const item = e.currentTarget;
    positionPanelBasedOnClick(item);
    
    // Get image element within the clicked item
    const imgEl = item.querySelector('.grid__item-image') as HTMLElement;
    const panelImg = panelImgRef.current;
    
    // Safety check for null refs
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
    
    // Animation configuration
    const STEPS = 5; // Number of "mover" elements for transition
    const STEP_DURATION = 0.3; // Duration of each step animation
    const STEP_INTERVAL = 0.05; // Delay between steps starting
    
    // Create animation path from source to destination
    const path = generateMotionPath(
      imgEl.getBoundingClientRect(),
      panelImg.getBoundingClientRect(),
      STEPS
    );
    
    // Create container for moving elements
    const moversContainer = document.createElement('div');
    moversContainer.className = 'movers-container';
    document.body.appendChild(moversContainer);
    
    // Create and animate each "mover" element along the path
    path.forEach((step, index) => {
      // Create a new element for this step
      const mover = document.createElement('div');
      mover.className = 'mover';
      // Set initial properties using GSAP
      gsap.set(mover, {
        backgroundImage: `url(${book.coverImage})`,
        position: 'fixed',
        left: step.left,
        top: step.top,
        width: step.width,
        height: step.height,
        clipPath: 'inset(100% 0% 0% 0%)', // Start fully clipped from top
        zIndex: 1000 + index,
        backgroundPosition: '50% 50%',
        backgroundSize: 'cover',
        rotationZ: gsap.utils.random(-5, 5), // Slight random rotation for visual interest
      });
      moversContainer.appendChild(mover);

      // Stagger the animations slightly
      const delay = index * STEP_INTERVAL;
      // Create a timeline for this mover's animation
      gsap
        .timeline({ delay })
        // First reveal the mover by animating the clip path
        .fromTo(
          mover,
          { opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' },
          {
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)', // Fully clipped from top
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
      scale: 0.8, // Restore original scale
      duration: 0.3,
      ease: 'sine',
      stagger: 0.02, // Stagger the restoration for visual interest
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

  /**
   * Simple star rating display component
   * Renders 1-5 stars based on the rating value
   * 
   * @param rating - Number from 1-5 representing the book rating
   * @param className - Optional CSS classes to apply to the container
   */
  const StarRating = ({ rating, className = '' }: { rating: number, className?: string }) => {
    return (
      <div className={`flex ${className}`}>
        {/* Create an array of 5 elements and map stars based on rating */}
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
    {/* Loading state - shown while images are preloading */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-bar"></div>
          <p>Loading book collection...</p>
        </div>
      ) : (
        <>
          {/* Header frame - contains title and description */}
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
      
          {/* Detailed panel that appears when a book is clicked */}
          <figure 
            ref={panelRef} 
            className={`panel ${panelSide === 'right' ? 'panel--right' : ''}`}
            style={{ opacity: 0, // Initially hidden
              pointerEvents: 'none' // Initially non-interactive
            }}
          >
            {/* Large book cover image */}
            <div 
              ref={panelImgRef}
              className="panel__img" 
              style={{ 
                backgroundImage: currentBook ? `url(${currentBook.coverImage})` : 'none',
                clipPath: 'inset(100% 0% 0% 0%)' // Initially clipped (for animation)
              }}
            />
            {/* Book details panel content - Now scrollable */}
            <figcaption ref={panelContentRef} className="panel__content">
              {/* Conditional rendering based on selected book */}
              {currentBook && (
                <div ref={contentWrapperRef} className="panel__content-wrapper">
                  <h3>{currentBook.title}</h3>
                  <p>By {currentBook.author}</p>
                  {/* Rating and category display */}
                  <div className="flex flex-wrap items-center gap-2 my-2">
                    <StarRating rating={currentBook.rating} />
                    <span className="panel-category">{currentBook.category}</span>
                  </div>
                  {/* Book description */}
                  <p>{currentBook.description}</p>
                  {/* Amazon link (if available) */}
                  {currentBook.amazonLink && (
                    <a 
                      href={currentBook.amazonLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="panel__button flex items-center"
                    >
                      {/* "Eye" icon for viewing/purchasing */}
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.42,14.75C16.56,16.13 14.3,17 12,17C9.03,17 6.2,15.73 4.06,13.57C3.68,13.19 3.7,12.59 4.1,12.25C4.48,11.9 5.08,11.9 5.45,12.28C7.23,14.03 9.58,15 12,15C13.84,15 15.67,14.34 17.23,13.28C17.68,12.96 18.29,13.05 18.62,13.5C18.95,13.97 18.87,14.57 18.42,14.75M20.03,12C20,12 20,11.96 19.97,11.93C18.08,9.03 15.08,7 12,7C8.91,7 5.92,9.03 4.03,11.93C4,11.96 4,12 4,12C4,12.04 4,12.07 4.03,12.1C5.92,15 8.91,17 12,17C15.08,17 18.08,15 19.97,12.07C20,12.04 20,12 20,12M11.83,9C13.6,9 15.05,10.45 15.05,12.22C15.05,14 13.6,15.45 11.83,15.45C10.05,15.45 8.6,14 8.6,12.22C8.6,10.45 10.05,9 11.83,9M12,10.68C10.96,10.68 10.13,11.5 10.13,12.54C10.13,13.57 10.96,14.39 12,14.39C13.03,14.39 13.85,13.57 13.85,12.54C13.85,11.5 13.03,10.68 12,10.68Z" />
                      </svg>
                      View on Amazon
                    </a>
                  )}
                  
                  {/* Close button container with gradient background */}
                  <div className="panel__close-container">
                    <button onClick={resetView} className="panel__close">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </figcaption>
          </figure>
        </>
      )}
    </>
  );
};

export default BookImageAnimation;