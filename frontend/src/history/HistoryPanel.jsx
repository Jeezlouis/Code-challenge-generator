import {useState, useEffect} from 'react'
import MCQChallenge from '../challenge/MCQChallenge'
import {useApi} from '../utils/api'

const HistoryPanel = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const {makeRequest} = useApi()

  useEffect (() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await makeRequest("my-history")
      setHistory(data.challenges)
    } catch (err) {
      setError(err.message || "Failed to fetch history")
    } finally {
      setIsLoading(false)
    }
  }

  if(isLoading) {
    return <div className='Loading'>Loading history...</div>
  }

  if (error) {
    return <div className='error-message'>
      <p>{error}</p>
      <button onClick={fetchHistory}>Retry</button>
    </div>
  }
  
  return (
    <div className='history-panel'>
        <h2>History</h2>
        {history.length === 0 ? <p>No challenge history</p> :
          <div className='history-list'>
            {history.map((challenge) => {
              return <MCQChallenge 
              challenge={challenge} 
              key={challenge.id} 
              showExplanation
              />
            })} 
          </div>  
      }
    </div>
  )
}

export default HistoryPanel