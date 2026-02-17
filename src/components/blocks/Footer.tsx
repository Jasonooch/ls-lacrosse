import { SOCIAL_LINKS } from '@/lib/social-links';

const Footer = () => {
  return (
    <footer>
      <div className="bg-[var(--primary)] pt-[40px] pb-[70px]">
        <div className="border-t-2 border-[var(--accent)]">
          <div className="container">
            <div className="flex gap-x-8 pt-12 px-8 pb-8 justify-center">
              {SOCIAL_LINKS.map((link, index) => {
                const Icon = link.icon; // ← capitalize it
                return (
                  <a
                    key={index}
                    href={link.href}
                    className="text-white hover:opacity-80 transition-opacity"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;