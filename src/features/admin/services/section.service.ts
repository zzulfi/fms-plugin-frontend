import { HttpService } from '../../../shared/services/base/http.service';

export interface Section {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionRequest {
  name: string;
}

export interface UpdateSectionRequest {
  name: string;
}

class SectionService extends HttpService {
  async getSections(): Promise<Section[]> {
    return this.get('/sections');
  }

  async createSection(section: CreateSectionRequest): Promise<Section> {
    return this.post('/sections', section);
  }

  async updateSection(id: string, section: UpdateSectionRequest): Promise<Section> {
    return this.patch(`/sections/${id}`, section);
  }

  async deleteSection(id: string): Promise<void> {
    return this.delete(`/sections/${id}`);
  }
}

export const sectionService = new SectionService();