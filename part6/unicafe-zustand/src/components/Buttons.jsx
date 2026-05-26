import { useStatistics } from "../store";

const Buttons = () => {
  const actions = useStatistics(state => state.actions);

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={actions.goodFeedback}>good</button>
      <button onClick={actions.neutralFeedback}>neutral</button>
      <button onClick={actions.badFeedback}>bad</button>
    </div>
  )
}

export default Buttons
