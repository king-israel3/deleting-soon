import React, { useEffect, useRef, useState } from 'react'

const projects = [
  {
    title: "Project 1",
    image: "",
    description: "Project 1 desc",
    technologies: ["MongoDB", "Express", "React", "Node.js", "CSS"],
    animClass: 'fade-right'
  },
  {
    title: "Project 2",
    image: "",
    description: "Project 2 desc",
    technologies: ["CSS", "MongoDB", "Express", "React", "Node.js"],
    animClass: 'fade-down'
  }
]

function Projects() {
  // const navigate = useNavigate()
  const [phase, setPhase] = useState("stacked");
  const sectionRef = useRef(null)
  const lastScrollY = useRef(0)
  const canDisperse = useRef(true) // prevents immediate re-dispersion after stacking

  const disperseCards = () => {
    setPhase(prev => (prev === "stacked" ? "scattering" : prev))
  }

  const stackAgain = () => {
    // Block auto-dispersion momentarily so the user can scroll without immediately re-triggering the down-observer.
    canDisperse.current = false
    setPhase("stacked")

    // Re-enable dispersion after a short grace period
    setTimeout(() => {
      canDisperse.current = true
    }, 800)
  }

  // Phase timer: scattering → grid
  useEffect(() => {
    if (phase !== "scattering") return

    const duration = 850
    const stagger = 100
    const totalDuration =
        duration + Math.max(0, projects.length - 1) * stagger

    const timer = setTimeout(() => {
        setPhase("grid")
    }, totalDuration)

    return () => clearTimeout(timer)
  }, [phase])

  // ---- SINGLE SCROLL HANDLER ----
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current
      lastScrollY.current = currentScrollY

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // ---------- DISPERSE ON SCROLL DOWN ----------
      if (phase === "stacked" && canDisperse.current && scrollingDown) {
        // Trigger when the section's top has entered the upper 60% of the viewport
        const triggerLine = viewportHeight * 0.4
        if (rect.top <= triggerLine && rect.bottom > 0) disperseCards()
      }

      // ---------- RE-STACK ON SCROLL UP ----------
      if (phase === "grid" && !scrollingDown) {
        // Re-stack when the section is mostly below the viewport (i.e. the user has scrolled above the section)
        if (rect.top > viewportHeight * 0.9) stackAgain()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [phase])
  
  return (
    <section className="projects" id='projects' ref={sectionRef}>
      <h2 className='heading-text' data-aos="zoom-in">My Works</h2>
      <p className='projects-subtext' data-aos="zoom-out">Below are my collection of projects, with more currently in development.</p>
      
      {(phase === "stacked" || phase === "scattering") && (
        <div className={`deck-area ${phase}`}>
          <p className="deck-hint">Click the deck or scroll to expand the cards</p>

          <div
            className="deck-wrapper"
            onClick={disperseCards}
            role="button"
            tabIndex={0}
            aria-label="Reveal portfolio projects"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                disperseCards()
              }
            }}
          >
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="stack-card"
                style={{
                  "--index": index,
                  "--scatter-y": `${180 + index * 80}px`,
                  "--scatter-rotation": `${(index % 2 === 0 ? 1 : -1) * (6 + index * 4)}deg`,
                }}
              >
                <img src={project.image} alt={project.title} />
                <div className="card-label">{project.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === "grid" && (
        <>
          <main className="all-projects-grids">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="project-card project-card-reveal"
                style={{ "--index": index }}
              >
                <img src={project.image} alt={project.title} />

                <div className="project-details">
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>

                  <div className="used-langs-container">
                    {project.technologies?.map((technology) => (
                      <span key={technology} className="used-langs">
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </main>

          {/* <button type="button" className="stack-again-btn" onClick={stackAgain}>
            ↺ Stack the cards again
          </button> */}
        </>
      )}
      {/* <button className='cta-button'>See More</button> */}
    </section>
  )
}

export default Projects