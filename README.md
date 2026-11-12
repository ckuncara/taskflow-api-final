# TaskFlow API

A simple task management REST API built with Spring Boot. This is the sample project for the **Module 4 - End of Module Assignment**. Refer to the assignment instructions in **NTULearn** for the full list of tasks.

## Assignment submission

> [!IMPORTANT]
> **Submit your GitHub repository link to NTULearn.** This is the only thing you submit there - your live URL, screenshots and notes all go in this `README.md`.

Fill in each section below, then commit and push this `README.md` to your GitHub repository.

### Live application URL

Your TaskFlow API deployed on Railway:

```
https://taskflow-api-final.onrender.com
```

### Screenshot: Railway dashboard

Your Railway dashboard showing the active deployment. Save the image in the `screenshots/` folder and update the file name below if needed.

![!\[screenshots/renderDashboard.png\]](https://github.com/ckuncara/taskflow-api-final/blob/main/screenshots/renderDashboard.png)

### Screenshot: Live application

Your live Railway URL returning task data (in your browser or terminal).

![!\[screenshots/renderUrl.png\]](https://github.com/ckuncara/taskflow-api-final/blob/main/screenshots/renderUrl.png)

### Errors and failures

If you didn't complete every task, list what you completed, what went wrong, and the error messages you saw. If everything worked, write "None".

```
Completed: Task 1, Task 2

Error at Task 3:
<paste the error message here>
```

### Stretch goal (optional)

Which stretch goal you chose (if any), what you built, and any links (for example, your frontend URL, CI pipeline run or Docker Hub tags).

```
Stretch goal: <option number and name, or "None">
Links: <https://...>
Notes: <what you built and anything that didn't work>
```

Stretch goal 1:
Links:
- https://github.com/ckuncara/taskflow-api-final/actions/runs/43165913902
- https://hub.docker.com/repository/docker/sailormana/taskflow-api

Notes: Built CI with Github Actions and created image on Docker Hub
Issues: Nothing

Stretch goal 2:

Link: https://beamish-dusk-361d4b.netlify.app/
Screenshots:
![!\[screenshots/frontendWithApi.png\]](https://github.com/ckuncara/taskflow-api-final/blob/main/screenshots/frontendWithApi.png)

## Getting started

### Prerequisites

- Java 21
- Maven (or use the included Maven Wrapper)

### Running the Application

From the project root:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The application starts on `http://localhost:8080`.

### API Routes

| Method | Path              | Description             | Request Body | Success Response |
|--------|-------------------|--------------------------|---------------|-------------------|
| GET    | `/api/tasks`      | Get all tasks            | —             | `200 OK`          |
| GET    | `/api/tasks/{id}` | Get a single task by ID  | —             | `200 OK`          |
| POST   | `/api/tasks`      | Create a new task        | Task JSON     | `201 Created`     |

## Deploy the frontend to Netlify

The static frontend is in the `frontend/` directory. It lists tasks and lets you create them through the deployed TaskFlow API.

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site** → **Import an existing project**, connect GitHub, and select this repository.
3. Set **Base directory** to the repository root, leave **Build command** empty, and set **Publish directory** to `frontend`. Deploy the site.
4. Copy the Netlify site URL, for example `https://your-taskflow-site.netlify.app`.
5. In Render, open your API service and go to **Environment**. Add `FRONTEND_URL` with the exact Netlify URL as its value (no trailing slash), then save and redeploy the service.
6. Open the Netlify site. The API URL field is prefilled with `https://taskflow-api-final.onrender.com`; replace it with your actual Render service URL if different, then choose **Connect**. Use **Refresh** to reload tasks or the form to add one.

The API allows browser requests only from the origin configured by `FRONTEND_URL`. For local frontend testing, the default is `http://localhost:5500`; run the API with `./mvnw spring-boot:run` and, in another terminal, run `python3 -m http.server 5500 --directory frontend`.

### Testing the API

Create a task:

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Module 3",
    "description": "Finish assignment",
    "priority": "HIGH",
    "dueDate": "2026-05-20",
    "completed": false
  }'
```

Get all tasks:

```bash
curl http://localhost:8080/api/tasks
```

Get a task by ID:

```bash
curl http://localhost:8080/api/tasks/1
```

### H2 Database Console

While the app is running, the H2 console is available at `http://localhost:8080/h2-console`.

Use the following connection settings:

- JDBC URL: `jdbc:h2:mem:taskflowdb`
- Username: `sa`
- Password: *(leave blank)*
