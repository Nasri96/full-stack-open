import { create } from "zustand";

const useStatistics = create(set => {
    return {
        good: 0,
        neutral: 0,
        bad: 0,
        actions: {
            goodFeedback: () => set(state => ( { good: state.good + 1 })),
            neutralFeedback: () => set(state => ( { neutral: state.neutral + 1} )),
            badFeedback: () => set(state => ( { bad: state.bad + 1} )),
        }
        
    }
})


export { useStatistics };