const baseUrl = "http://localhost:3001/anecdotes";

export const anecdotesService = {
    getAnecdotes: async() => {
        const response = await fetch(baseUrl);

        if(!response.ok) {
            throw new Error("error fetching anecdotes");
        }

        return await response.json();
    },
    createAnecdote: async(anecdoteContent) => {
        const newAnecdote = { content: anecdoteContent, votes: 0 };

        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newAnecdote)
        })

        if(!response.ok) {
            throw new Error("error creating new anecdote");
        }

        return await response.json();
    },
    voteForAnecdote: async(anecdote) => {
        const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };

        const response = await fetch(`${baseUrl}/${anecdote.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(votedAnecdote)

        })

        if(!response.ok) {
            throw new Error("error voting for anecdote");
        }

        return await response.json();
    },
    deleteAnecdote: async(anecdoteId) => {
        const response = await fetch(`${baseUrl}/${anecdoteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }

        })

        if(!response.ok) {
            throw new Error("error deleting anecdote");
        }

        return await response.json();
    }
}