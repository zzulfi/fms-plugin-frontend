import { HttpService } from '../../../shared/services/base/http.service';

export interface Auction {
  _id: string;
  name: string;
  status: 'upcoming' | 'active' | 'completed';
  basePrice: number;
  currentBid?: number;
  highestBidder?: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  auction: string;
  bidder: string;
  amount: number;
  timestamp: string;
}

export interface CreateAuctionRequest {
  name: string;
  basePrice: number;
  participants: string[];
}

export interface PlaceBidRequest {
  amount: number;
}

class AuctionService extends HttpService {
  async getAuctions(): Promise<Auction[]> {
    return this.get('/auctions');
  }

  async getAuction(id: string): Promise<Auction> {
    return this.get(`/auctions/${id}`);
  }

  async createAuction(auction: CreateAuctionRequest): Promise<Auction> {
    return this.post('/auctions', auction);
  }

  async startAuction(id: string): Promise<Auction> {
    return this.patch(`/auctions/${id}/start`);
  }

  async endAuction(id: string): Promise<Auction> {
    return this.patch(`/auctions/${id}/end`);
  }

  async placeBid(auctionId: string, bid: PlaceBidRequest): Promise<Bid> {
    return this.post(`/auctions/${auctionId}/bids`, bid);
  }

  async getBids(auctionId: string): Promise<Bid[]> {
    return this.get(`/auctions/${auctionId}/bids`);
  }

  async deleteAuction(id: string): Promise<void> {
    return this.delete(`/auctions/${id}`);
  }
}

export const auctionService = new AuctionService();