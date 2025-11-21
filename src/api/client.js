import api from "./axios";

class BackendService {
  constructor() {
    this.api = api;
  }

  async handleRequest(promise) {
    try {
      const response = await promise;
      return response.data;
    } catch (error) {
      console.error("API request error:", error);
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data?.detail || error.response.data
          }`
        );
      } else if (error.request) {
        throw new Error("No response from server. Please try again.");
      } else {
        throw new Error(error.message);
      }
    }
  }

  // Auth
  async syncUser() {
    return this.handleRequest(this.api.post("/auth/sync-user"));
  }

  async testToken() {
    return this.handleRequest(this.api.get("/auth/test"));
  }

  // Articles
  async createArticle({ title, content }) {
    return this.handleRequest(this.api.post("/articles/", { title, content }));
  }

  async getArticle(id) {
    return this.handleRequest(this.api.get(`/articles/${id}`));
  }

  async updateArticle(id, { title, content }) {
    return this.handleRequest(
      this.api.put(`/articles/${id}`, { title, content })
    );
  }

  async deleteArticle(id) {
    return this.handleRequest(this.api.delete(`/articles/${id}`));
  }

  // Comments
  async createComment({ article_id, content }) {
    return this.handleRequest(
      this.api.post("/comments/", { article_id, content })
    );
  }

  async getComments(article_id) {
    return this.handleRequest(this.api.get(`/comments/article/${article_id}`));
  }

  // Likes
  async toggleArticleLike(article_id) {
    return this.handleRequest(
      this.api.post(`/likes/article/${article_id}/toggle`)
    );
  }

  async toggleCommentLike(comment_id) {
    return this.handleRequest(
      this.api.post(`/likes/comment/${comment_id}/toggle`)
    );
  }

  // Search
  async search(q) {
    return this.handleRequest(this.api.get(`/search/`, { params: { q } }));
  }

  // Profile
  async getUserProfile(user_id) {
    return this.handleRequest(this.api.get(`/users/${user_id}`));
  }

  async getCurrentUserProfile() {
    return this.handleRequest(this.api.get(`/users/profile/me`));
  }
}

export const backend = new BackendService();
