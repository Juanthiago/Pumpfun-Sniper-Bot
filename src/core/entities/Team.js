class Team {
  constructor({ id, name, createdAt, updatedAt, deletedAt = null }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt;
  }
}
module.exports = Team;
