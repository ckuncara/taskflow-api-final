const apiUrlInput = document.querySelector("#api-url");
const connectButton = document.querySelector("#connect-button");
const refreshButton = document.querySelector("#refresh-button");
const statusMessage = document.querySelector("#status-message");
const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");
const savedApiUrl = localStorage.getItem("taskflow-api-url");

if (savedApiUrl) {
  apiUrlInput.value = savedApiUrl;
}

function getTasksUrl() {
  const baseUrl = apiUrlInput.value.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("Enter the base URL of your deployed API.");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new Error("Enter a valid API URL, such as https://your-api.onrender.com.");
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
    throw new Error("Use an HTTPS URL for your deployed API.");
  }

  localStorage.setItem("taskflow-api-url", baseUrl);
  return `${baseUrl}/api/tasks`;
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = `task-card${task.completed ? " completed" : ""}`;

  const indicator = document.createElement("span");
  indicator.className = "task-indicator";
  indicator.setAttribute("aria-hidden", "true");

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title || "Untitled task";
  content.append(title);

  if (task.description) {
    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description;
    content.append(description);
  }

  const metadata = document.createElement("div");
  metadata.className = "task-meta";

  if (task.priority) {
    const priority = document.createElement("span");
    const normalizedPriority = task.priority.toLowerCase();
    priority.className = `priority-${normalizedPriority}`;
    priority.textContent = `${task.priority} priority`;
    metadata.append(priority);
  }

  if (task.dueDate) {
    const dueDate = document.createElement("span");
    dueDate.textContent = `Due ${task.dueDate}`;
    metadata.append(dueDate);
  }

  const state = document.createElement("span");
  state.textContent = task.completed ? "Completed" : "In progress";
  metadata.append(state);
  content.append(metadata);
  card.append(indicator, content);
  return card;
}

async function loadTasks() {
  taskList.replaceChildren();
  setStatus("Loading tasks...");
  refreshButton.disabled = true;
  connectButton.disabled = true;

  try {
    const response = await fetch(getTasksUrl(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`The API responded with ${response.status} ${response.statusText}.`);
    }

    const tasks = await response.json();
    if (!Array.isArray(tasks)) {
      throw new Error("The API response was not a task list.");
    }

    if (tasks.length === 0) {
      setStatus("Connected successfully. No tasks yet.");
      const emptyState = document.createElement("p");
      emptyState.className = "empty-state";
      emptyState.textContent = "Your task list is clear. Add a task to get started.";
      taskList.append(emptyState);
      return true;
    }

    tasks.forEach((task) => taskList.append(createTaskCard(task)));
    setStatus(`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} loaded.`);
    return true;
  } catch (error) {
    setStatus(
      `${error.message} Check the API URL and its FRONTEND_URL CORS setting in Render.`,
      true,
    );
    return false;
  } finally {
    refreshButton.disabled = false;
    connectButton.disabled = false;
  }
}

connectButton.addEventListener("click", loadTasks);
refreshButton.addEventListener("click", loadTasks);

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = taskForm.querySelector('button[type="submit"]');
  const formData = new FormData(taskForm);
  const task = {
    title: formData.get("title").trim(),
    description: formData.get("description").trim() || null,
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate") || null,
    completed: false,
  };

  submitButton.disabled = true;
  setStatus("Saving your task...");

  try {
    const response = await fetch(getTasksUrl(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`The API responded with ${response.status} ${response.statusText}.`);
    }

    taskForm.reset();
    if (await loadTasks()) {
      setStatus("Task added successfully.");
    } else {
      setStatus("Task was added, but the task list could not be refreshed.", true);
    }
  } catch (error) {
    setStatus(
      `${error.message} Check the API URL and its FRONTEND_URL CORS setting in Render.`,
      true,
    );
  } finally {
    submitButton.disabled = false;
  }
});

loadTasks();
