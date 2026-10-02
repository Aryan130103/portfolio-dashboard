// small cache so yahoo/google are not called again and again (rate limit)
// if the fetch fails we return the old saved value instead of crashing
const store: Record<string, { value: any; time: number }> = {};

export async function getCached<T>(key: string, seconds: number, fetcher: () => Promise<T>): Promise<T> {
  const old = store[key];

  if (old && Date.now() - old.time < seconds * 1000) {
    return old.value;
  }

  try {
    const value = await fetcher();
    store[key] = { value, time: Date.now() };
    return value;
  } catch (err) {
    if (old) return old.value;
    throw err;
  }
}
