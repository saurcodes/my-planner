import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import {
  DailyPlanRequest,
  DailyPlanResponse,
  SuggestedTask,
  VoiceTaskInput,
  CreateTaskDTO,
  Task,
} from '@time-management/shared';
import { logger } from '../utils/logger';

class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
  }

  async generateDailyPlan(
    userId: string,
    planRequest: DailyPlanRequest,
    userTasks: Task[]
  ): Promise<DailyPlanResponse> {
    try {
      const prompt = this.buildDailyPlanPrompt(planRequest, userTasks);

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      const plan = this.parseDailyPlanResponse(responseText);

      logger.info('Daily plan generated successfully', { userId });
      return plan;
    } catch (error) {
      logger.error('Error generating daily plan', error);
      throw error;
    }
  }

  async parseVoiceToTask(input: VoiceTaskInput): Promise<CreateTaskDTO> {
    try {
      const text = input.transcript || 'Parse the audio to text';

      const prompt = `Parse the following task description and extract structured information:

"${text}"

Extract and return a JSON object with the following fields:
- title: string (concise task title)
- description: string (detailed description if provided)
- urgency: number 1-10 (based on keywords like "urgent", "ASAP", "whenever", etc.)
- importance: number 1-10 (based on context and impact)
- estimatedMinutes: number (if time mentioned, otherwise null)
- tags: string[] (relevant categories like "work", "personal", "health", etc.)

Return ONLY the JSON object, no additional text.`;

      const message = await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '{}';
      const taskData = JSON.parse(responseText);

      return taskData;
    } catch (error) {
      logger.error('Error parsing voice to task', error);
      throw error;
    }
  }

  async generateInsights(
    userId: string,
    tasks: Task[],
    analyticsData: any
  ): Promise<any[]> {
    try {
      const prompt = `Analyze the following productivity data and generate 3-5 actionable insights:

Tasks Summary:
- Total tasks: ${tasks.length}
- Completed: ${tasks.filter(t => t.status === 'completed').length}
- Urgent & Important: ${tasks.filter(t => t.quadrant === 'urgent_important').length}

Analytics:
${JSON.stringify(analyticsData, null, 2)}

For each insight, provide:
1. type: (productivity_pattern, time_management, focus_improvement, task_prioritization, work_life_balance)
2. title: brief title
3. description: what you observed
4. recommendation: specific actionable advice

Return as JSON array.`;

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]';
      const insights = JSON.parse(responseText);

      return insights;
    } catch (error) {
      logger.error('Error generating insights', error);
      throw error;
    }
  }

  private buildDailyPlanPrompt(planRequest: DailyPlanRequest, existingTasks: Task[]): string {
    const answersText = planRequest.answers
      .map(a => `Q${a.questionId}: ${a.answer}`)
      .join('\n');

    const existingTasksText = existingTasks
      .map(t => `- ${t.title} (Urgency: ${t.urgency}, Importance: ${t.importance})`)
      .join('\n');

    return `You are an AI productivity assistant. Based on the user's answers to daily planning questions and their existing tasks, create an optimized daily schedule.

User's Answers:
${answersText}

Existing Tasks:
${existingTasksText || 'No existing tasks'}

Generate a daily plan with:
1. Suggested new tasks based on their answers
2. Prioritized schedule including existing and new tasks
3. Time blocks with breaks
4. Productivity insights

Return as JSON with this structure:
{
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "urgency": number (1-10),
      "importance": number (1-10),
      "estimatedMinutes": number,
      "suggestedSchedule": "ISO 8601 datetime",
      "reason": "why this task is suggested",
      "tags": ["string"]
    }
  ],
  "schedule": [
    {
      "startTime": "ISO 8601 datetime",
      "endTime": "ISO 8601 datetime",
      "taskTitle": "string",
      "type": "work" | "break" | "focus"
    }
  ],
  "insights": ["string"],
  "estimatedCompletionTime": "HH:mm"
}

Important:
- Schedule urgent & important tasks first
- Include regular breaks
- Respect working hours
- Be realistic with time estimates
- Consider energy levels throughout the day`;
  }

  private parseDailyPlanResponse(responseText: string): DailyPlanResponse {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                       responseText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, responseText];

      const jsonText = jsonMatch[1] || responseText;
      const plan = JSON.parse(jsonText);

      // Convert ISO strings to Date objects
      plan.tasks = plan.tasks.map((task: any) => ({
        ...task,
        suggestedSchedule: new Date(task.suggestedSchedule),
      }));

      plan.schedule = plan.schedule.map((block: any) => ({
        ...block,
        startTime: new Date(block.startTime),
        endTime: new Date(block.endTime),
      }));

      return plan;
    } catch (error) {
      logger.error('Error parsing daily plan response', { error, responseText });
      throw new Error('Failed to parse AI response');
    }
  }
}

export const claudeService = new ClaudeService();
