import { db } from '../database/connection';
import { Tag, CreateTagDTO, UpdateTagDTO } from '@time-management/shared';

class TagService {
  async getTags(userId: string): Promise<Tag[]> {
    const rows = await db.query<any>(
      'SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC',
      [userId]
    );
    return rows.map(this.mapRowToTag);
  }

  async createTag(userId: string, data: CreateTagDTO): Promise<Tag> {
    const row = await db.query<any>(
      `INSERT INTO tags (user_id, name, color)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, data.name, data.color]
    );
    return this.mapRowToTag(row[0]);
  }

  async updateTag(id: string, userId: string, updates: UpdateTagDTO): Promise<Tag | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.color !== undefined) {
      fields.push(`color = $${paramIndex++}`);
      values.push(updates.color);
    }

    if (fields.length === 0) {
      return this.getTag(id, userId);
    }

    values.push(id, userId);
    const query = `UPDATE tags SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`;

    const rows = await db.query<any>(query, values);
    return rows.length > 0 ? this.mapRowToTag(rows[0]) : null;
  }

  async deleteTag(id: string, userId: string): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM tags WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.length > 0;
  }

  private async getTag(id: string, userId: string): Promise<Tag | null> {
    const rows = await db.query<any>(
      'SELECT * FROM tags WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return rows.length > 0 ? this.mapRowToTag(rows[0]) : null;
  }

  private mapRowToTag(row: any): Tag {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      color: row.color,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const tagService = new TagService();
