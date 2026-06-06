import { useAnecdoteActions, useNotificationActions } from "../store";
import { anecdotesService } from "../services/anecdotes";


const AnecdoteForm = () => {
    const { addAnecdote } = useAnecdoteActions();
    const { setNotification } = useNotificationActions();


    const handleAddAnecdote = async(e) => {
        e.preventDefault();
        const createdAnecdote = await anecdotesService.createAnecdote(e.target.anecdote.value);
        addAnecdote(createdAnecdote);
        setNotification(`${createdAnecdote.content} created.`);
        setTimeout(() => {
            setNotification(null);
        }, 5000);
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