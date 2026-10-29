"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "../../data/index";

gsap.registerPlugin(ScrollTrigger);

function EducationCard({
  edu,
  index,
}: {
  edu: (typeof education)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;

    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={cardRef} style={{ opacity: 0 }}>
      <div
        className="rounded-2xl p-5 sm:p-6 transition-transform duration-200 hover:-translate-y-1"
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Degree and Duration */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3
              className="font-bold text-sm sm:text-base mb-1 leading-snug"
              style={{
                color: "var(--text1)",
                fontFamily: "var(--font)",
              }}
            >
              {edu.degree}
            </h3>

            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: "var(--text3)" }}
            >
              {edu.school} · {edu.loc}
            </p>
          </div>

          <span
            className="text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap self-start"
            style={{
              color: "var(--accent-h)",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              fontFamily: "var(--mono)",
            }}
          >
            {edu.period}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-xs sm:text-sm leading-[1.8] mb-4"
          style={{ color: "var(--text2)" }}
        >
          {edu.desc}
        </p>

        {/* Grade */}
        {edu.grade && (
          <div className="mb-4">
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--green)" }}
            >
              {edu.grade}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {edu.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] sm:text-[11px] font-medium px-3 py-1 rounded-full"
              style={{
                background: "rgba(99,102,241,0.08)",
                color: "var(--accent-h)",
                border: "1px solid rgba(99,102,241,0.16)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Journey() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;

    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      style={{
        background: "var(--bg1)",
        overflow: "hidden",
      }}
    >
      <div className="section-wrap">
        {/* Section Heading */}
        <div
          ref={headingRef}
          className="mb-8 sm:mb-10"
          style={{ opacity: 0 }}
        >
          <div
            className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.12em] uppercase mb-2"
            style={{ color: "var(--accent-h)" }}
          >
            <span
              className="inline-block w-7 h-0.5 rounded-full"
              style={{ background: "var(--accent-h)" }}
            />
            My Background
          </div>

          <h2
            className="font-black leading-tight tracking-tight text-[clamp(1.8rem,4vw,2.8rem)]"
            style={{
              fontFamily: "var(--font)",
              color: "var(--text1)",
            }}
          >
            My <span className="g-text">Education</span>
          </h2>

          <p
            className="mt-3 text-xs sm:text-sm leading-[1.8] max-w-[520px]"
            style={{ color: "var(--text2)" }}
          >
            My academic journey and the foundation I'm building for my career
            in technology.
          </p>
        </div>

        {/* Education Cards */}
        <div className="flex flex-col gap-4">
          {education.map((edu, index) => (
            <EducationCard key={edu.id} edu={edu} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}