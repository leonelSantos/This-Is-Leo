export const transforms = [
    {
        x: -0.8,
        y: -0.6,
        rotationZ: -29
    },
    {
        x: -0.2,
        y: -0.4,
        rotationZ: -6
    },
    {
        x: -0.05,
        y: 0.1,
        rotationZ: 12
    },
    {
        x: -0.05,
        y: -0.1,
        rotationZ: -9
    },
    {
        x: -0.1,
        y: 0.55,
        rotationZ: 3
    },
    {
        x: 0,
        y: -0.1,
        rotationZ: 9
    },
    {
        x: 0,
        y: 0.15,
        rotationZ: -12
    },
    {
        x: 0,
        y: 0.15,
        rotationZ: -17
    },
    {
        x: 0,
        y: -0.65,
        rotationZ: 9
    },
    {
        x: 0.1,
        y: 0.4,
        rotationZ: 12
    },
    {
        x: 0,
        y: -0.15,
        rotationZ: -9
    },
    {
        x: 0.2,
        y: 0.15,
        rotationZ: 12
    },
    {
        x: 0.8,
        y: 0.6,
        rotationZ: 20
    }
  ]
  
  export const disperse = {
    open: (i) => ({
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.05,
      },
    }),
    closed: (i) => ({
      y: Math.random() * 50 - 25,  // Random vertical displacement
      x: Math.random() * 50 - 25,  // Random horizontal displacement
      opacity: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.05,
      },
    }),
  };