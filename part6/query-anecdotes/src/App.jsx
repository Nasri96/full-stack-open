import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './useAnecdotes';

const App = () => {
  const { anecdotes, isError, isPending, handleVote } = useAnecdotes();

  // const anecdotes = [
  //   {
  //     content: 'If it hurts, do it more often',
  //     id: '47145',
  //     votes: 0,
  //   },
  // ]

  if(isError) {
    return <div>anecdote service not available</div>
  }

  if(isPending) {
    return <div>loading anecdotes...</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App