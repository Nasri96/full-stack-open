import { getAnecdotes, createAnecdote, updateAnecdote } from './requests';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useNotify from './useNotify';

export const useAnecdotes = () => {
    const queryClient = useQueryClient();
    const { setNotificationMessage } = useNotify();

    const result = useQuery({
        queryKey: ["anecdotes"],
        queryFn: getAnecdotes
    })


    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
            setNotificationMessage(`you voted for '${updatedAnecdote.content}' !`);
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        }
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (createdAnecdote) => {
            console.log(createdAnecdote);
            queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
            setNotificationMessage(`anecdote '${createdAnecdote.content}' created!`);
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        },
        onError: () => {
            setNotificationMessage("too short anecdote, must have length 5 or more");
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
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