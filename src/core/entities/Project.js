class Project {
  constructor({ id, name, teamId, createdAt, updatedAt, deletedAt = null }) {
    this.id = id;
    this.name = name;
    this.teamId = teamId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt;
  }
}

export default Project;
