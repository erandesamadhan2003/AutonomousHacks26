import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { usePublishedPosts } from "@/hooks/usePublishedPosts";
import { PostsFilter } from "@/components/PublishedPosts/PostsFilter";
import { PublishedPostCard } from "@/components/PublishedPosts/PublishedPostCard";
import { PostDetailModal } from "@/components/PublishedPosts/PostDetailModal";
import { Pagination } from "@/components/PublishedPosts/Pagination";
import { cn } from "@/lib/utils";

export default function PublishedPostsPage() {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    posts,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchPosts,
    fetchPostById,
    remove,
  } = usePublishedPosts({ page: 1, limit: 12 });

  const handleViewPost = async (post) => {
    try {
      const fullPost = await fetchPostById(post._id);
      setSelectedPost(fullPost);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Error fetching post details:", err);
    }
  };

  const handleDeletePost = async (post) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await remove(post._id);
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Published Posts
            </h1>
            <p className="text-gray-600 mt-1">
              {pagination?.total || 0} published post
              {pagination?.total !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              onClick={() => navigate("/create-post")}
              className="gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="h-4 w-4" />
              Create New Post
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <PostsFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No published posts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating and publishing posts to see them here
            </p>
            <Button
              onClick={() => navigate("/create-post")}
              className="gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="h-4 w-4" />
              Create Your First Post
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PublishedPostCard
                key={post._id}
                post={post}
                onView={() => handleViewPost(post)}
                onDelete={() => handleDeletePost(post)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Detail Modal */}
      <PostDetailModal
        isOpen={showDetailModal}
        post={selectedPost}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPost(null);
        }}
        onDelete={() => {
          handleDeletePost(selectedPost);
          setShowDetailModal(false);
          setSelectedPost(null);
        }}
        loading={loading}
      />
    </div>
  );
}
