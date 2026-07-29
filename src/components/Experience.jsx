import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { supabase } from "./lib/supabase";

/* ---------- Single Experience Row ---------- */

function ExperienceRow({ experience, index }) {
    const [open, setOpen] = useState(false);

    const ref = useRef(null);

    const inView = useInView(ref, {
        once: true,
        margin: "-60px",
    });

    const num = String(index + 1).padStart(2, "0");

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.65,
                delay: index * 0.07,
                ease: [0.25, 1, 0.5, 1],
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => setOpen((o) => !o)}
            style={{
                borderTop: "1px solid var(--border)",
                padding: "clamp(1.1rem,2.5vw,1.6rem) 0",
                cursor: "pointer",
                background: open
                    ? "rgba(200,241,53,.025)"
                    : "transparent",
                transition: "background .3s",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "clamp(2rem,5vw,3.5rem) 1fr auto",
                    alignItems: "center",
                    gap: "clamp(.8rem,2vw,1.5rem)",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--mono)",
                        fontSize: ".62rem",
                        color: open
                            ? "var(--accent)"
                            : "var(--muted)",
                        letterSpacing: ".1em",
                        transition: ".3s",
                    }}
                >
                    {num}
                </span>

                <motion.div
                    animate={{
                        x: open ? 8 : 0,
                    }}
                    transition={{
                        duration: .35,
                        ease: [0.25, 1, 0.5, 1],
                    }}
                >
                    <h3
                        style={{
                            fontFamily: "var(--display)",
                            fontWeight: 700,
                            fontSize: "clamp(1.1rem,2.5vw,2rem)",
                            letterSpacing: "-.02em",
                            color: open
                                ? "var(--text)"
                                : "var(--muted)",
                            transition: ".3s",
                            margin: 0,
                        }}
                    >
                        {experience.role}
                    </h3>

                    <p
                        style={{
                            marginTop: ".35rem",
                            fontFamily: "var(--mono)",
                            fontSize: ".65rem",
                            letterSpacing: ".08em",
                            color: "var(--muted)",
                        }}
                    >
                        {experience.company}
                    </p>
                </motion.div>

                <div
                    className="exp-tags"
                    style={{
                        display: "flex",
                        gap: ".4rem",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                    }}
                >
                    {(experience.tech || "")
                        .split(",")
                        .map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontFamily: "var(--mono)",
                                    fontSize: ".54rem",
                                    letterSpacing: ".12em",
                                    textTransform: "uppercase",
                                    padding: ".22rem .52rem",
                                    border: "1px solid var(--border)",
                                    borderRadius: 2,
                                    whiteSpace: "nowrap",
                                    color: "var(--muted)",
                                    borderColor: open
                                        ? "rgba(200,241,53,.3)"
                                        : "var(--border)",
                                    transition: ".3s",
                                }}
                            >
                                {tag.trim()}
                            </span>
                        ))}
                </div>
            </div>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: .4,
                            ease: [0.25, 1, 0.5, 1],
                        }}
                        style={{
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                paddingTop: "1.2rem",
                                paddingLeft: "clamp(0px,5vw,5rem)",
                                display: "flex",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "1.2rem",
                                alignItems: "flex-end",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        fontFamily: "var(--mono)",
                                        fontSize: ".76rem",
                                        lineHeight: 1.8,
                                        color: "var(--muted)",
                                        maxWidth: "52ch",
                                    }}
                                >
                                    {experience.description}
                                </p>

                                <div
                                    style={{
                                        marginTop: "1.25rem",
                                        display: "flex",
                                        gap: "1.5rem",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "var(--mono)",
                                            fontSize: ".63rem",
                                            letterSpacing: ".12em",
                                            color: "var(--accent)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {experience.duration}
                                    </span>

                                    <span
                                        style={{
                                            fontFamily: "var(--mono)",
                                            fontSize: ".63rem",
                                            letterSpacing: ".12em",
                                            color: "var(--muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {experience.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @media (max-width:580px){
          .exp-tags{
            display:none;
          }
        }
      `}</style>
        </motion.div>
    );
}

/* ---------- Live Dot ---------- */

function LiveDot() {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--mono)",
                fontSize: ".62rem",
                color: "var(--muted)",
                letterSpacing: ".1em",
            }}
        >
            <span
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    animation: "livePulse 2s ease-in-out infinite",
                }}
            />
            live

            <style>{`
        @keyframes livePulse{
          0%,100%{
            opacity:1;
            transform:scale(1);
          }
          50%{
            opacity:.3;
            transform:scale(.7);
          }
        }
      `}</style>
        </span>
    );
}

/* ---------- Main Section ---------- */

export default function Experience() {
    const [experiences, setExperiences] = useState([]);
    const [error, setError] = useState(null);

    const headerRef = useRef(null);

    const inView = useInView(headerRef, {
        once: true,
        margin: "-80px",
    });

    useEffect(() => {
        supabase
            .from("experience")
            .select("*")
            .order("created_at", {
                ascending: true,
            })
            .then(({ data, error }) => {
                if (error) setError(error.message);
                else setExperiences(data ?? []);
            });

        const channel = supabase
            .channel("experience-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "experience",
                },
                () => {
                    supabase
                        .from("experience")
                        .select("*")
                        .order("created_at", {
                            ascending: true,
                        })
                        .then(({ data }) =>
                            setExperiences(data ?? [])
                        );
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return (
        <section
            id="experience"
            className="section-pad"
        >
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                    duration: 1,
                    ease: [0.25, 1, 0.5, 1],
                }}
                style={{
                    height: 1,
                    background: "var(--border)",
                    marginBottom: "4rem",
                    transformOrigin: "left",
                }}
            />

            <div
                ref={headerRef}
                style={{
                    marginBottom: "3.5rem",
                }}
            >
                <motion.p
                    className="section-num"
                    initial={{
                        opacity: 0,
                        x: -20,
                    }}
                    animate={
                        inView
                            ? { opacity: 1, x: 0 }
                            : {}
                    }
                    transition={{
                        duration: .5,
                    }}
                >
                    02 — Experience
                </motion.p>

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "flex-end",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}
                >
                    <motion.h2
                        className="section-title"
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={
                            inView
                                ? {
                                    opacity: 1,
                                    y: 0,
                                }
                                : {}
                        }
                        transition={{
                            duration: .65,
                            delay: .1,
                        }}
                    >
                        Experience
                    </motion.h2>

                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={
                            inView
                                ? { opacity: 1 }
                                : {}
                        }
                        transition={{
                            delay: .3,
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.2rem",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--mono)",
                                fontSize: ".65rem",
                                color: "var(--muted)",
                                letterSpacing: ".1em",
                            }}
                        >
                            ({experiences.length} total)
                        </span>

                        <LiveDot />
                    </motion.div>
                </div>
            </div>

            {error && (
                <p
                    style={{
                        fontFamily: "var(--mono)",
                        fontSize: ".7rem",
                        color: "var(--muted)",
                        marginBottom: "2rem",
                    }}
                >
                    ⚠ Could not connect to database.
                </p>
            )}

            <div>
                {experiences.map((exp, i) => (
                    <ExperienceRow
                        key={exp.id}
                        experience={exp}
                        index={i}
                    />
                ))}

                <div
                    style={{
                        borderTop:
                            "1px solid var(--border)",
                    }}
                />
            </div>
        </section>
    );
}