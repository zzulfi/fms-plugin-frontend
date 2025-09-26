import { HttpService } from '../../../shared/services/base/http.service'

const httpService = new HttpService()

export interface CreateAuctionRequest {
  name: string
  description?: string
  timer?: number // in seconds
  extraTime?: number // in seconds
  firstTeamsOrder: string[] // team IDs in order
  section: string // section ID
  authorizedManagers?: string[] // user IDs
}

export interface AuctionResponse {
  _id: string
  name: string
  description?: string
  timer?: number
  extraTime?: number
  firstTeamsOrder: string[]
  section: {
    _id: string
    name: string
  }
  authorizedManagers: Array<{
    _id: string
    email: string
    name: string
    team?: {
      _id: string
      name: string
    }
  }>
  status: 'draft' | 'live' | 'completed'
  accessCode?: string
  createdAt: string
  updatedAt: string
}

export interface UserResponse {
  _id: string
  email: string
  name: string
  role: string
  team?: {
    _id: string
    name: string
  }
}

class AuctionService {
  private baseUrl = '/auctions'

  async getAuctions(): Promise<AuctionResponse[]> {
    try {
      const response = await httpService.get<{ auctions: AuctionResponse[] } | AuctionResponse[]>(this.baseUrl)
      // Handle both possible response formats
      return Array.isArray(response) ? response : response.auctions || []
    } catch (error) {
      console.error('Error fetching auctions:', error)
      throw error
    }
  }

  async getAuctionById(id: string): Promise<AuctionResponse> {
    try {
      const response = await httpService.get<AuctionResponse>(`${this.baseUrl}/${id}`)
      return response
    } catch (error) {
      console.error('Error fetching auction:', error)
      throw error
    }
  }

  async createAuction(data: CreateAuctionRequest): Promise<AuctionResponse> {
    try {
      const response = await httpService.post<AuctionResponse>(this.baseUrl, data)
      return response
    } catch (error) {
      console.error('Error creating auction:', error)
      throw error
    }
  }

  async updateAuction(id: string, data: Partial<CreateAuctionRequest>): Promise<AuctionResponse> {
    try {
      const response = await httpService.patch<AuctionResponse>(`${this.baseUrl}/${id}`, data)
      return response
    } catch (error) {
      console.error('Error updating auction:', error)
      throw error
    }
  }

  async deleteAuction(id: string): Promise<void> {
    try {
      await httpService.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error('Error deleting auction:', error)
      throw error
    }
  }

  async getUsers(): Promise<UserResponse[]> {
    try {
      const response = await httpService.get<UserResponse[]>('/auth/users')
      return response
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  async startAuction(id: string, accessCode: string): Promise<AuctionResponse> {
    try {
      const response = await httpService.post<AuctionResponse>(`${this.baseUrl}/${id}/start`, { accessCode })
      return response
    } catch (error) {
      console.error('Error starting auction:', error)
      throw error
    }
  }

  async endAuction(id: string, accessCode: string): Promise<AuctionResponse> {
    try {
      const response = await httpService.post<AuctionResponse>(`${this.baseUrl}/${id}/end`, { accessCode })
      return response
    } catch (error) {
      console.error('Error ending auction:', error)
      throw error
    }
  }
}

export const auctionService = new AuctionService()