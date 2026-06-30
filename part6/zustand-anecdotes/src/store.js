
import { create } from 'zustand';
import { anecdotesService } from './services/anecdotes';

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    addAnecdote: anecdote => {
      return set(state => {
        return { anecdotes: state.anecdotes.concat(anecdote) };
      })
    },
    voteAnecdote: anecdoteId => {
      return set(state => {
        return { 
          anecdotes: state.anecdotes
          .map(anecdote => anecdote.id === anecdoteId ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote)
          .toSorted((a, b) => b.votes - a.votes)
        }
      })
    },
    setFilter: filterVal => {
      return set(state => {
        return {
          filter: filterVal
        }
      })
    },
    initializeAnecdotes: async() => {
      const anecdotes = await anecdotesService.getAnecdotes();
      set(state => {
        return { anecdotes: anecdotes.toSorted((a, b) => b.votes - a.votes) };
      })
    },
    removeAnecdote: async(anecdoteId) => {
      set(state => {
        return { anecdotes: state.anecdotes.filter(a => a.id !== anecdoteId) };
      })
    }
  },
}))

const useNotificationStore = create((set, get) => {
  return {
    notification: null,
    actions: {
      setNotification: (message) => {
        set(state => {
          return { notification: message }
        })
      }
    }
  }
})


export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes);
  const filter = useAnecdoteStore(state => state.filter);
  
  if(!filter) {
    return anecdotes;
  }

  return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()));
}

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions);


export const useNotifications = () => {
  const notifications = useNotificationStore(state => state.notification);
  return notifications;
}

export const useNotificationActions = () => {
  const notificationActions = useNotificationStore(state => state.actions);
  return notificationActions;
}