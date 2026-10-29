/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { personal } from "../../data/index";
import { store } from "../../utils/store";

gsap.registerPlugin(ScrollTrigger);

/* ── Types ── */
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/* ── Form label ── */
const FL = ({ label }: { label: string }) => (
  <label
    className="block text-[10px] font-black uppercase tracking-[0.18em] mb-1.5"
    style={{ color: "var(--text3)" }}
  >
    {label}
  </label>
);

/* ── Styled input / textarea ── */
function StyledField({
  as = "input",
  err,
  ...props
}: {
  as?: "input" | "textarea";
  err?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false);
  const Tag = as as "input";

  return (
    <div className="relative">
      <Tag
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        onFocus={(e) => {
          setFocused(true);
          (props.onFocus as (e: React.FocusEvent) => void)?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          (props.onBlur as (e: React.FocusEvent) => void)?.(e);
        }}
        className="w-full transition-all duration-200 placeholder:text-[color:var(--text3)]"
        style={{
          padding: as === "textarea" ? "14px 16px" : "12px 16px",
          borderRadius: 14,
          background: "var(--bg3)",
          boxShadow: focused ? "var(--neu-in-sm)" : "var(--neu-in-sm)",
          border: `1px solid ${
            err
              ? "rgba(248,113,113,0.6)"
              : focused
                ? "var(--accent)"
                : "var(--border)"
          }`,
          outline: "none",
          color: "var(--text1)",
          fontFamily: "var(--font)",
          fontSize: "0.875rem",
          resize: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />

      {err && (
        <p
          className="text-[11px] mt-1.5 flex items-center gap-1"
          style={{ color: "#f87171" }}
        >
          {err}
        </p>
      )}
    </div>
  );
}

/* ════════════════ MAIN CONTACT COMPONENT ════════════════ */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [f, setF] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [err, setErr] = useState<FormErrors>({});
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  /* ── Restore saved draft ── */
  useEffect(() => {
    const d = store.draft.get();

    if (d && Object.values(d).some(Boolean)) {
      setF(d as unknown as FormData);
      setNote("Draft restored");

      setTimeout(() => setNote(""), 2600);
    }
  }, []);

  /* ── Scroll animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.fromTo(
          Array.from(headRef.current.children),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headRef.current,
              start: "top 86%",
            },
          },
        );
      }

      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 82%",
            },
          },
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 82%",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Handle form changes ── */
  const change = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = ev.target;

    setF((p) => {
      const updated = { ...p, [name]: value };

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        store.draft.save(updated);
        setNote("Draft saved");

        setTimeout(() => setNote(""), 1600);
      }, 700);

      return updated;
    });

    if (err[name as keyof FormErrors]) {
      setErr((p) => ({ ...p, [name]: "" }));
    }
  };

  /* ── Validate form ── */
  const validate = (): FormErrors => {
    const errors: FormErrors = {};

    if (!f.name.trim()) {
      errors.name = "Name is required";
    }

    if (
      !f.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)
    ) {
      errors.email = "Please enter a valid email";
    }

    if (!f.message.trim()) {
      errors.message = "Message is required";
    }

    return errors;
  };

  /* ── Submit form ── */
  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length) {
      setErr(errors);
      return;
    }

    setBusy(true);

    try {
      await emailjs.send(
        "service_bcj0gjg",
        "template_v8ol7lc",
        {
          name: f.name,
          email: f.email,
          title: f.subject || "No Subject",
          message: f.message,
          time: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_KEY as string,
      );

      store.draft.clear();
      setDone(true);
    } catch (error) {
      console.error(error);
      setNote("Message failed to send. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  /* ── Contact information ── */
  const INFO = [
    {
      icon: "✉",
      label: "Email",
      val: personal.email,
      green: false,
    },
    {
      icon: "◎",
      label: "Location",
      val: personal.location,
      green: false,
    },
    {
      icon: "◈",
      label: "Status",
      val: personal.status,
      green: true,
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--bg0)" }}
    >
      <div className="section-wrap relative z-10">
        {/* ── Heading ── */}
        <div ref={headRef} className="mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.18em] uppercase mb-5"
            style={{
              color: "var(--accent-h)",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Get In Touch
          </div>

          <h2
            className="font-black leading-tight tracking-tight text-[clamp(2rem,4.5vw,3.2rem)]"
            style={{ fontFamily: "var(--font)" }}
          >
            Let's Work
            <br />
            <span className="g-text">Together</span>
          </h2>

          <p
            className="mt-4 text-[0.95rem] leading-[1.85] max-w-[440px]"
            style={{ color: "var(--text2)" }}
          >
            Have a project in mind or want to collaborate? I'd love to hear
            from you!
          </p>
        </div>

        {/* ── Contact body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
          {/* ── Left column ── */}
          <div ref={leftRef} className="flex flex-col gap-4">
            {/* Intro card */}
            <div
              className="rounded-3xl p-7"
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-6">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "var(--green)" }}
                />

                <span
                  className="text-[10px] font-black tracking-[0.18em] uppercase"
                  style={{ color: "var(--green)" }}
                >
                  {personal.status}
                </span>
              </div>

              <h3
                className="font-black leading-[1.2] mb-4"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(1.4rem,2.8vw,1.9rem)",
                  color: "var(--text1)",
                }}
              >
                Let's build
                <br />
                <span className="g-text">something great</span>
              </h3>

              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--text2)" }}
              >
                I'm always happy to connect, discuss ideas, and explore
                opportunities to learn and collaborate.
              </p>

              <div
                className="inline-flex items-center px-3.5 py-2 rounded-xl text-[11px] font-bold"
                style={{
                  color: "var(--text2)",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                }}
              >
                Typically replies within 24h
              </div>
            </div>

            {/* Contact info rows */}
            {INFO.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-200"
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-base font-bold"
                  style={{
                    background: "var(--bg3)",
                    color: "var(--accent-h)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="text-[9px] uppercase tracking-[0.18em] font-black mb-0.5"
                    style={{ color: "var(--text3)" }}
                  >
                    {item.label}
                  </div>

                  <div
                    className="text-sm font-semibold truncate"
                    style={{
                      color: item.green ? "var(--green)" : "var(--text1)",
                    }}
                  >
                    {item.val}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right column: contact form ── */}
          <div
            ref={formRef}
            className="rounded-3xl overflow-hidden"
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="p-8">
              {done ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center text-center py-16">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-7"
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    🎉
                  </div>

                  <h3
                    className="font-black text-2xl mb-3"
                    style={{ fontFamily: "var(--font)" }}
                  >
                    Message Sent!
                  </h3>

                  <p
                    className="text-sm leading-relaxed mb-8 max-w-xs"
                    style={{ color: "var(--text2)" }}
                  >
                    Thanks,{" "}
                    <strong style={{ color: "var(--accent-h)" }}>
                      {f.name}
                    </strong>
                    !<br />
                    I'll get back to you as soon as I can.
                  </p>

                  <button
                    onClick={() => {
                      setDone(false);
                      setF({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="px-7 py-3 rounded-xl text-sm font-black text-white transition-all duration-200 hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), var(--accent-h))",
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  {/* Form heading */}
                  <div className="mb-1">
                    <h3
                      className="font-black text-xl mb-1"
                      style={{
                        fontFamily: "var(--font)",
                        color: "var(--text1)",
                      }}
                    >
                      Send a message
                    </h3>

                    <p
                      className="text-[11px] tracking-widest uppercase"
                      style={{ color: "var(--text3)" }}
                    >
                      Fields marked * are required
                    </p>
                  </div>

                  {/* Name and email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <FL label="Your Name *" />

                      <StyledField
                        as="input"
                        name="name"
                        value={f.name}
                        onChange={change}
                        placeholder="Your name"
                        err={err.name}
                      />
                    </div>

                    <div>
                      <FL label="Email *" />

                      <StyledField
                        as="input"
                        type="email"
                        name="email"
                        value={f.email}
                        onChange={change}
                        placeholder="you@example.com"
                        err={err.email}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <FL label="Subject" />

                    <StyledField
                      as="input"
                      name="subject"
                      value={f.subject}
                      onChange={change}
                      placeholder="Project collaboration / Opportunity"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <FL label="Message *" />

                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          color:
                            f.message.length > 10
                              ? "var(--green)"
                              : "var(--text3)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {f.message.length} characters
                      </span>
                    </div>

                    <StyledField
                      as="textarea"
                      name="message"
                      value={f.message}
                      onChange={change}
                      rows={5}
                      placeholder="Tell me about your project, idea, or opportunity..."
                      err={err.message}
                    />
                  </div>

                  {/* Autosave note */}
                  {note && (
                    <p
                      className="text-[11px] text-right"
                      style={{ color: "var(--text3)" }}
                    >
                      {note}
                    </p>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), var(--accent-h))",
                      fontFamily: "var(--font)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {busy ? "Sending..." : "Send Message"}
                  </button>

                  {/* Small note */}
                  <p
                    className="text-[10px] text-center"
                    style={{ color: "var(--text3)" }}
                  >
                    Your message will be sent directly to my email.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}