import { useAnecdotes } from "../useAnecdotes"
import NotificationContext from "../notificationContext";

const AnecdoteForm = () => {
  const { handleCreateAnecdote } = useAnecdotes();


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    console.log('new anecdote')
    handleCreateAnecdote({ content, votes: 0 });
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm