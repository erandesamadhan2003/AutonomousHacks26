import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useDrafts } from "@/hooks/useDrafts";
import { cn } from "@/lib/utils";
import { DraftsFilter } from "@/components/Drafts/DraftsFilter";
import { DraftCard } from "@/components/Drafts/DraftCard";
import { DraftDetailModal } from "@/components/Drafts/DraftDetailModal";
import { DeleteConfirmModal } from "@/components/Drafts/DeleteConfirmModal";
import { Pagination } from "@/components/Drafts/Pagination";

export default function DraftsPage() {
  const navigate = useNavigate();
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    platform: "all",
    search: "",
    page: 1,
    limit: 12,
  });

  const {
    drafts,
    loading,
    error,
    pagination,
    filters: hookFilters,
    setFilters: setHookFilters,
    fetchDrafts,
    fetchDraftById,
    update,
    remove,
    publish,
  } = useDrafts(filters);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    setHookFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    setHookFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    fetchDrafts();
  };

  const handleSelectDraft = async (draftId) => {
    await fetchDraftById(draftId);
    setSelectedDraftId(draftId);
  };

  const handleUpdateDraft = async (draftId, updates) => {
    try {
      await update(draftId, updates);
      setSelectedDraftId(null);
    } catch (err) {
      console.error("Error updating draft:", err);
    }
  };

  const handleDeleteDraft = async () => {
    try {
      await remove(draftToDelete);
      setDraftToDelete(null);
    } catch (err) {
      console.error("Error deleting draft:", err);
    }
  };

  const handlePublishDraft = async (draftId, platforms) => {
    try {
      await publish(draftId, platforms);
      setSelectedDraftId(null);
    } catch (err) {
      console.error("Error publishing draft:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "text-blue-600";
      case "processing":
        return "text-yellow-600";
      case "ready":
        return "text-green-600";
      case "published":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "draft":
        return "bg-blue-50";
      case "processing":
        return "bg-yellow-50";
      case "ready":
        return "bg-green-50";
      case "published":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Drafts
            </h1>
            <p className="text-gray-600 mt-1">
              {pagination?.total || 0} draft{pagination?.total !== 1 ? "s" : ""}
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
              New Draft
            </Button>
          </div>
        </div>

        {/* Filters */}
        <DraftsFilter filters={filters} onFilterChange={handleFilterChange} />

        {/* Error Alert */}
        {error && (
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-rose-900">
                  Error loading drafts
                </p>
                <p className="text-sm text-rose-700">{error}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                className="shrink-0"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Drafts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse space-y-4">
                    <div className="w-full h-32 bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : drafts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {drafts.map((draft) => (
                <DraftCard
                  key={draft._id}
                  draft={draft}
                  onSelect={() => handleSelectDraft(draft._id)}
                  onDelete={() => setDraftToDelete(draft._id)}
                  getStatusColor={getStatusColor}
                  getStatusBg={getStatusBg}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No drafts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start creating content by clicking the button below
              </p>
              <Button
                onClick={() => navigate("/create-post")}
                className="gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4" />
                Create Your First Draft
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Draft Detail Modal */}
        {selectedDraftId && (
          <DraftDetailModal
            draftId={selectedDraftId}
            onClose={() => setSelectedDraftId(null)}
            onUpdate={handleUpdateDraft}
            onPublish={handlePublishDraft}
          />
        )}

        {/* Delete Confirmation Modal */}
        {draftToDelete && (
          <DeleteConfirmModal
            draftId={draftToDelete}
            onConfirm={handleDeleteDraft}
            onCancel={() => setDraftToDelete(null)}
          />
        )}
      </div>
    </div>
  );
}
