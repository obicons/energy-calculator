import { useRouter } from 'next/router'

export type QueryStateUpdater<T> = (newState: T, replaceState?: T) => void;

export const useMyQueryState = <T,>(key: string, initialState: T): [T, QueryStateUpdater<T>] => {
    const router = useRouter();
    const query = router.query;
    const currentState = query[key] !== undefined ?
            JSON.parse(decodeURIComponent(query[key] as string)) as T
            : initialState;

    return [
        currentState,
        (newState, replaceState) => {
            if (replaceState !== undefined && query[key] !== undefined) {
                const q = {...router.query};
                q[key] = encode(replaceState);
                router.replace({
                    pathname: router.pathname,
                    query: q,
                });
            }

            const q = {...router.query};
            q[key] = encode(newState);
            router.push({
                pathname: router.pathname,
                query: q,
            });
            query[key] = q[key];
        },
    ];
};

const encode = <T,>(data: T) => encodeURIComponent(JSON.stringify(data));