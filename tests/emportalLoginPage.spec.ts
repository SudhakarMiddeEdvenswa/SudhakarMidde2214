import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";
//import dotenv from "dotenv";

import { generateFakeUser } from "../utils/fakeUser";
import { getToday, getPastDate } from "../utils/dateUtils";
import {
  testData,
  timesheetData,
  taskAData,
  taskBData,
  taskCData,
  taskDData,
  taskEData,
  taskFData,
  taskGData,
} from "../utils/testData";
import { LoginPage } from "../tests/pages/LoginPage";
import { TasksPage } from "../tests/pages/TasksPage";
import { TimeSheetsPage } from "./pages/TimeSheetsPage";
// Load environment variables from .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Define base URL, username, and password from environment variables
const baseURL = process.env.BASE_URL ?? "";
const username = process.env.USERNAME ?? "";
const password = process.env.PASSWORD ?? "";

// Define task details for the test
const taskNameA = taskAData.taskName;
const taskDescription = taskAData.taskDescription;
const taskNameB = faker.person.fullName();
const taskDescriptionB = faker.lorem.sentence();

// Define date formats for the test
const dateFormat = "YYYY-MM-DD"; // Format for <input type="date">
const todayDate = dayjs().format(dateFormat); // Format for <input type="date">
const pastDate = dayjs().subtract(4, "day").format(dateFormat); // Format for <input type="date">
const userName = timesheetData.userName; // User name for timesheet verification

