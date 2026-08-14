export default async function TestPage() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.TMDB_API_BASE_URL;

  console.log("🔍 Debug info:");
  console.log("API Key:", apiKey ? "✅ Exists" : "❌ Missing");
  console.log("Base URL:", baseUrl);

  if (!apiKey || !baseUrl) {
    return <div className="p-4">❌ Missing environment variables!</div>;
  }

  try {
    const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    const response = await fetch(url);

    if (!response.ok) {
      return (
        <div className="p-4">
          ❌ TMDB API error: {response.status}
        </div>
      );
    }

    const data = await response.json();
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">✅ TMDB API Working!</h1>
        <p>Found {data.results.length} movies</p>
        <pre className="bg-gray-100 p-2 mt-4 rounded">
          {JSON.stringify(data.results[0], null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4">
        ❌ Fetch error: {String(error)}
      </div>
    );
  }
}