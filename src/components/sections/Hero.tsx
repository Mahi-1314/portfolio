import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { personal, phrases, socials, Resume } from "../../data/index";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import MYImg from "../../assets/Hero.webp";

const SOCIAL_ICONS: Record<string, IconType> = {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  SiLeetcode,
  FaWhatsapp,
  FaFacebook,
};

function useTypewriter(words: string[], speed = 75): string {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[idx];

    const timer = setTimeout(
      () => {
        if (!del && text === word) {
          setDel(true);
          return;
        }

        if (del && text === "") {
          setDel(false);
          setIdx((i) => (i + 1) % words.length);
          return;
        }

        setText((p) =>
          del ? p.slice(0, -1) : word.slice(0, p.length + 1),
        );
      },
      del ? speed / 2 : speed,
    );

    return () => clearTimeout(timer);
  }, [text, del, idx, words, speed]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(phrases);

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--bg0)" }}
    >
      <div className="section-wrap w-full relative z-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-5 order-2 lg:order-1 items-center lg:items-start text-center lg:text-left">
            {/* Availability Badge */}
            <div
              role="status"
              aria-label="Availability status"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase"
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                color: "var(--accent-h)",
              }}
            >
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--green)" }}
              />
              {personal.status}
            </div>

            {/* Main Heading */}
            <h1
              id="hero-heading"
              className="font-black leading-[1.12] tracking-tight text-[clamp(2rem,4.5vw,3.5rem)]"
              style={{
                fontFamily: "var(--font)",
                color: "var(--text1)",
              }}
            >
              Hi, I&apos;m
              <br />
              <span className="g-text">{personal.name}</span>
            </h1>

            {/* Typewriter Role */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div
                aria-hidden="true"
                className="w-7 h-[2px] rounded-full flex-shrink-0"
                style={{ background: "var(--accent)" }}
              />

              <p
                aria-live="polite"
                aria-label={`Current role: ${typed || phrases[0]}`}
                className="text-sm sm:text-base font-semibold"
                style={{
                  color: "var(--text2)",
                  fontFamily: "var(--mono)",
                  minWidth: 180,
                  margin: 0,
                }}
              >
                {typed}
                <span aria-hidden="true" className="cursor" />
              </p>
            </div>

            {/* Bio */}
            <p
              className="text-sm leading-[1.8] max-w-[440px] mx-auto lg:mx-0"
              style={{ color: "var(--text2)" }}
            >
              {personal.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a
                href="#projects"
                className="hero-btn flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg,var(--accent),var(--accent-h))",
                  transition: "transform 0.2s ease",
                }}
                aria-label="View my projects"
              >
                View Projects
                <FiArrowRight size={14} aria-hidden="true" />
              </a>

              <a
                href={Resume.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  color: "var(--text1)",
                  transition: "transform 0.2s ease",
                }}
                aria-label="Download my CV"
              >
                <FiDownload size={14} aria-hidden="true" />
                Download CV
              </a>
            </div>

            {/* Social Links */}
            <div
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
              role="list"
              aria-label="Social media links"
            >
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];

                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit my ${s.name}`}
                    role="listitem"
                    className="hero-social w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      color: s.color,
                      transition: "transform 0.2s ease",
                    }}
                  >
                    {Icon && <Icon size={14} aria-hidden="true" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full" style={{ maxWidth: "300px" }}>
              <div
                className="overflow-hidden rounded-[1.5rem]"
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                }}
              >
                {/* Profile Photo */}
                <img
                  src={MYImg}
                  alt="Mahi Rupabhinda — Engineering Student from Gujarat, India"
                  className="w-full object-cover object-top block"
                  style={{
                    aspectRatio: "4/5",
                    maxHeight: "375px",
                  }}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={300}
                  height={375}
                />

                {/* Profile Details */}
                <div
                  className="flex flex-col items-center gap-1 px-5 py-4"
                  style={{
                    borderTop: "1px solid var(--border)",
                    background: "var(--bg1)",
                  }}
                >
                  <p
                    className="m-0 font-bold text-center leading-tight"
                    style={{
                      fontSize: "clamp(1.1rem,2.5vw,1.4rem)",
                      letterSpacing: "-0.02em",
                      color: "var(--text1)",
                      fontFamily: "var(--font)",
                    }}
                  >
                    {personal.name}
                  </p>

                  <p
                    className="m-0 text-center uppercase tracking-[0.12em] text-[10px] font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {personal.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        style={{ opacity: 0.3 }}
      >
        <span
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text3)" }}
        >
          Scroll
        </span>

        <div
          className="w-px h-7 rounded-full"
          style={{
            background: "linear-gradient(to bottom,var(--accent),transparent)",
          }}
        />
      </div>

      {/* Button Hover Effects */}
      <style>{`
        .hero-btn:hover {
          transform: translateY(-2px);
        }

        .hero-social:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </section>
  );
}