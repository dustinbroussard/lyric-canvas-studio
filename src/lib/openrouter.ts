export type OpenRouterModel = {
  id: string;
  name: string;
  provider: string;
  isFree: boolean;
  costTier: 'FREE' | '$' | '$$' | '$$$';
  tags: string[];
};

export const openRouterModels: OpenRouterModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    isFree: false,
    costTier: '$$',
    tags: ['DETAILED', 'CREATIVE'],
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    isFree: false,
    costTier: '$$',
    tags: ['FAST', 'DETAILED'],
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: 'Google',
    isFree: false,
    costTier: '$',
    tags: ['FAST'],
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    isFree: true,
    costTier: 'FREE',
    tags: ['FREE', 'FAST'],
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    isFree: true,
    costTier: 'FREE',
    tags: ['FREE', 'FAST'],
  },
];

type PromptAnalysis = {
  mood: string;
  vibeKeywords: string[];
  colorPalette: string[];
  primarySymbols: string[];
  visualConcept: {
    subject: string;
    environment: string;
    composition: string;
    lighting: string;
  };
};

export async function generatePromptFromLyrics(
  lyrics: string,
  modelId: string,
  apiKey: string,
  presetStylePrompt?: string,
  presetNegativePrompt?: string
): Promise<{ fullPrompt: string; negativePrompt: string }> {
  const systemPrompt = `You are an expert visual artist and prompt engineer specializing in translating song lyrics into detailed image generation prompts. 

Analyze the provided lyrics and return a JSON object with this structure:
{
  "mood": "overall emotional tone",
  "vibeKeywords": ["keyword1", "keyword2", ...],
  "colorPalette": ["color1", "color2", ...],
  "primarySymbols": ["symbol1", "symbol2", ...],
  "visualConcept": {
    "subject": "main subject description",
    "environment": "setting and background",
    "composition": "framing and layout",
    "lighting": "lighting conditions and quality"
  }
}

Focus on visual, cinematic, and atmospheric elements that capture the essence of the lyrics.`;

  const userPrompt = `Analyze these song lyrics and create a visual concept:\n\n${lyrics}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from OpenRouter');
  }

  let analysis: PromptAnalysis;

  try {
    analysis = JSON.parse(content) as PromptAnalysis;
  } catch (error) {
    console.error('Failed to parse OpenRouter response', error);
    throw new Error('OpenRouter returned an unexpected response. Please try again.');
  }

  if (!analysis.visualConcept) {
    throw new Error('OpenRouter response was missing visual concept details.');
  }

  // Build the final prompt
  const promptParts: string[] = [];
  const { subject, environment, composition, lighting } = analysis.visualConcept;
  const vibeKeywords = analysis.vibeKeywords ?? [];
  const colorPalette = analysis.colorPalette ?? [];
  const primarySymbols = analysis.primarySymbols ?? [];

  const pushIfValue = (value?: string) => {
    if (value) {
      promptParts.push(value);
    }
  };

  // Add the visual concept
  [subject, environment, composition, lighting].forEach((value) => pushIfValue(value));

  // Add mood and vibe
  if (analysis.mood) {
    promptParts.push(`mood: ${analysis.mood}`);
  }
  if (vibeKeywords.length > 0) {
    promptParts.push(vibeKeywords.join(', '));
  }

  // Add color palette
  if (colorPalette.length > 0) {
    promptParts.push(`color palette: ${colorPalette.join(', ')}`);
  }

  // Add symbols
  if (primarySymbols.length > 0) {
    promptParts.push(`featuring: ${primarySymbols.join(', ')}`);
  }

  // Add preset style if provided
  if (presetStylePrompt) {
    promptParts.push(presetStylePrompt);
  }

  // Add technical details
  promptParts.push('ultra high quality, 8K resolution, professional, highly detailed');

  const fullPrompt = promptParts.join(', ');

  // Build negative prompt
  const negativePromptParts = [
    'low quality',
    'blurry',
    'distorted',
    'ugly',
    'bad anatomy',
    'watermark',
    'signature',
    'text',
  ];

  if (presetNegativePrompt) {
    negativePromptParts.push(presetNegativePrompt);
  }

  const negativePrompt = negativePromptParts.join(', ');

  return { fullPrompt, negativePrompt };
}
