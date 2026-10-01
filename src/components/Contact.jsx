import { useState } from "react";
import { EMAIL } from "../site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Enter your name.";
  if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address.";
  if (message.trim().length < 10) errors.message = "Write at least 10 characters.";
  return errors;
}

const field =
  "mt-2 w-full border-0 border-b-2 border-black/40 bg-transparent py-3 text-xl text-black outline-none transition-colors placeholder:text-black/45 focus:border-black";

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-black">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-black">
          {error}
        </p>
      )}
    </div>
  );
}

function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
    setSent(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    // No backend: hand the message to the visitor's email app.
    const subject = encodeURIComponent(`Message from ${values.name.trim()}`);
    const body = encodeURIComponent(`${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const props = (id) => ({
    id,
    name: id,
    value: values[id],
    onChange,
    "aria-invalid": Boolean(errors[id]),
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });

  return (
    <section
      id="contact"
      className="bg-band px-6 py-28 text-black [--ink:#000] md:px-10 lg:px-14"
    >
      <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <div>
          <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            Tell us about your pick-up points.
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed">
            Send a few lines and we will reply by email, or write to us directly at{" "}
            <a href={`mailto:${EMAIL}`} className="font-bold underline underline-offset-4">
              {EMAIL}
            </a>
            .
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-8">
          <Field id="name" label="Name" error={errors.name}>
            <input {...props("name")} type="text" autoComplete="name" className={field} placeholder="Your name" />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input {...props("email")} type="email" autoComplete="email" className={field} placeholder="you@company.com" />
          </Field>
          <Field id="message" label="Message" error={errors.message}>
            <textarea {...props("message")} rows={4} className={`${field} resize-none`} placeholder="What are you working on?" />
          </Field>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="submit"
              className="rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            >
              Send message
            </button>
            {sent && (
              <p role="status" className="text-sm font-semibold">
                Opening your email app. If nothing opens, write to {EMAIL}.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;