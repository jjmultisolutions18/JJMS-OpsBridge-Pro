import { GoogleGenAI } from "@google/genai";
import { Project, Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getAIPriorities(tasks: Task[]) {
  const taskList = tasks.map(t => `${t.title} (${t.priority}, ${t.status}, Due: ${t.deadline || 'N/A'})`).join('\n');
  const prompt = `Based on the following tasks, suggest the top 3 priorities for today. Keep it brief and actionable.\n\nTasks:\n${taskList}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Could not generate priorities at this time.";
  }
}

export async function getRiskAnalysis(tasks: Task[], projects: Project[]) {
  const data = JSON.stringify({ tasks: tasks.slice(0, 20), projects: projects.slice(0, 10) });
  const prompt = `Analyze these projects and tasks. Identify any high-risk projects (delayed or low progress relative to deadlines) or overdue critical tasks. Summarize in 3 brief bullet points.\n\nData:\n${data}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Risk analysis unavailable.";
  }
}

export async function generateWeeklyReport(completedTasks: Task[], activeProjects: Project[]) {
    const prompt = `Generate a weekly productivity report based on ${completedTasks.length} completed tasks and ${activeProjects.length} active projects. Include a summary of achievements and recommendations for next week.`;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "Report generation failed.";
    }
}
