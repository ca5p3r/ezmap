import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        setTimeout(() => {
            fetch(url, { signal: controller.signal })
                .then(res => {
                    if (!res.ok) {
                        throw Error('Could not fetch data from server!');
                    };
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch(err => {
                    if (err.name !== 'AbortError') {
                        setIsLoading(false);
                        setError(err.message);
                    };
                });
        }, 0);

        return () => {
            controller.abort()
        };
    }, [url]);

    return { data, isLoading, error }
};

export default useFetch;