import { FiShield } from "react-icons/fi";

export default function RecaptchaDisclosure({ styles }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 text-center ${styles.textMuted}`}>
      <FiShield className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />

      <p className="text-[10px] leading-relaxed">
        Protected by reCAPTCHA.{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-opacity hover:opacity-70">
          Privacy
        </a>{" "}
        &{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-opacity hover:opacity-70">
          Terms
        </a>
      </p>
    </div>
  );
}
