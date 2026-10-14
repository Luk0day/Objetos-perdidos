import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { CATEGORIAS } from './constants';

const PROMPT = `Você ajuda a secretaria de uma escola a catalogar objetos achados. Analise a foto e responda em português do Brasil.
Regras:
- Descreva apenas o que é visível. Não invente marca, local, dono nem conteúdo que não aparece.
- nome: curto (ex.: "Estojo azul").
- descricao: 1 a 2 frases com cor, material, itens visíveis e sinais particulares.
- tags: 3 a 6 palavras simples, sem #.
- Se houver documento, cartão, nome, matrícula ou número legível, NÃO transcreva nada: use a categoria "Documentos e cartões" e diga apenas que é um documento ou cartão.
- categoria: uma das opções permitidas.`;

const Resposta = z.object({
  nome: z.string(),
  descricao: z.string(),
  tags: z.array(z.string()),
  categoria: z.string(),
});

export type AnaliseFoto = { nome: string; descricao: string; tags: string[]; categoria: string };

export async function analisarFoto(foto: Uint8Array, mimeType: string): Promise<AnaliseFoto> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite',
    contents: [
      {
        role: 'user',
        parts: [{ text: PROMPT }, { inlineData: { mimeType, data: Buffer.from(foto).toString('base64') } }],
      },
    ],
    config: {
      
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nome: { type: Type.STRING },
          descricao: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          categoria: { type: Type.STRING, enum: [...CATEGORIAS] },
        },
        required: ['nome', 'descricao', 'tags', 'categoria'],
      },
    },
  });
  const r = Resposta.parse(JSON.parse(res.text ?? '{}'));
  return { ...r, categoria: (CATEGORIAS as readonly string[]).includes(r.categoria) ? r.categoria : 'Outros' };
}
