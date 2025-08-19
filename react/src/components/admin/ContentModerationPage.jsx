import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AdminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';

const ContentModerationPage = () => {
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState({});
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'pending'
  });
  const [selectedContent, setSelectedContent] = useState(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchContent();
    fetchStats();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getContentForModeration(token, filters);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await AdminService.getContentStats(token);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleModerate = async (contentItem, action) => {
    const key = `${contentItem.type}-${contentItem.id}`;
    try {
      setModerating(prev => ({ ...prev, [key]: true }));
      
      await AdminService.moderateContent(token, {
        content_type: contentItem.type,
        content_id: contentItem.id,
        action: action,
        notes: moderationNotes
      });

      // Refresh content and stats
      await fetchContent();
      await fetchStats();
      
      setSelectedContent(null);
      setModerationNotes('');
      setShowConfirmModal(false);
      setPendingAction(null);
    } catch (error) {
      console.error('Error moderating content:', error);
    } finally {
      setModerating(prev => ({ ...prev, [key]: false }));
    }
  };

  const showConfirmation = (action) => {
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (pendingAction && selectedContent) {
      handleModerate(selectedContent, pendingAction);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'blog': return '📝';
      case 'comment': return '💬';
      case 'review': return '⭐';
      default: return '📄';
    }
  };

  if (loading && !content.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 mx-auto">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Content...</h3>
          <p className="text-gray-500">Fetching moderation queue and statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Content Moderation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Review and moderate user-generated content with advanced filtering and bulk actions
          </p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-1">
                <div className="bg-white m-1 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center">
                      <span className="text-2xl mr-3">📝</span>
                      Blogs
                    </h3>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{stats.blogs.total}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                      <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200">
                        {stats.blogs.pending}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Approved</span>
                      <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">
                        {stats.blogs.approved}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Rejected</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                        {stats.blogs.rejected}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-1">
                <div className="bg-white m-1 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center">
                      <span className="text-2xl mr-3">💬</span>
                      Comments
                    </h3>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">{stats.comments.total}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                      <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200">
                        {stats.comments.pending}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Approved</span>
                      <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">
                        {stats.comments.approved}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Rejected</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                        {stats.comments.rejected}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-1">
                <div className="bg-white m-1 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center">
                      <span className="text-2xl mr-3">⭐</span>
                      Reviews
                    </h3>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">{stats.reviews.total}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                      <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200">
                        {stats.reviews.pending}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Approved</span>
                      <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">
                        {stats.reviews.approved}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Rejected</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                        {stats.reviews.rejected}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-0 transition-colors duration-200 text-gray-700 font-medium"
              >
                <option value="all">🌐 All Content</option>
                <option value="blogs">📝 Blogs</option>
                <option value="comments">💬 Comments</option>
                <option value="reviews">⭐ Reviews</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Moderation Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-0 transition-colors duration-200 text-gray-700 font-medium"
              >
                <option value="all">📋 All Status</option>
                <option value="pending">⏳ Pending Review</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setFilters({ type: 'all', status: 'pending' })}
                variant="outline"
                className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                🔄 Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-6">
          {content.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-400">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Content Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No content matches your current filters. Try adjusting your search criteria or check back later for new submissions.
              </p>
            </div>
          ) : (
            content.map((item) => (
              <div key={`${item.type}-${item.id}`} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Content Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xl">
                          {getContentTypeIcon(item.type)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1"
                          >
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                          <Badge 
                            variant={getStatusBadgeVariant(item.status)}
                            className={`font-medium px-3 py-1 ${
                              item.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                              item.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                          {item.rating && (
                            <Badge 
                              variant="outline" 
                              className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium px-3 py-1"
                            >
                              ⭐ {item.rating}/5
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="mb-4">
                        <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                          {item.title}
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-gray-700 leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      </div>

                      {/* Content Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-2">👤 Author:</span>
                            <span className="text-gray-800 font-medium">{item.author}</span>
                          </div>
                          {item.company && (
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium mr-2">🏢 Company:</span>
                              <span className="text-gray-800 font-medium">{item.company}</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-2">📅 Created:</span>
                            <span className="text-gray-800">{new Date(item.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                        
                        {(item.moderated_by || item.moderation_notes) && (
                          <div className="space-y-2">
                            {item.moderated_by && (
                              <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-2">🛡️ Moderated by:</span>
                                <span className="text-gray-800 font-medium">{item.moderated_by}</span>
                              </div>
                            )}
                            {item.moderated_at && (
                              <div className="flex items-center text-gray-600">
                                <span className="font-medium mr-2">⏰ Moderated:</span>
                                <span className="text-gray-800">{new Date(item.moderated_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                            )}
                            {item.moderation_notes && (
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <span className="font-medium text-blue-800 text-sm">📝 Moderation Notes:</span>
                                <p className="text-blue-700 text-sm mt-1">{item.moderation_notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {item.status === 'pending' && (
                      <div className="ml-6 flex flex-col gap-3">
                        <Button
                          onClick={() => setSelectedContent(item)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          🔍 Review
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Moderation Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{getContentTypeIcon(selectedContent.type)}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Moderate {selectedContent.type.charAt(0).toUpperCase() + selectedContent.type.slice(1)}
                      </h2>
                      <p className="text-indigo-100 opacity-90">Review and take action on this content</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedContent(null);
                      setModerationNotes('');
                    }}
                    variant="outline"
                    className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-opacity-30 rounded-xl"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Content Preview */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
                    Content Preview
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-xl text-gray-900 mb-3">{selectedContent.title}</h4>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedContent.content}</p>
                    </div>
                  </div>
                </div>

                {/* Content Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">📊 Content Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-blue-700">Author:</span> <span className="text-blue-900">{selectedContent.author}</span></div>
                      {selectedContent.company && <div><span className="font-medium text-blue-700">Company:</span> <span className="text-blue-900">{selectedContent.company}</span></div>}
                      {selectedContent.rating && <div><span className="font-medium text-blue-700">Rating:</span> <span className="text-blue-900">{selectedContent.rating}/5 ⭐</span></div>}
                      <div><span className="font-medium text-blue-700">Submitted:</span> <span className="text-blue-900">{new Date(selectedContent.created_at).toLocaleString()}</span></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">⚡ Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-purple-700">Type:</span> <span className="text-purple-900">{selectedContent.type.charAt(0).toUpperCase() + selectedContent.type.slice(1)}</span></div>
                      <div><span className="font-medium text-purple-700">Status:</span> <span className="text-purple-900">{selectedContent.status.charAt(0).toUpperCase() + selectedContent.status.slice(1)}</span></div>
                      <div><span className="font-medium text-purple-700">Word Count:</span> <span className="text-purple-900">{selectedContent.content.split(' ').length} words</span></div>
                    </div>
                  </div>
                </div>

                {/* Moderation Notes */}
                <div>
                  <label className="flex items-center text-lg font-bold text-gray-800 mb-3">
                    <span className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-600 rounded-full mr-3"></span>
                    Moderation Notes (Optional)
                  </label>
                  <textarea
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 h-32 resize-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Add detailed notes about your moderation decision, feedback for the author, or reasons for approval/rejection..."
                  />
                  <p className="text-sm text-gray-500 mt-2">💡 These notes will be visible to other administrators and can help maintain consistency in moderation decisions.</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setSelectedContent(null);
                      setModerationNotes('');
                    }}
                    variant="outline"
                    className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => showConfirmation('reject')}
                    variant="destructive"
                    disabled={moderating[`${selectedContent.type}-${selectedContent.id}`]}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {moderating[`${selectedContent.type}-${selectedContent.id}`] ? '🔄 Processing...' : '❌ Reject'}
                  </Button>
                  <Button
                    onClick={() => showConfirmation('approve')}
                    disabled={moderating[`${selectedContent.type}-${selectedContent.id}`]}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {moderating[`${selectedContent.type}-${selectedContent.id}`] ? '🔄 Processing...' : '✅ Approve'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 ${pendingAction === 'approve' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">
                    {pendingAction === 'approve' ? '✅' : '❌'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {pendingAction === 'approve' ? 'Approve Content' : 'Reject Content'}
                </h3>
                <p className="text-gray-600 text-lg">
                  Are you sure you want to {pendingAction} this {selectedContent?.type}?
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left">
                  <p className="font-semibold text-gray-800 mb-1">"{selectedContent?.title}"</p>
                  <p className="text-sm text-gray-600">by {selectedContent?.author}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingAction(null);
                  }}
                  variant="outline"
                  className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-medium"
                  disabled={moderating[`${selectedContent?.type}-${selectedContent?.id}`]}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  className={`px-8 py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                    pendingAction === 'approve' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  }`}
                  disabled={moderating[`${selectedContent?.type}-${selectedContent?.id}`]}
                >
                  {moderating[`${selectedContent?.type}-${selectedContent?.id}`] ? (
                    <>🔄 Processing...</>
                  ) : (
                    <>{pendingAction === 'approve' ? '✅ Confirm Approval' : '❌ Confirm Rejection'}</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModerationPage;
