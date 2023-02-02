import { useState, useEffect } from 'react'
import { TypeAnimation } from 'react-type-animation'
import styles from './Home.module.scss'
import Card from '../Components/Card'

export default function Home() {
  const [message, setMessage] = useState('')
  const [animationTiming, setAnimationTiming] = useState('6s')
  const [loadingText, setLoadingText] = useState('Loading')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState()
  const [mode, setMode] = useState('invert(0)')

  useEffect(() => {
    const interval = setInterval(() => {
      if (loading) {
        setLoadingText((loadingText) => loadingText === 'Loading...' ? 'Loading' : loadingText + '.')
      }
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchResults(message)
      setLoading(true)
      setAnimationTiming('2s')
    }
  }

  const fetchResults = (query) => {
    fetch('https://philos-ai-api-tlvor5bzuq-uc.a.run.app/search/' + encodeURI(query) + '?count=12')
      .then(res => res.json())
      .then(data => {
        setResults(data.map(result =>
          <Card
            key={result.id}
            id={result.id}
            author={result.author}
            sentence={result.passage}
            school={result.school}
            title={result.title}
          />
        ))
        console.log(data)
        setLoading(false)
        setMessage('')
        setAnimationTiming('0s')
      })
      .catch(e => console.log(e))
  }

  return (
    <div className={styles.background} style={{ animationDuration: animationTiming, filter: mode }}>
      <div className='absolute top-4 right-4 font-mono select-none cursor-pointer' onClick={() => mode === 'invert(0)' ? setMode('invert(0.9)') : setMode('invert(0)')}>Dark Mode</div>
      {!results ?
        <div className='w-full h-screen flex flex-col justify-center items-center gap-8'>
          {!loading ?
            <>
              <TypeAnimation
                className='md:text-8xl text-6xl font-mono'
                sequence={[
                  'PHILOS_AI',
                ]}
                speed='5'
                cursor={false}
              >
              </TypeAnimation>
              <input
                className="max-w-xl w-3/4 font-mono text-xl border border-gray-200 rounded-md outline-none p-4 drop-shadow-md"
                type="text"
                placeholder='Ask a question...'
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </>
            :
            <span className='font-mono text-lg'>
              {loadingText}
            </span>
          }
        </div>
        :
        <div className='w-full h-fit p-16 flex justify-center'>
          <div className='max-w-screen-2xl flex flex-col items-center gap-6'>
            <nav className='w-full'>
              <a className='font-mono text-lg underline hover:font-bold cursor-pointer' onClick={() => { setResults(); setAnimationTiming('6s') }}>Back</a>
            </nav>
            <div className='grow grid md:grid-cols-2 lg:grid-cols-3 gap-10 my-auto'>
              {results}
            </div>
          </div>
        </div>
      }
    </div>
  )
}