test("Emportal Login test", async ({ page }) => {
  const user = generateFakeUser();
  console.log("Generated Fake User:", user);

  const today = getToday();
  const WeekStartDate = getPastDate(4);
  console.log("Today's Date:", today);
  console.log("Week's start Date:", WeekStartDate);
  const loginPage = new LoginPage(page);

  // Log the task details
  // Navigate to the login page
  await loginPage.navigate(baseURL);
  // Fill in username and password
  if (!username || !password) {
    throw new Error("USERNAME and PASSWORD environment variables must be set.");
  }
  await loginPage.login(username, password);

  // Locate CAPTCHA image and save it
  const captchaImage = page.getByRole("img", { name: "CAPTCHA" });
  const captchaBuffer = await captchaImage.screenshot();

  const captchaPath = path.join(__dirname, "captcha.png");
  fs.writeFileSync(captchaPath, captchaBuffer);

  // Use Tesseract.js to extract text from the image
  const result = await Tesseract.recognize(captchaPath, "eng");
  const captchaText = result.data.text.trim();

  console.log("CAPTCHA Text:", captchaText);

  // Fill in the CAPTCHA field
  await loginPage.fillCaptcha(captchaText);
  // Submit the form
  await loginPage.submitLogin();
  // Verify successful login
  await expect(page).toHaveURL(baseURL + "#/home");
  // Check if the user is logged in
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  // Determine the greeting based on the current time
  let greeting = "";
  // Set greeting based on the time of day
  if (hours >= 0 && hours < 12) {
    greeting = testData.greetingTimes.morning; // "Good Morning"
  } else if (hours >= 12 && (hours < 16 || (hours === 15 && minutes <= 59))) {
    greeting = testData.greetingTimes.afternoon; // "Good Afternoon"
  } else if ((hours >= 16 && hours <= 23) || (hours === 0 && minutes === 0)) {
    greeting = testData.greetingTimes.evening; // "Good Evening"
  } else {
    greeting = "Hello";
  }
  console.log(`Current time: ${now.toLocaleTimeString()}`);
  console.log(`Greeting: ${greeting}`);
  //wait for the page to load and display the user's name
  await page.waitForSelector(`text=${greeting}, ${userName}`, {
    timeout: 10000, // Wait up to 10 seconds for the text to appear
  });
  // Verify the user is logged in
  await expect(page.getByText(`${greeting}, ${userName}`)).toBeVisible();
  //   const isLoggedIn = await loginPage.isLoggedIn(greeting, userName);
  //   expect(isLoggedIn).toBeTruthy(); //Mallela Srikanth Eedara Uma Madhav
  const tasksPage = new TasksPage(page);
  // Navigate to Manage Tasks & Verify the Manage Tasks page is visible
  await tasksPage.navigateToManageTasks();
  // Add task details
  // Click the Add Tasks button
  await tasksPage.clickAddTasks();
  // Fill in task details
  await tasksPage.fillTaskDetails(
    taskCData.taskName,
    taskCData.time,
    taskCData.taskDescription,
    WeekStartDate,
    today,
    taskCData.projectName,
    taskCData.taskCategory
  );
  // Save the task
  await tasksPage.saveTask();
  // Verify task creation
  await tasksPage.verifyTaskCreation(
    taskCData.taskName,
    taskCData.taskDescription
  );
  // Click the Add Tasks button
  await tasksPage.clickAddTasks();
  // Fill in task details
  await tasksPage.fillTaskDetails(
    taskAData.taskName,
    taskAData.time,
    taskAData.taskDescription,
    WeekStartDate,
    today,
    taskAData.projectName,
    taskAData.taskCategory
  );
  // Save the task
  await tasksPage.saveTask();
  // Verify task creation
  await tasksPage.verifyTaskCreation(
    taskAData.taskName,
    taskAData.taskDescription
  );
  // Add another task
  // Click the Add Tasks button
  await tasksPage.clickAddTasks();
  // Fill in task details
  await tasksPage.fillTaskDetails(
    taskBData.taskName,
    taskBData.time,
    taskBData.taskDescription,
    WeekStartDate,
    today,
    taskBData.projectName,
    taskBData.taskCategory
  );
  // Save the task
  await tasksPage.saveTask();
  // Verify task creation
  await tasksPage.verifyTaskCreation(
    taskBData.taskName,
    taskBData.taskDescription
  );

  // Add another task
  // Click the Add Tasks button
  await tasksPage.clickAddTasks();
  // Fill in task details
  await tasksPage.fillTaskDetails(
    taskDData.taskName,
    taskDData.time,
    taskDData.taskDescription,
    WeekStartDate,
    today,
    taskDData.projectName,
    taskDData.taskCategory
  );
  // Save the task
  await tasksPage.saveTask();
  // Verify task creation
  await tasksPage.verifyTaskCreation(
    taskDData.taskName,
    taskDData.taskDescription
  );
  // Add another task
  // Click the Add Tasks button
  await tasksPage.clickAddTasks();
  // Fill in task details
  await tasksPage.fillTaskDetails(
    taskEData.taskName,
    taskEData.time,
    taskEData.taskDescription,
    WeekStartDate,
    today,
    taskEData.projectName,
    taskEData.taskCategory
  );
  // Save the task
  await tasksPage.saveTask();
  // Verify task creation
  await tasksPage.verifyTaskCreation(
    taskEData.taskName,
    taskEData.taskDescription
  );
  // Add another task
  // Click the Add Tasks button
  await tasksPage.clickAddTasks();
  // Fill in task details
  await tasksPage.fillTaskDetails(
    taskFData.taskName,
    taskFData.time,
    taskFData.taskDescription,
    WeekStartDate,
    today,
    taskFData.projectName,
    taskFData.taskCategory
  );
  // Save the task
  await tasksPage.saveTask();
  // Verify task creation
  await tasksPage.verifyTaskCreation(
    taskFData.taskName,
    taskFData.taskDescription
  );
  // Add another task
  // Click the Add Tasks button
  await tasksPage.clickAddTasks();
  // Fill in task details
  await tasksPage.fillTaskDetails(
    taskGData.taskName,
    taskGData.time,
    taskGData.taskDescription,
    WeekStartDate,
    today,
    taskGData.projectName,
    taskGData.taskCategory
  );
  // Save the task
  await tasksPage.saveTask();
  // Verify task creation
  await tasksPage.verifyTaskCreation(
    taskGData.taskName,
    taskGData.taskDescription
  );
  // Navigate to Manage Time sheets
  const timeSheetsPage = new TimeSheetsPage(page);
  // Navigate to Manage Time sheets
  await timeSheetsPage.navigateToManageTimeSheets();
  // Assert that the tasks page is visible
  await timeSheetsPage.assertTasksPageVisible();
  // Assert that the timesheet page is visible by checking the user name
  await timeSheetsPage.assertTimesheetPageVisible(userName);
  //fill in time for the first task
  await page.getByLabel("hh:mm").first().click();
  await page.getByLabel("hh:mm").first().fill("2");
  for (let i = 1; i < 5; i++) {
    await page.getByLabel("hh:mm").nth(i).click();
    await page.getByLabel("hh:mm").nth(i).fill("2");
  }
  const items = page.getByLabel("hh:mm"); // Get all elements with the label "hh:mm"
  // Get the count of matching elements
  const count = await items.count();
  console.log(`Total items found: ${count}`);
  // Fill in time for the second task onwards from the 5th element
  for (let i = 5; i < count; i++) {
    await page.getByLabel("hh:mm").nth(i).click();
    await page.getByLabel("hh:mm").nth(i).fill("1");
  }
  // Fill in time for the first task
  //await timeSheetsPage.fillTimeForFirstTask(["2", "2", "2", "2", "2"]);
  // Fill in time for the second task
  //   await timeSheetsPage.fillTimeForSecondTask(5, [
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //     "1",
  //   ]);
  // Save the timesheet
  await timeSheetsPage.saveTimesheet();
  // Confirm the timesheet submission
  //   await timeSheetsPage.confirmTimesheetSubmission();
  // Verify timesheet submission
  //   const isSubmitted = await timeSheetsPage.verifyTimesheetSubmission();
  //   expect(isSubmitted).toBeTruthy();
  // Navigate to Manage Tasks
  await tasksPage.navigateToManageTasks();
  // Delete the first task
  await tasksPage.deleteFirstTask();
  // Verify the task is deleted
  await expect(page.getByText(taskNameA)).not.toBeVisible();
  // Delete the second task
  await tasksPage.deleteTaskByName(taskNameB);
  // Close the page (browser will be closed automatically by Playwright test runner)
  await page.close();
});
