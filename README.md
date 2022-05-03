# GrooWe

!['Homepage'](snapshots/home.png)

## ⚡ Main Features

* Listen to the same songs with your buddies simultaneously.
* Interact through instant messaging, proximity audio, reactions and voting.
* A fair queue mechanism which ensures everyone's song choices gets played.
* Smooth user interface.

## 👨‍💻 Tech Stack

- Frontend: React.js, Chakra UI, Redux, Socket.io Client, Axios
- Backend: Node.js, Express.js, Redis (node-redis), Socket.io

## ⚙️ How it works

GrooWe is based on the monolithic architecture. The client communicates with the `Express.js` server through HTTP requests and `Socket.io` events. The server communicate with the YouTube API to allow users to search Youtube for songs and the Redis database to handle storing & retrieving data and searching for rooms. The Redis Adapter relies on Redis Pub/Sub mechanism which ensures horizontal scaling by adding multiple instances of the server and database.

An overview of the application core constructs is given below:

### Rooms 

Users can create rooms where others can join. A room is a place where multiple people can listen to the same songs together, at the same time. Creation of a room emits a `Socket.io` event that generates new room details on the server/database which are send back to the client. Public rooms can then be searched and joined.

Join public rooms:

!['Join public rooms'](snapshots/roomslist.png)

Create a room:

!['Create a room'](snapshots/createroom.png)

Listen to songs in the room:

!['Listen to songs in the room'](snapshots/room.png)

### Queue Mechanism

Users can join the queue in the room to have the songs in their selected playlist played. The order in which users join the queue determines the order on which songs are played. For each user in the queue, the first song in their selected playlist will be played. Then the first song will be cycled to the back of the playlist. This way, each user in the queue is guaranteed to have one of their songs played and playlists of any size will continue to keep playing until the user leaves the queue.

The queue mechanism is handled through `Socket.io` events. Events will be emitted when the song plays, or when there are no more users in the queue (as to stop the song).

### Playlists

A playlist is a collection of songs. Songs are played through playlists created by users. Users can freely add or remove songs from their playlists and rearrange the order of their songs. Playlists help facilitate the queue mechanism of GrooWe.

!['Playlists'](snapshots/playlists.png)

### Voting

Users can like or dislike the current song. This is also handled through `Socket.io` events. If at least half of the people in the room have disliked the song, it will be skipped.

## 📥 How to run it locally?

### Prerequisites:
- Node v14.17.6
- npm v8.1.3
- Redis v6.2.5 with RedisJSON v1.0 and RediSearch v2.0 

We used the [redislab/rejson](https://hub.docker.com/r/redislabs/rejson/) and [redislab/redisearch](https://hub.docker.com/r/redislabs/redisearch/) Docker images to setup Redis modules.


1. In the root directory of **frontend**, type: `npm install` to install dependencies.
2. In the root directory of **backend**, create a `.env` file with the following contents:
```dosini
REDIS_HOST=localhost    
REDIS_PASSWORD=your_password_for_redis
REDIS_PORT=redis_port
SALT_ROUNDS=10
SESSION_SECRET=your_session_secret
YOUTUBE_KEY=your_youtube_api_key
```
|Property|Description|
|---|---|
|REDIS_HOST|URL of where your Redis is hosted|
|REDIS_PASSWORD|Password to your Redis|
|REDIS_PORT|Port where Redis instance is hosted|
|SALT_ROUNDS|Number of salt rounds for bcrypt|
|SESSION_SECRET|Secret for session cookies to authenticate users |
|YOUTUBE_KEY|Your YouTube API key|
3. In the root directory of **backend**, type: `npm install` to install dependencies.
4. Run `npm start` in root directory of **backend.**
5. Run `npm start` in root directory of **frontend.**
6. Your app should be running at localhost:3000.
