import { getAnecdotes, createAnecdote, updateAnecdote } from './requests';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAnecdotes = () => {
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: ["anecdotes"],
        queryFn: getAnecdotes
    })


    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
        }
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
        }
    })


    return {
        anecdotes: result.data,
        isError: result.isError,
        isPending: result.isPending,
        handleCreateAnecdote: (anecdote) => newAnecdoteMutation.mutate(anecdote),
        handleVote: (anecdote) => updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    }
}