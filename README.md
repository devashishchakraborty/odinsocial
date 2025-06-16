# OdinSocial

OdinSocial is a **Twitter‑style social media application**. This repository contains only the **front‑end**  code that powers the web client.

> **Backend repo:** [devashishchakraborty/odinsocial‑backend](https://github.com/devashishchakraborty/odinsocial‑backend)  
> **Live Link:** [https://odinsocial.pages.dev](https://odinsocial.pages.dev)

## ✨ Key Features

| Area | What you can do |
| --- | --- |
| **Posts** | Create & like posts |
| **Comments & Replies** | Comment on posts and reply to comments for rich conversations |
| **Real‑time chat** | 1‑to‑1 messaging via WebSockets (Socket.IO) |
| **Bookmarks** | Save posts for later in a personal list |
| **Profiles** | View any user’s profile, bio & posts |
| **Profile editing** | Update bio, name, & **upload a new image** |
| **Follow system** | Follow / unfollow users & see counts instantly |
| **Explore** | Search users & posts with dynamic filters |
| **Responsive UI** | Mobile‑first layout, smooth animations |


---

## 🛠️ Tech Stack

| Layer | Libraries & Tools |
| --- | --- |
| **Core** | [React](https://react.dev/), [Vite](https://vitejs.dev/), TypeScript |
| **Routing** | `react‑router‑dom` |
| **State** | React Context API + `useReducer`, `useState` |
| **Real‑time** | `socket.io‑client` |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/)|

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/devashishchakraborty/odinsocial.git
cd odinsocial
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root and add:

```env
VITE_API_BASE_URL="http://localhost:3000"
```

Update the URL based on your backend deployment/local setup.

### 4. Run the App

```bash
npm run dev
```

App will run at `http://localhost:5173` by default.

---

## Future Enhancements

- Media Upload in Posts
- Group Chat
- File sharing in chats
- Making Notifications Section functional
- Adding Delete and Edit functionality to posts
