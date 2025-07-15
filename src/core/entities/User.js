class User {
  constructor({
    id,
    name,
    email,
    password,
    role,
    createdAt,
    updatedAt,
    deletedAt = null,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt;
  }
}

module.exports = User;
