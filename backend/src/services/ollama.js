/**
 * Ollama API Service
 * Handles communication with Ollama LLM
 */

export async function callOllama(prompt, systemPrompt = '', baseUrl = 'http://192.168.43.139:11434', model = 'llama3.2:3b') {
  const url = `${baseUrl}/api/generate`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 2048,
        top_p: 0.9,
        repeat_penalty: 1.1
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

export async function streamOllama(prompt, systemPrompt, ws, baseUrl = 'http://localhost:11434', model = 'llama3.2:3b') {
  const url = `${baseUrl}/api/generate`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
      stream: true,
      options: {
        temperature: 0.7,
        num_predict: 2048,
        top_p: 0.9,
        repeat_penalty: 1.1
      }
    })
  });
  
  if (!response.ok) {
    ws.send(JSON.stringify({ type: 'ERROR', error: `Ollama error: ${response.status}` }));
    return;
  }
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            ws.send(JSON.stringify({ 
              type: 'TOKEN', 
              content: data.response,
              done: data.done || false
            }));
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function checkOllamaHealth(baseUrl = 'http://localhost:11434') {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        status: 'connected',
        models: data.models || []
      };
    }
    
    return { status: 'error', error: `HTTP ${response.status}` };
  } catch (error) {
    return { 
      status: 'disconnected', 
      error: error.message 
    };
  }
}

export async function getOllamaModels(baseUrl = 'http://localhost:11434') {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return (data.models || []).map(m => ({
        name: m.name,
        size: m.size,
        modified: m.modified_at
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get Ollama models:', error);
    return [];
  }
}

export async function pullModel(model = 'llama3.2:3b', baseUrl = 'http://localhost:11434', onProgress) {
  const response = await fetch(`${baseUrl}/api/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: model, stream: true })
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (onProgress && (data.status || data.digest)) {
            onProgress({
              status: data.status,
              digest: data.digest ? `${data.digest.slice(0, 12)}...` : '',
              completed: data.completed || false
            });
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    
    return { success: true };
  } finally {
    reader.releaseLock();
  }
}
