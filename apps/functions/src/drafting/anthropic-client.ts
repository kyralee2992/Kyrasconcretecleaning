import Anthropic from '@anthropic-ai/sdk';
import { DRAFT_QUOTE_TOOL } from './prompt';

/**
 * The structured output we expect back from the model. Mirrors the
 * input_schema on DRAFT_QUOTE_TOOL. Callers should still zod-validate
 * at the orchestrator boundary — this is the TypeScript-level hint only.
 */
export interface DraftQuoteToolOutput {
  lineItems: Array<{
    description: string;
    quantityDesc?: string;
    amountCents: number;
  }>;
  totalCents: number;
  draftReasoning: string;
  confidenceWarnings?: string[];
}

export interface DraftQuoteRequest {
  systemPrompt: string;
  userPrompt: string;
}

export interface DraftQuoteApi {
  callDraftQuoteTool(req: DraftQuoteRequest): Promise<DraftQuoteToolOutput>;
}

export interface CreateDraftQuoteApiOptions {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  maxRetries?: number;
}

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_MAX_RETRIES = 3;

export function createDraftQuoteApi(
  opts: CreateDraftQuoteApiOptions,
): DraftQuoteApi {
  const client = new Anthropic({
    apiKey: opts.apiKey,
    maxRetries: opts.maxRetries ?? DEFAULT_MAX_RETRIES,
  });

  return {
    async callDraftQuoteTool({ systemPrompt, userPrompt }) {
      const response = await client.messages.create({
        model: opts.model ?? DEFAULT_MODEL,
        max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
        system: [
          {
            type: 'text',
            text: systemPrompt,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: userPrompt }],
        tools: [DRAFT_QUOTE_TOOL],
        tool_choice: { type: 'tool', name: DRAFT_QUOTE_TOOL.name },
      });

      const toolBlock = response.content.find((b) => b.type === 'tool_use');
      if (!toolBlock || toolBlock.type !== 'tool_use') {
        throw new Error(
          'Anthropic response did not contain a tool_use block',
        );
      }
      if (toolBlock.name !== DRAFT_QUOTE_TOOL.name) {
        throw new Error(
          `Unexpected tool in response: ${toolBlock.name}`,
        );
      }
      return toolBlock.input as DraftQuoteToolOutput;
    },
  };
}
