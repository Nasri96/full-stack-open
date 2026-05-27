import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
    const { addAnecdote } = useAnecdoteActions();


    const handleAddAnecdote = (e) => {
        e.preventDefault();
        addAnecdote(e.target.anecdote.value)
        e.target.reset();
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleAddAnecdote}>
                <div>
                <input name='anecdote' />
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
        
    )
}

export default AnecdoteForm;