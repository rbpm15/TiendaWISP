import { Router, type Request, type Response } from 'express';
import OpenAI from 'openai';
import { prisma } from '../../database/prisma.js';
import { config } from '../../config/env.js';

export const aiRouter = Router();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: config.openrouterApiKey,
});

async function buildSystemPrompt(): Promise<string> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { category: 'asc' },
  });

  const stockTable = products
    .map((p) => {
      const specs = [
        p.frequency && `Freq: ${p.frequency}`,
        p.gainDbi && `Ganancia: ${p.gainDbi} dBi`,
        p.maxDistanceKm && `Alcance: ${p.maxDistanceKm} km`,
        p.throughput && `Throughput: ${p.throughput}`,
        p.poeType && `PoE: ${p.poeType}`,
        p.linkType && p.linkType !== 'N/A' && `Tipo: ${p.linkType}`,
      ].filter(Boolean).join(' | ');

      const stockStatus = p.quantity === 0
        ? '⛔ SIN STOCK'
        : p.quantity <= p.minStock
          ? `⚠️ BAJO (${p.quantity} uds)`
          : `✅ ${p.quantity} uds`;

      return `- [${p.sku}] ${p.name} (${p.brand}) — ${p.category}\n  ${specs}\n  Stock: ${stockStatus} | Costo: $${p.costPrice} | Venta: $${p.sellPrice}`;
    })
    .join('\n\n');

  return `Eres el asistente técnico de TiendaWisp, un sistema de inventario para proveedores de servicios de telecomunicaciones (WISP).

Tu función es ayudar al técnico/operador a:
1. Recomendar equipos del inventario para enlaces, instalaciones y proyectos
2. Verificar stock disponible antes de recomendar
3. Calcular costos y precios de venta sugeridos
4. Alertar si el stock está bajo o agotado

REGLAS IMPORTANTES:
- SOLO recomienda productos que están en el inventario actual
- Si un producto no tiene stock, indícalo claramente y sugiere alternativas
- Siempre muestra el SKU, precio de venta, y stock disponible
- Para enlaces, considera: distancia, frecuencia, ganancia, tipo de enlace
- Para instalaciones a clientes, recomienda: antena/CPE + cable + accesorios
- Incluye el costo total estimado del kit
- Responde en español
- Sé conciso y técnico pero amigable

INVENTARIO ACTUAL:
${stockTable}

Cuando te pregunten por un enlace, considera:
- Hasta 3 km: NanoStation, SXT Lite5 (PtMP/CPE)
- 3-7 km: LiteBeam 5AC, NanoBeam 5AC (PtP)
- 7-25 km: PowerBeam 5AC 500 (PtP, alta ganancia)
- 25+ km: airFiber 5XHD (Backhaul)

Para instalaciones a clientes, un kit típico incluye:
- 1x Antena/CPE
- 1x Cable UTP exterior (longitud según torre)
- 1x Kit de montaje
- 1x Inyector PoE (si aplica)
- 1x Protector de descargas (recomendado)`;
}

// POST /api/ai/chat
aiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId = 'default', model } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message es requerido' });
    }

    if (!config.openrouterApiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY no configurada' });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content: message },
    });

    // Get recent chat history for context
    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const systemPrompt = await buildSystemPrompt();

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // Stream response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const selectedModel = model || config.aiModel || 'openai/gpt-4o-mini';

    const stream = await openai.chat.completions.create({
      model: selectedModel,
      messages,
      stream: true,
      max_tokens: 2000,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save assistant response
    await prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content: fullResponse },
    });

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('AI chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error en el asistente IA' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Error en respuesta IA' })}\n\n`);
      res.end();
    }
  }
});

// GET /api/ai/history
aiRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const sessionId = (req.query.sessionId as string) || 'default';
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ data: messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// GET /api/ai/sessions
aiRouter.get('/sessions', async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.chatMessage.findMany({
      select: { sessionId: true },
      distinct: ['sessionId'],
    });
    res.json({ data: sessions.map(s => s.sessionId) });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Error al obtener sesiones' });
  }
});

// DELETE /api/ai/history — Clear chat
aiRouter.delete('/history', async (req: Request, res: Response) => {
  try {
    const sessionId = (req.query.sessionId as string) || 'default';
    await prisma.chatMessage.deleteMany({ where: { sessionId } });
    res.json({ message: 'Historial eliminado' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Error al limpiar historial' });
  }
});
