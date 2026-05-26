import { useStatistics } from "../store"

const Statistics = () => {
  const { good, neutral, bad } = useStatistics(state => state);
  const all = good + neutral + bad;
  const goodFeedback = new Array(good).fill(1);
  const neutralFeedback = new Array(neutral).fill(0);
  const badFeedback = new Array(bad).fill(-1);
  const allFeedbacks = [...goodFeedback, ...neutralFeedback, ...badFeedback];
  const totalSumOfAllFeedbacks = goodFeedback.length - badFeedback.length;
  const average = all > 0 ? totalSumOfAllFeedbacks / allFeedbacks.length : 0;
  const positive = all > 0 ? goodFeedback.length / allFeedbacks.length * 100 : 0;
  
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive}%</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
