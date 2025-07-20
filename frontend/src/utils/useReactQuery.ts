import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

export function useReactQuery<TData = unknown>(
    queryKey: [string, number, number],
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData> {
    return useQuery({
        queryKey,
        queryFn,
        ...options,          // allows overriding staleTime, etc.
    });
}
