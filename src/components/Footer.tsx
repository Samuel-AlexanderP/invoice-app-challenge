import { FaGithub, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function Footer() {
  return (
    <footer className="bg-secondaryBg dark:bg-secondaryBg-dark transition-colors w-full">
      <div className="mx-auto mt-auto flex min-h-[60px] max-w-[1920px] flex-col items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-4 text-primary dark:text-primary-dark transition">
          <FooterLink
            className=" hover:text-accent"
            icon={<FaGithub />}
            href="https://github.com/Samuel-AlexanderP"
            linkLabel="See code"
          />{" "}
          <FooterLink
            className=" hover:text-accent"
            icon={<FaPhoneAlt />}
            href="mailto:prado16alex@gmail.com"
            linkLabel="Contact dev"
          />
          <p className="m-auto font-lexend text-[0.7rem]">
            © {new Date().getFullYear()} InvoicePro
          </p>
        </div>
      </div>
    </footer>
  );
}

const FooterLink = ({
  icon,
  href,
  linkLabel,
  className = "",
}: {
  icon: ReactNode;
  href: string;
  linkLabel: string;
  className?: string;
}) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-2 text-[1rem] transition-colors duration-300 ${className}`}
    >
      {icon}
      <p className="block text-center font-lexend text-xs">{linkLabel}</p>
    </Link>
  );
};
