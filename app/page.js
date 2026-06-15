export default function Home() {
  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '1.25rem 2rem',
        background: 'rgba(250, 250, 249, 0.85)',
        backdropFilter: 'blur(8px)',
        textAlign: 'center',
      }}>
        <a href="#" style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '0.2px',
          color: '#1c1b1a',
          textDecoration: 'none',
        }}>Greg Frye</a>
      </nav>

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <h1 style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#1c1b1a',
          maxWidth: '90vw',
        }}>A strategic creative partner shepherding leaders and seekers to cohesive resonance.</h1>
      </main>

      <footer style={{
        padding: '2rem',
        textAlign: 'center',
      }}>
        <a href="mailto:gregoryfrye@gmail.com" style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '0.2px',
          color: '#1c1b1a',
          textDecoration: 'none',
        }}>gregoryfrye@gmail.com</a>
      </footer>
    </>
  );
}
