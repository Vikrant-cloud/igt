import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

export function useReactQuery<TData = unknown>(
    queryKey: string[],
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData> {
    return useQuery({
        queryKey,
        queryFn,
        staleTime: Infinity, // default behavior (can override via `options`)
        ...options,          // allows overriding staleTime, etc.
    });
}
