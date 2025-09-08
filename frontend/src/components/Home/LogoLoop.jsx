import LogoLoop from '../React-Bits/LogoLoop';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiExpress, 
  SiMongodb, 
  SiPython, 
  SiDjango 
} from 'react-icons/si';
import { FaFlutter } from "react-icons/fa6";

const techLogos = [
  { node: <SiReact  />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs  />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript  />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss  />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <FaFlutter  />, title: "Flutter", href: "https://flutter.dev" },
  { node: <SiNodedotjs  />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiExpress  />, title: "Express.js", href: "https://expressjs.com" },
  { node: <SiMongodb  />, title: "MongoDB", href: "https://www.mongodb.com" },
  { node: <SiPython  />, title: "Python", href: "https://www.python.org" },
  { node: <SiDjango  />, title: "Django", href: "https://www.djangoproject.com" },
];

export default function TechLogoLoop() {
  return (
    <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={60}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
  );
}
