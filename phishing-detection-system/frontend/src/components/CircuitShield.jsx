import React, { useEffect, useRef } from 'react';

const CircuitShield = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Animation state
        let animationFrame;
        let time = 0;

        // Circuit nodes
        const nodes = [];
        const nodeCount = 30;
        const centerX = canvas.width / (2 * dpr);
        const centerY = canvas.height / (2 * dpr);

        for (let i = 0; i < nodeCount; i++) {
            const angle = (Math.PI * 2 * i) / nodeCount;
            const radius = 80 + Math.random() * 120;
            nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: 2 + Math.random() * 2,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            time += 0.01;

            // Draw shield outline with pulsing effect
            ctx.strokeStyle = `rgba(163, 230, 53, ${0.3 + Math.sin(time * 2) * 0.15})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            // Shield shape
            const shieldPoints = [
                [centerX, centerY - 100],
                [centerX + 70, centerY - 70],
                [centerX + 70, centerY + 50],
                [centerX, centerY + 120],
                [centerX - 70, centerY + 50],
                [centerX - 70, centerY - 70]
            ];

            ctx.moveTo(shieldPoints[0][0], shieldPoints[0][1]);
            for (let i = 1; i < shieldPoints.length; i++) {
                ctx.lineTo(shieldPoints[i][0], shieldPoints[i][1]);
            }
            ctx.closePath();
            ctx.stroke();

            // Draw circuit traces between nodes
            ctx.strokeStyle = 'rgba(163, 230, 53, 0.15)';
            ctx.lineWidth = 1;

            for (let i = 0; i < nodes.length; i++) {
                const node1 = nodes[i];
                
                // Update node position
                node1.x += node1.vx;
                node1.y += node1.vy;

                // Bounce off edges
                const margin = 50;
                if (node1.x < margin || node1.x > canvas.width / dpr - margin) node1.vx *= -1;
                if (node1.y < margin || node1.y > canvas.height / dpr - margin) node1.vy *= -1;

                // Draw connections to nearby nodes
                for (let j = i + 1; j < nodes.length; j++) {
                    const node2 = nodes[j];
                    const dx = node2.x - node1.x;
                    const dy = node2.y - node1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.3;
                        ctx.strokeStyle = `rgba(163, 230, 53, ${opacity})`;
                        
                        ctx.beginPath();
                        ctx.moveTo(node1.x, node1.y);
                        
                        // Create angular circuit paths instead of straight lines
                        const midX = (node1.x + node2.x) / 2;
                        const midY = (node1.y + node2.y) / 2;
                        
                        if (Math.random() > 0.5) {
                            ctx.lineTo(midX, node1.y);
                            ctx.lineTo(midX, node2.y);
                        } else {
                            ctx.lineTo(node1.x, midY);
                            ctx.lineTo(node2.x, midY);
                        }
                        
                        ctx.lineTo(node2.x, node2.y);
                        ctx.stroke();
                    }
                }

                // Draw nodes with pulsing effect
                const pulse = Math.sin(time * 3 + node1.pulseOffset) * 0.5 + 0.5;
                const nodeOpacity = 0.4 + pulse * 0.4;
                
                ctx.fillStyle = `rgba(163, 230, 53, ${nodeOpacity})`;
                ctx.beginPath();
                ctx.arc(node1.x, node1.y, node1.radius, 0, Math.PI * 2);
                ctx.fill();

                // Glow effect
                if (pulse > 0.7) {
                    ctx.fillStyle = `rgba(163, 230, 53, ${(pulse - 0.7) * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(node1.x, node1.y, node1.radius * 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Draw grid mesh overlay
            ctx.strokeStyle = 'rgba(163, 230, 53, 0.05)';
            ctx.lineWidth = 0.5;
            
            const gridSize = 40;
            for (let x = 0; x < canvas.width / dpr; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height / dpr);
                ctx.stroke();
            }
            
            for (let y = 0; y < canvas.height / dpr; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width / dpr, y);
                ctx.stroke();
            }

            // Scanning line effect
            const scanY = ((time * 50) % (canvas.height / dpr));
            const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
            gradient.addColorStop(0, 'rgba(163, 230, 53, 0)');
            gradient.addColorStop(0.5, 'rgba(163, 230, 53, 0.15)');
            gradient.addColorStop(1, 'rgba(163, 230, 53, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, scanY - 20, canvas.width / dpr, 40);

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default CircuitShield;
