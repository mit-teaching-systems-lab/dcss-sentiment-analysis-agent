# DCSS Sentiment Analysis

This repository contains an example websocket service that implements the interactions described in [DCSS Remote AI Service Integration ](https://github.com/mit-teaching-systems-lab/dcss-remote-ai-integration). This demonstration also illustrates the use of a child process.


## Directory


### `index.html`

An example web client that connects and requests analysis from the service.

### `remote-process.js`

An example server client that connects and requests analysis from the service.

### `sentiment.js`

An example binary that the server shells out to for analysis. 

### `server.js`

The core socket service. This coordinates input analysis with child processes, and responds to remote requests.


## Creating a Teacher Moments Agent

1. Navigate to [Admin/Agents](https://teachermoments.mit.edu/admin/agents) (assuming your user has sufficient privileges to access this section of the site.).
2. Click **Create a new agent**
3. Enter a name for your new agent
4. Enter a brief description
5. Enter the endpoint: `ws://dcss-saa-production.herokuapp.com`
6. Select one or more Interactions that you want to send to the agent
6. Click "Save"

