import { useEffect } from "react";
import { useAnecdoteActions, useAnecdotes, useNotificationActions } from "../store";
import { anecdotesService } from "../services/anecdotes";

const AnecdoteList = () => {
    const anecdotes = useAnecdotes();
    const { voteAnecdote, initializeAnecdotes, removeAnecdote } = useAnecdoteActions();
    const { setNotification } = useNotificationActions();

    useEffect(() => {
        initializeAnecdotes();
    }, [initializeAnecdotes])

    const vote = async(anecdote) => {
        const votedAnecdote = await anecdotesService.voteForAnecdote(anecdote);
        voteAnecdote(votedAnecdote.id);
        setNotification(`You voted for '${votedAnecdote.content}'`);
        setTimeout(() => {
            setNotification(null);
        }, 5000)
    }

    const handleDeleteAnecdote = (anecdoteId) => {
        anecdotesService.deleteAnecdote(anecdoteId);
        removeAnecdote(anecdoteId);
    }

    return (
        <>
        {anecdotes.map(anecdote => (
            <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
                {anecdote.votes === 0 && <button onClick={() => handleDeleteAnecdote(anecdote.id)}>delete</button>}
                
            </div>
            </div>
        ))}
        </>
        
    )
}

export default AnecdoteList;