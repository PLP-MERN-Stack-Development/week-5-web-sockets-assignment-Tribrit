// In-memory storage (for production, use a database)
const users = [];

class User {
  static async join(id, username, room) {
    // Validate data
    if (!username || !room) {
      return { error: 'Username and room are required' };
    }

    // Check for existing user
    const existingUser = users.find(
      (user) => user.room === room && user.username === username
    );

    if (existingUser) {
      return { error: 'Username is already taken in this room' };
    }

    // Store user
    const user = { id, username, room };
    users.push(user);
    return { user };
  }

  static async getUser(id) {
    return users.find((user) => user.id === id);
  }

  static async leave(id) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }

  static async getRoomUsers(room) {
    return users.filter((user) => user.room === room);
  }
}

module.exports = User;