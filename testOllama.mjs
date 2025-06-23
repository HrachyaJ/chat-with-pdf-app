import fetch from 'node-fetch';

const testOllama = async () => {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama2", // or whatever model you're using
      prompt: "Say hello in 2 words",
      stream: false,
    }),
  });

  const json = await res.json();
  console.log("🧠 Ollama Response:", json);
};

testOllama().catch(console.error);
