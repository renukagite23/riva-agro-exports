import Link from "next/link";
import { Logo } from "../icons/logo";
import { Github, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/products", label: "Products" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms & Conditions" },
        { href: "#", label: "Export Policy" },
      ],
    },
  ];

  return (
<footer className="bg-secondary border-t">
  <div className="container py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

          {/* Brand Column */}
          <div className="space-y-5">
            <Logo />

            <p className="text-sm leading-relaxed text-muted-foreground">
              Riva Agro Exports is a globally trusted exporter of premium
              agricultural products, delivering farm-fresh quality from India
              to international markets.
            </p>

       
          </div>

          {/* Company Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-lg text-gray-900">
                {section.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Exporter Info Column */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              Exporter Info
            </h4>

            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">

              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>
                  Riva Agro Exports<br />
                  Maharashtra, India
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+91 8000028181</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@rivaagroexports.com</span>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
<div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Riva Agro Exports. All rights reserved.
          </p>

          <p className="text-sm text-muted-foreground">
            Proudly Exporting Indian Agriculture Worldwide 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}