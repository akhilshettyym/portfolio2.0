import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cardsData = [
    {
        number: '01',
        title: 'Performance First',
        description:
            'I focus on building websites that load fast and feel smooth from the first interaction. Performance is considered at every stage, from structure and assets to code quality and optimization, ensuring reliable results on real devices and networks.',
        linkText: 'Learn more',
        linkHref: '/about',
        isGreen: false,
    },
    {
        number: '02',
        title: 'Clean & Scalable Code',
        description:
            'I write clean, well-structured, and maintainable code with a strong focus on clarity and long-term scalability. This approach makes projects easier to understand, update, and extend over time, while reducing complexity and keeping the codebase reliable as it grows.',
        linkText: 'My workflow',
        linkHref: '/projects',
        isGreen: true,
    },
    {
        number: '03',
        title: 'Modern UI & UX',
        description:
            'I design and build interfaces with clarity, usability, and consistency in mind. Layouts, interactions, and responsive behavior are carefully crafted to provide an intuitive experience that works seamlessly across all devices and screen sizes.',
        linkText: 'View approach',
        linkHref: '/projects',
        isGreen: false,
    },
    {
        number: '04',
        title: 'SEO & Best Practices',
        description:
            'Websites are built using modern best practices and strong technical SEO foundations from the very beginning of the project. This includes clean structure, accessibility, semantic markup, and optimization techniques that support visibility, performance, and long-term growth.',
        linkText: 'See details',
        linkHref: '/about',
        isGreen: true,
    },
    {
        number: '05',
        title: 'Reliable Delivery',
        description:
            'From the initial idea to the final launch, I focus on clear communication, thoughtful planning, and reliable delivery at every stage of the process. Each project is carefully tested and refined to ensure stability, quality, and confidence when the product goes live.',
        linkText: 'How I work',
        linkHref: '/about',
        isGreen: false,
    },
];

const VerticalCardCarousel = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        ScrollTrigger.getAll().forEach((st) => st.kill());

        const cards = cardsRef.current;
        const movingCards = cards.slice(1);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                pin: true,
                anticipatePin: 1,
            },
        });

        tl.fromTo(
            movingCards,
            { yPercent: 100, opacity: 0.9 },
            {
                yPercent: 0,
                opacity: 1,
                stagger: 1,
                ease: 'none',
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <>
            <style jsx>{`
       .carousel-container {
         width: 100%;
         height: 400vh; /* Controlled scroll duration track */
         position: relative;
       }

       .carousel-viewport {
         width: 100%;
         height: 100vh;
         overflow: hidden;
         position: relative;
         display: flex;
         align-items: center;
         justify-content: center;
       }

       .cards-wrapper {
         position: relative;
         width: 100%;
         height: 480px;
       }

       .card {
         position: absolute;
         left: 390;
         right: 0;
         top: 0;
         height: 60%;
         border-radius: 0px;
         display: flex;
         flex-direction: column;
         justify-content: center;
         padding: 3rem;
         font-family: system-ui, -apple-system, sans-serif;
         box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
         overflow: hidden;
         border: 1px solid rgba(0, 0, 0, 0.08);
       }

       .card-white {
         background-color: #ffffff;
         color: #000000;
         border-color: rgba(0, 0, 0, 0.08);
       }

       .card-green {
         background-color: #022c22;
         color: #ffffff;
         border-color: rgba(255, 255, 255, 0.05);
       }

       .card-number {
         position: absolute;
         right: 2rem;
         bottom: -1.5rem;
         font-size: 14rem;
         font-weight: 900;
         line-height: 1;
         letter-spacing: -0.05em;
         user-select: none;
         pointer-events: none;
       }

       .card-white .card-number {
         color: rgba(0, 0, 0, 0.03);
       }

       .card-green .card-number {
         color: rgba(255, 255, 255, 0.03);
       }

       .card-content {
         max-width: 42rem;
         position: relative;
         z-index: 10;
       }

       .card-title {
         font-size: 2.5rem;
         line-height: 1.1;
         font-weight: 700;
         margin-bottom: 1.25rem;
         letter-spacing: -0.02em;
       }

       @media (max-width: 768px) {
         .card {
           padding: 2rem;
         }
         .card-title {
           font-size: 1.75rem;
         }
         .card-number {
           font-size: 8rem;
           right: 1rem;
         }
       }

       .card-description {
         font-size: 1.1rem;
         line-height: 1.6;
         opacity: 0.75;
         margin-bottom: 2rem;
       }

       .card-link {
         display: inline-flex;
         align-items: center;
         gap: 8px;
         text-decoration: none;
         font-weight: 600;
         font-size: 0.95rem;
         border-b: 1px solid currentColor;
         padding-bottom: 2px;
         transition: opacity 0.2s ease;
       }

       .card-link:hover {
         opacity: 0.7;
       }

       .card-link:after {
         content: '→';
         display: inline-block;
         transition: transform 0.3s ease;
       }

       .card-link:hover:after {
         transform: translateX(6px);
       }
     `}</style>

            <div ref={containerRef} className="carousel-container">
                <div className="carousel-viewport">
                    <div className="cards-wrapper">
                        {cardsData.map((card, index) => (
                            <div
                                key={index}
                                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                                className={`card ${card.isGreen ? 'card-green' : 'card-white'}`}
                                style={{ zIndex: index + 1 }}
                            >
                                <div className="card-content">
                                    <h3 className="card-title">{card.title}</h3>
                                    <p className="card-description">{card.description}</p>
                                    <a
                                        href={card.linkHref}
                                        className="card-link"
                                        style={{ color: card.isGreen ? '#7df2b5' : 'inherit' }}
                                    >
                                        {card.linkText}
                                    </a>
                                </div>
                                <div className="card-number">{card.number}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerticalCardCarousel;