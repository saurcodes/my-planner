export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string; // Hex color code
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagDTO {
  name: string;
  color: string;
}

export interface UpdateTagDTO {
  name?: string;
  color?: string;
}
