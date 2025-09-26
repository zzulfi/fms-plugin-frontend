import { HttpService } from '../../../shared/services/base/http.service';
import type { Participant } from '../../admin/services/participant.service';

export interface WishListItem {
  _id: string;
  participant: Participant;
  priority: number;
  notes?: string;
  addedAt: string;
}

export interface AddToWishListRequest {
  participantId: string;
  priority: number;
  notes?: string;
}

export interface UpdateWishListItemRequest {
  priority?: number;
  notes?: string;
}

class WishListService extends HttpService {
  async getWishList(): Promise<WishListItem[]> {
    return this.get('/wishlist');
  }

  async addToWishList(item: AddToWishListRequest): Promise<WishListItem> {
    return this.post('/wishlist', item);
  }

  async updateWishListItem(id: string, item: UpdateWishListItemRequest): Promise<WishListItem> {
    return this.patch(`/wishlist/${id}`, item);
  }

  async removeFromWishList(id: string): Promise<void> {
    return this.delete(`/wishlist/${id}`);
  }

  async clearWishList(): Promise<void> {
    return this.delete('/wishlist');
  }
}

export const wishListService = new WishListService();