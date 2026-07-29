import Cursor from './components/Cursor'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Experience from './components/Experience'
import { ScrollProvider } from './context/ScrollContext'

export default function App() {
  return (
    <ScrollProvider>
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </ScrollProvider>
  )
}
