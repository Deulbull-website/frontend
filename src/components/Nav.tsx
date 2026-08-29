import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT' },
  { to: '/apply', label: 'APPLY' },
  { to: '/gallery', label: 'GALLERY' },
  { to: '/contact', label: 'CONTACT' },
];

export default function Nav() {
  return (
    <div className="sticky top-0 z-50 flex flex-col items-center bg-[rgba(8,8,10,0.88)] pt-3.5 backdrop-blur-md">
      <p className="mb-3 font-['Bebas_Neue',_Impact,_sans-serif] text-[26px] leading-[22px] tracking-[0.22em] text-white">
        DEULBULL
      </p>
      <div className="h-px w-full max-w-[430px] bg-white/10" />
      <nav className="flex w-full max-w-[430px] justify-center gap-5 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative text-[13px] font-semibold ${
                isActive ? 'text-white' : 'text-white/45 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[7px] left-0 right-0 h-0.5 bg-white" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
