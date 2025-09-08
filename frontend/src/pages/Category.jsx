import CurvedLoop from '../components/React-Bits/CurvedLoop';
import Hero from '../components/Category/Hero'
import Content from '../components/Category/Content';

export default function Category() {
  return (
    <div className="bg-white min-h-screen py-12 my-[15vh]">
      {/* Hero Section */}
      <Hero/>
      <CurvedLoop 
        marqueeText="Python ✦ Javascript ✦ PHP ✦ React ✦ Golang ✦"
        speed={3}
        curveAmount={250}
        direction="right"
        interactive={true}
        className="custom-text-style"
      />

      {/* Main Content */}
      <Content/>

    </div>
  );
}