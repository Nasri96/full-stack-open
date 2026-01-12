import { useState } from "react"

const Title = ({ title }) => {
  return (
    <h2>{title}</h2>
  )
}

const Statistics = ({ stats }) => {
  console.log(stats);

  if(stats.all > 0) {
    return(
        <>
          <Title title="statistics" />
          <table>
            <tbody>
              <tr>
                <StatisticsLine text="good" value={stats.good} />
              </tr>
              <tr>
                <StatisticsLine text="neutral" value={stats.neutral} />
              </tr>
              <tr>
                <StatisticsLine text="bad" value={stats.bad} />
              </tr>
              <tr>
                <StatisticsLine text="all" value={stats.all} />
              </tr>
              <tr>
                <StatisticsLine text="average" value={stats.average} />
              </tr>
              <tr>
                <StatisticsLine text="positive" value={stats.positive} />
              </tr>
            </tbody>
            
          </table>
          
        </>
        
      )
  }

  return (
    <>
      <Title title="statistics" />
      <p>No feedback given</p>
    </>
  )

  
}

const StatisticsLine = ({ text, value }) => {
  return(
    <>
      <td>{text}</td>
      <td>{value}</td>
    </>
    
  )
}

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

function App() {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const { all, average, positive } = calcStats();
  const allStats = {
    good, neutral, bad, all, average, positive
  }

  const handleGood = () => {
    setGood(good + 1);
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1);
  }

  const handleBad = () => {
    setBad(bad + 1);
  }

  function calcStats() {
    const all = good + neutral + bad;


    const goodFeedback = [];
    for(let i = 0; i < good; i++) {
      goodFeedback.push(1);
    }

    const neutralFeedback = [];
    for(let i = 0; i < neutral; i++) {
      neutralFeedback.push(0);
    }

    const badFeedback = [];
    for(let i = 0; i < bad; i++) {
      badFeedback.push(-1);
    }


    const allFeedback = goodFeedback.concat(neutralFeedback).concat(badFeedback);

    let sum = 0;
    allFeedback.forEach(val => {
      sum+= val;
    })

    let average = 0;
    if(allFeedback.length > 0) {
      average = sum / allFeedback.length;
    }

    let positive = 0;
    if(goodFeedback.length > 0) {
      positive = goodFeedback.length / (goodFeedback.length + neutralFeedback.length + badFeedback.length) * 100;
    }

    return {
      all,
      average,
      positive
    }
  }

  return (
    <div>
      <Title title="give feedback" />
      <Button text="good" onClick={handleGood} />
      <Button text="neutral" onClick={handleNeutral} />
      <Button text="bad" onClick={handleBad} />
      <Statistics stats={allStats} />
    </div>
  )
  
}

export default App;
