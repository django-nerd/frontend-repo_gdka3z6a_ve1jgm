import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative w-full h-[560px] bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto h-full px-4 flex items-center">
        <div className="max-w-2xl">
          <motion.h1 initial={{opacity:0, y: 20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Temukan pasangan hidup yang sejalan dengan nilai dan visi hidupmu.
          </motion.h1>
          <motion.p initial={{opacity:0, y: 20}} animate={{opacity:1, y:0}} transition={{duration:0.8}} className="mt-4 text-gray-600 text-lg">
            Serius, aman, dan transparan — bukan untuk main-main.
          </motion.p>
          <motion.div initial={{opacity:0, y: 20}} animate={{opacity:1, y:0}} transition={{duration:1}} className="mt-6 flex gap-3">
            <a href="/checkout" className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Mulai sekarang</a>
            <a href="#fitur" className="inline-flex items-center px-5 py-3 rounded-lg bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition">Lihat fitur</a>
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
    </div>
  );
}
