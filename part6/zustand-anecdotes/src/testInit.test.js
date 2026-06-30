import { beforeEach, describe, it, expect, vi } from "vitest";
import { renderHook, act, screen } from "@testing-library/react";
import { useAnecdoteActions, useAnecdotes, useAnecdoteStore } from "./store";

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
        })

        const items = screen.getAllByLabelText("anecdote");

        expect(items[0]).toHaveTextContent("first");
        expect(items[1]).toHaveTextContent("second");
        expect(items[2]).toHaveTextContent("third");
    })
})