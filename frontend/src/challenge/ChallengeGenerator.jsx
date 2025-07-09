import {useState, useEffect} from 'react'
import MCQChallenge from './MCQChallenge'
import {useApi} from '../utils/api'


const ChallengeGenerator = () => {
  const [challenge, setChallenge] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [difficulty, setDifficulty] = useState("easy")
  const [quota, setQuota] = useState(null)
  const {makeRequest} = useApi()

  useEffect(() => {
    fetchQuota()
  }, [])
  const fetchQuota = async () => {
    try {
      const quotaData = await makeRequest("quota")
      setQuota(quotaData)
    } catch (error) {
      console.log(err)
    }
  }
  const generateChallenge = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const challengeData = await makeRequest("generate-challenge", {
        method: "POST",
        body: JSON.stringify({
          difficulty: difficulty
        })
      })
      setChallenge(challengeData)
      fetchQuota()
    } catch (error) {
      setError(error.message || "Failed to geneate challenge")
    } finally {
      setIsLoading(false)
    }
  }

  const getNextResetTime = () => {
    if (!quota.last_reset_data) return null
    const resetDate = new Date(quota.last_reset_data)
    resetDate.setDate(resetDate.getHours() + 24)
    return resetDate
  }
  return (
    <div className='challenge-container'>
      
      <h2>Coding Challenge Generator</h2>

      <div>
        <p>Challenges remaining today: {quota?.quota_remaining || 0}</p>
        {quota?.quota_remaining === 0 && (
          <p>Next reset: {getNextResetTime()?.toLocaleString()}</p>
        )} 
      </div>
      <div className='difficulty-selector'>
        <label htmlFor='difficulty'>Select Difficulty</label>
        <select 
         value={difficulty}
          id="difficulty"
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={isLoading}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
      </div>

      <button
        onClick={generateChallenge}
        disabled={false}
        className='generate-button'
      >
        {isLoading ? "Generating..." : "Generate Challenge"}
      </button>

      {error && (
      <div className='error-message'>
        <p>{error.toString()}</p> {/* Or use error.message */}
      </div>
      )}


        {challenge && <MCQChallenge challenge={challenge} />}
    </div>
  )
}

export default ChallengeGenerator