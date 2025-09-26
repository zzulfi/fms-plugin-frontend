import { HttpService } from '../../../shared/services/base/http.service';

export interface Participant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dob: string;
  gender: 'MALE' | 'FEMALE';
  section: {
    _id: string;
    name: string;
  };
  group?: {
    _id: string;
    name: string;
  };
  team?: {
    _id: string;
    name: string;
  };
  hasTeam: boolean;
  admNo?: string;
  chestNo?: string;
  avatar?: string;
  achievements?: string[];
  skills?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParticipantRequest {
  name: string;
  email: string;
  phone?: string;
  dob: string;
  gender: 'MALE' | 'FEMALE';
  section: string;
  group?: string;
  admNo?: string;
  chestNo?: string;
  avatar?: string;
  achievements?: string[];
  skills?: string[];
  isActive?: boolean;
}

export interface UpdateParticipantRequest {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE';
  section?: string;
  group?: string;
  admNo?: string;
  chestNo?: string;
  avatar?: string;
  achievements?: string[];
  skills?: string[];
  isActive?: boolean;
}

class ParticipantService extends HttpService {
  async getParticipants(sectionId?: string): Promise<Participant[]> {
    const endpoint = sectionId ? `/participants?section=${sectionId}` : '/participants';
    return this.get(endpoint);
  }

  async getParticipantById(id: string): Promise<Participant> {
    return this.get(`/participants/${id}`);
  }

  async createParticipant(participant: CreateParticipantRequest): Promise<Participant> {
    return this.post('/participants', participant);
  }

  async updateParticipant(id: string, participant: UpdateParticipantRequest): Promise<Participant> {
    return this.patch(`/participants/${id}`, participant);
  }

  async deleteParticipant(id: string): Promise<void> {
    return this.delete(`/participants/${id}`);
  }

  async bulkCreateParticipants(participants: CreateParticipantRequest[]): Promise<{ success: number; errors: any[] }> {
    return this.post('/participants/bulk', participants);
  }

  // Get available participants (not assigned to any team)
  async getAvailableParticipants(sectionId?: string): Promise<Participant[]> {
    const participants = await this.getParticipants(sectionId);
    return participants.filter(p => !p.hasTeam);
  }
}

export const participantService = new ParticipantService();