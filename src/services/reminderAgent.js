import { fetchAI } from "./api";
import * as chrono from "chrono-node";

class ReminderAgent {
  constructor() {
    this.reminders = new Map();
  }

  async processReminderRequest(message) {
    try {
      // First, try to parse the date using chrono-node
      const parsedDate = chrono.parseDate(message);
      let reminderData;

      if (parsedDate) {
        // If we successfully parsed a date, create the reminder data
        reminderData = {
          task: message.replace(parsedDate.text, "").trim(),
          datetime: parsedDate.toISOString(),
          email: null,
        };
      } else {
        // If chrono couldn't parse the date, fall back to GPT
        const systemPrompt = `You are a reminder agent. Parse the following message and extract:
1. The task to be reminded about
2. The date and time for the reminder
3. The user's email (if provided)

Format the response as JSON with the following structure:
{
  "task": "string",
  "datetime": "ISO string (in UTC)",
  "email": "string or null"
}

Important rules for datetime:
1. Convert all relative dates/times to absolute UTC timestamps
2. For relative times (e.g., "tomorrow", "next week"), use the current time in UTC as reference
3. For specific times without a date (e.g., "at 2pm"), assume the next occurrence of that time
4. Always return the datetime in UTC ISO format (e.g., "2024-03-20T14:00:00Z")
5. If no specific time is provided, default to 9:00 AM UTC
6. IMPORTANT: Always ensure the datetime is in the future relative to the current UTC time

If no email is provided, set email to null.
Make sure to return ONLY the JSON object, no additional text.`;

        const response = await fetchAI("gpt-4o-mini", [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ]);

        // Try to parse the response as JSON
        try {
          reminderData = JSON.parse(response);
        } catch (parseError) {
          console.error("Error parsing GPT response:", parseError);
          // Try to extract JSON from the response if it contains additional text
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              reminderData = JSON.parse(jsonMatch[0]);
            } catch (secondParseError) {
              throw new Error("Failed to parse reminder data");
            }
          } else {
            throw new Error("No valid JSON found in response");
          }
        }
      }

      // Validate the reminder data structure
      if (!reminderData.task || !reminderData.datetime) {
        throw new Error("Invalid reminder data structure");
      }

      // Ensure the datetime is in UTC and in the future
      const reminderTime = new Date(reminderData.datetime);
      const now = new Date();

      // If the time is in the past, adjust it to the next occurrence
      if (reminderTime <= now) {
        // If it's a time-only specification (e.g., "2pm"), add 24 hours
        if (
          reminderTime.getDate() === now.getDate() &&
          reminderTime.getMonth() === now.getMonth() &&
          reminderTime.getFullYear() === now.getFullYear()
        ) {
          reminderTime.setDate(reminderTime.getDate() + 1);
        } else {
          // For other cases, add 24 hours
          reminderTime.setDate(reminderTime.getDate() + 1);
        }
      }

      // Update the reminder data with the adjusted time
      reminderData.datetime = reminderTime.toISOString();

      // Schedule the reminder
      const reminderId = this.scheduleReminder(reminderData);

      // Convert UTC to local time for display
      const localDateTime = new Date(reminderData.datetime).toLocaleString(
        undefined,
        {
          timeZoneName: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      return {
        success: true,
        message: `I'll remind you to ${reminderData.task} on ${localDateTime}`,
        reminderId,
        isReminderNotification: false,
      };
    } catch (error) {
      console.error("Error processing reminder request:", error);
      return {
        success: false,
        message: `Sorry, I couldn't process your reminder request: ${error.message}. Please try again with a clearer format like "Please remind me to call mom tomorrow at 2pm" or "Set a reminder for my dentist appointment next Monday at 10am".`,
        isReminderNotification: false,
      };
    }
  }

  scheduleReminder(reminderData) {
    const { task, datetime, email } = reminderData;
    const reminderTime = new Date(datetime);
    const now = new Date();

    // Add a small buffer (1 second) to prevent edge cases
    if (reminderTime <= new Date(now.getTime() + 1000)) {
      throw new Error("Reminder time must be in the future");
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    // Store the reminder
    const reminderId = Date.now().toString();
    this.reminders.set(reminderId, {
      task,
      datetime: reminderTime,
      email,
      timeoutId: setTimeout(async () => {
        const message = await this.sendReminder(reminderId);
        // Emit the reminder message through a custom event
        window.dispatchEvent(
          new CustomEvent("reminderNotification", {
            detail: { message },
          })
        );
      }, timeUntilReminder),
    });

    return reminderId;
  }

  async sendReminder(reminderId) {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return;

    const { task, datetime, email } = reminder;

    // Create a message for the reminder
    const message = `🔔 REMINDER: ${task}`;

    // If there's an email, add it to the message
    if (email) {
      message += ` (sent to ${email})`;
    }

    // Remove the reminder after sending
    this.reminders.delete(reminderId);

    // Return the message to be displayed
    return message;
  }

  cancelReminder(reminderId) {
    const reminder = this.reminders.get(reminderId);
    if (reminder) {
      clearTimeout(reminder.timeoutId);
      this.reminders.delete(reminderId);
      return true;
    }
    return false;
  }

  getActiveReminders() {
    return Array.from(this.reminders.entries()).map(([id, reminder]) => ({
      id,
      task: reminder.task,
      datetime: reminder.datetime,
      email: reminder.email,
    }));
  }
}

// Create a singleton instance
const reminderAgent = new ReminderAgent();
export default reminderAgent;
