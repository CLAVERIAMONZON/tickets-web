const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaJ-whtPA3Y7-kljPH8TG-5QKcPS5LEwaY44zWuH8oj7yWFE0A6DKtCBN0YdYE9D0rNg/exec';

export async function POST(request) {
  const data = await request.json();

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const text = await response.text();

  return Response.json({
    success: true,
    googleResponse: text
  });
}