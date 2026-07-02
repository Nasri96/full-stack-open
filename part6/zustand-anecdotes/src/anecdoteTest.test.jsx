import { beforeEach, describe, it, expect, vi } from "vitest";
import { renderHook, act, screen, render } from "@testing-library/react";
import { useAnecdoteActions, useAnecdotes, useAnecdoteStore } from "./store";
import AnecdoteList from "./components/AnecdoteList";

vi.mock("./services/anecdotes", () => {
    return {
        anecdotesService: {
            getAnecdotes: vi.fn(),
            createAnecdote: vi.fn(),
            voteForAnecdote: vi.fn(),
            deleteAnecdote: vi.fn()
        }
    }
})

import { anecdotesService } from './services/anecdotes';


beforeEach(() => {
    useAnecdoteStore.setState( { anecdotes: [], filter: "" });
    vi.clearAllMocks();
})

describe("anecdote tests", () => {
    it("verifies the state is initialized ", async() => {
        const mockAnecdotes = [{ id: 0, content: "Test", votes: 1 }];
        anecdotesService.getAnecdotes.mockResolvedValue(mockAnecdotes);

        const { result } = renderHook(() => useAnecdoteActions());

        await act(async () => {
            await result.current.initializeAnecdotes();
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes());
        
        expect(anecdotesResult.current).toEqual(mockAnecdotes);
    })

    it("verifies the component displaying anecdotes receives the anecdotes from the store sorted by votes", async() => {
        const mockAnecdotes = [
            { id: 1, content: "third", votes: 3 },
            { id: 2, content: "first", votes: 10 },
            { id: 3, content: "second", votes: 7 }
        ];

        anecdotesService.getAnecdotes.mockResolvedValue(mockAnecdotes);

        const { result } = renderHook(() => useAnecdoteActions());

        await act(async () => {
            await result.current.initializeAnecdotes();
            render(<AnecdoteList />)
        })

        const elements = Array.from(document.querySelectorAll('.anecdote'))

        expect(elements[0].textContent).toContain(mockAnecdotes[1].content);
        expect(elements[1].textContent).toContain(mockAnecdotes[2].content);
        expect(elements[2].textContent).toContain(mockAnecdotes[0].content);
    })

    it("verifies the correct React component receives a properly filtered list of anecdotes", async() => {
        const mockAnecdotes = [
            { id: 1, content: "third", votes: 3 },
            { id: 2, content: "first", votes: 10 },
            { id: 3, content: "second", votes: 7 }
        ];

        anecdotesService.getAnecdotes.mockResolvedValue(mockAnecdotes);

        const { result } = renderHook(() => useAnecdoteActions());

        await act(async () => {
            await result.current.setFilter("first");
            render(<AnecdoteList />);
        })

        const elements = Array.from(document.querySelectorAll('.anecdote'))

        expect(elements).toHaveLength(1);
        expect(elements[0].textContent).toContain(mockAnecdotes[1].content);
    })

    it("verifies that voting increases the number of votes for an anecdote", async() => {
        const anecdote = { id: 1, content: "first", votes: 0 };
        useAnecdoteStore.setState({ anecdotes: [anecdote], filter: "" });

        const { result } = renderHook(() => useAnecdoteActions());

        await act(async() => {
            await result.current.voteAnecdote(1);
        })

        const { result: anecdotesResult } = renderHook(() => useAnecdotes());

        expect(anecdotesResult.current[0].votes).toEqual(1);
    })
})