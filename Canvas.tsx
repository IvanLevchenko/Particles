import React, { useEffect, useRef } from 'react';
import './App.css';

export const Canvas: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  let particles: any[] = [];
  const velocity = 2;

  interface Particle {
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
  };

  class Particle {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    indexOfParticle: number;

    constructor(
      x: number, 
      y: number, 
      velocityX: number, 
      velocityY: number, 
      indexOfParticle: number
      ) {
      this.x = x;
      this.y = y;
      this.velocityX = velocityX;
      this.velocityY = velocityY;
      this.indexOfParticle = indexOfParticle;
    };
  };

  const drawParticles = (ctx: any): void => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    for(let i = 0; i < particles.length; i++) {
      let indexOfParticle = particles[i].indexOfParticle;

      ctx.beginPath()
      ctx.arc(particles[i].x, particles[i].y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'red';
      ctx.fill()
      ctx.closePath()

      drawLines(
        particles[indexOfParticle].x, 
        particles[indexOfParticle].y
      )
    }
  };
  
  const renderParticles = (): void => {
    const ctx = canvas.current?.getContext('2d');

    if(!particles.length) {
      for(let i = 0; i < 60; i++) {
        let x: number = Math.random() * window.innerWidth;
        let y: number = Math.random() * window.innerHeight;
        let randomIndexOfParticle: number = Math.floor(Math.random() * particles.length);

        let particle: Particle = new Particle(
          x,
          y,
          Math.random() * velocity - velocity / 1.6,
          Math.random() * velocity - velocity / 1.6,
          randomIndexOfParticle
        );      
        
        particles.push(particle)
        drawParticles(ctx)
      };
    };
  };

  const moveParticles = (): void => {
    if(particles.length) {  
      particles.map(p => {
        
        p.x += p.velocityX;
        p.y += p.velocityY;

        if(p.x > window.innerWidth || p.x < 0) {
          p.velocityX *= -1;
        }

        if(p.y > window.innerHeight || p.y < 0) {
          p.velocityY *= -1;
        }

        drawParticles(canvas.current!.getContext('2d'))
      });
      
      requestAnimationFrame(moveParticles)
    };
  };

  const drawLines = (toX: number, toY: number): void => {
    const ctx: any = canvas.current?.getContext('2d')
    ctx.beginPath()

    for(let i = 0; i < particles.length; i++) {
      let lineWidth: number = Math.abs(toX / particles[i].x) <= 2 ? Math.abs(toX / particles[i].x) : 2;

      if(Math.abs(particles[i].x - toX) <= 200 && Math.abs(particles[i].y - toY) <= 200) {
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(toX, toY)
        ctx.lineWidth = lineWidth;;
      }
    }
    ctx.stroke()
    ctx.strokeStyle = 'red';
    ctx.closePath()
  };  

  useEffect(() => {
    canvas.current!.width = window.innerWidth;
    canvas.current!.height = window.innerHeight;

    renderParticles()
    moveParticles()
  }, [])

  return (
    <canvas
      ref={canvas}
    ></canvas>
  )
};
