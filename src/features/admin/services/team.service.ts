import { HttpService } from '../../../shared/services/base/http.service';

export interface Team {
  _id: string;
  name: string;
  logoUrl?: string;
  colorCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  logoUrl?: string;
  colorCode?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  logoUrl?: string;
  colorCode?: string;
}

class TeamService extends HttpService {
  async getTeams(): Promise<Team[]> {
    return this.get('/teams');
  }

  async getTeamById(id: string): Promise<Team> {
    return this.get(`/teams/${id}`);
  }

  async createTeam(team: CreateTeamRequest): Promise<Team> {
    return this.post('/teams', team);
  }

  async updateTeam(id: string, team: UpdateTeamRequest): Promise<Team> {
    return this.patch(`/teams/${id}`, team);
  }

  async deleteTeam(id: string): Promise<void> {
    return this.delete(`/teams/${id}`);
  }
}

export const teamService = new TeamService();