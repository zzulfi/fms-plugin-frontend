import { HttpService } from '../../../shared/services/base/http.service';

export interface Group {
  _id: string;
  name: string;
  section: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  section: string;
}

export interface UpdateGroupRequest {
  name?: string;
}

class GroupService extends HttpService {
  async getGroups(sectionId?: string): Promise<Group[]> {
    const endpoint = sectionId ? `/groups?section=${sectionId}` : '/groups';
    return this.get(endpoint);
  }

  async createGroup(group: CreateGroupRequest): Promise<Group> {
    return this.post('/groups', group);
  }

  async updateGroup(id: string, group: UpdateGroupRequest): Promise<Group> {
    return this.patch(`/groups/${id}`, group);
  }

  async deleteGroup(id: string): Promise<void> {
    return this.delete(`/groups/${id}`);
  }
}

export const groupService = new GroupService();