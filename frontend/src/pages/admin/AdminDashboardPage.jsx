import React, { useState, useEffect } from 'react'
import {
  ShieldAlert,
  Users,
  Package,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Unlock,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react'
import { adminService } from '../../api/adminService'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminDashboardPage() {
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState('users') // 'overview' | 'users' | 'listings' | 'reports'

  // Data states
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter states for users
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  // Filter state for reports
  const [reportStatusFilter, setReportStatusFilter] = useState('All')

  // Modals state
  const [confirmBlockUser, setConfirmBlockUser] = useState(null)
  const [resolveReportModal, setResolveReportModal] = useState(null)
  const [resolutionNotes, setResolutionNotes] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [u, l, r] = await Promise.all([
        adminService.getUsers({ search: userSearch, role: roleFilter }),
        adminService.getListings(),
        adminService.getReports(),
      ])
      setUsers(u || [])
      setListings(l || [])
      setReports(r || [])
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [userSearch, roleFilter])

  // Toggle user block
  const handleToggleBlock = async () => {
    if (!confirmBlockUser) return
    const updated = await adminService.toggleUserBlock(confirmBlockUser.id)
    setUsers((prev) =>
      prev.map((u) => (u.id === confirmBlockUser.id ? { ...u, status: updated.status } : u))
    )
    addToast({
      type: updated.status === 'blocked' ? 'warning' : 'success',
      title: updated.status === 'blocked' ? 'User Suspended' : 'User Reinstated',
      message: `${confirmBlockUser.name} is now ${updated.status}.`,
    })
    setConfirmBlockUser(null)
  }

  // Remove listing
  const handleRemoveListing = async (listingId, title) => {
    await adminService.removeListing(listingId)
    setListings((prev) => prev.filter((l) => l.id !== listingId))
    addToast({
      type: 'info',
      title: 'Listing Removed',
      message: `"${title}" has been taken down by administrator action.`,
    })
  }

  // Resolve report
  const handleResolveReport = async (e) => {
    e.preventDefault()
    if (!resolveReportModal) return
    await adminService.resolveReport(resolveReportModal.id, resolutionNotes || 'Resolved by admin')
    setReports((prev) =>
      prev.map((r) =>
        r.id === resolveReportModal.id
          ? { ...r, status: 'resolved', resolutionNotes: resolutionNotes || 'Resolved by admin' }
          : r
      )
    )
    addToast({
      type: 'success',
      title: 'Issue Resolved',
      message: `Report ${resolveReportModal.id} marked as resolved.`,
    })
    setResolveReportModal(null)
    setResolutionNotes('')
  }

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Master Administration Suite</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal dark:text-cream-50 mt-1">
            Platform Moderation &amp; Governance
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Supervise user trust, enforce food hygiene compliance, and adjudicate reported issues.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 rounded-2xl text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>{pendingReportsCount} Pending Reports Require Review</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 font-bold'
              : 'text-gray-500 hover:text-charcoal dark:hover:text-cream-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 font-bold'
              : 'text-gray-500 hover:text-charcoal dark:hover:text-cream-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 font-bold'
              : 'text-gray-500 hover:text-charcoal dark:hover:text-cream-50'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Reports Queue</span>
          {pendingReportsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {pendingReportsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT TABLE */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-gray-400">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-charcoal text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Roles</option>
                <option value="restaurant">Restaurant</option>
                <option value="donor">Farm / Producer</option>
                <option value="ngo">NGO / Shelter</option>
                <option value="receiver">Receiver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 dark:bg-charcoal-dark border-b border-gray-100 dark:border-gray-800 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Trust Rating</th>
                    <th className="py-3 px-4">Meals Saved</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Governance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-charcoal dark:text-cream-50 font-medium">
                  {users.map((u) => {
                    const isBlocked = u.status === 'blocked'
                    return (
                      <tr key={u.id} className="hover:bg-cream-50/50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center uppercase text-xs">
                            {u.name[0]}
                          </div>
                          <div>
                            <span className="font-bold block">{u.name}</span>
                            <span className="text-[11px] text-gray-400">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize font-semibold">{u.role}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge status={isBlocked ? 'Cancelled' : 'Available'} size="sm">
                            {isBlocked ? 'SUSPENDED' : 'ACTIVE'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-amber-500 font-bold">
                          ★ {u.trustRating || '5.0'}
                        </td>
                        <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">
                          {u.impactMeals || 0}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {u.joinedDate || '2026-01-01'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {u.role !== 'admin' && (
                            <Button
                              variant={isBlocked ? 'outline' : 'danger'}
                              size="sm"
                              onClick={() => setConfirmBlockUser(u)}
                              leftIcon={isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            >
                              {isBlocked ? 'Unblock' : 'Suspend'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <Card key={l.id} className="p-0 overflow-hidden flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge status={l.status} size="sm" />
                    <span className="text-xs text-gray-400">ID: {l.id}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-charcoal dark:text-cream-50 truncate">
                      {l.title}
                    </h3>
                    <p className="text-xs text-brand-600 font-semibold">{l.category} • {l.quantity} {l.unit}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{l.description}</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-[11px] text-gray-500">
                    <strong>Donor:</strong> {l.donor?.name || 'Local Donor'} • 📍 {l.pickupLocation}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <Link to={`/foods/${l.id}`} className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveListing(l.id, l.title)}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Take Down Listing
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS QUEUE */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          
          <div className="flex gap-2 text-xs">
            {['All', 'pending', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setReportStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-colors ${
                  reportStatusFilter === st
                    ? 'bg-brand-600 text-white'
                    : 'bg-white dark:bg-charcoal text-gray-500 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {reports
              .filter((r) => reportStatusFilter === 'All' || r.status === reportStatusFilter)
              .map((rep) => {
                const isPending = rep.status === 'pending'
                return (
                  <Card key={rep.id} className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge status={isPending ? 'Rejected' : 'Collected'} size="sm">
                          {isPending ? 'PENDING ACTION' : 'RESOLVED'}
                        </Badge>
                        <span className="text-xs text-gray-400">Report #{rep.id}</span>
                        <span className="text-xs text-gray-400">• {new Date(rep.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h4 className="font-heading font-bold text-sm text-charcoal dark:text-cream-50">
                        Target: {rep.targetTitle} ({rep.targetType.toUpperCase()})
                      </h4>

                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        <strong>Reason:</strong> {rep.reason}
                      </p>

                      <p className="text-[11px] text-gray-500">
                        Submitted by: {rep.reporterName}
                      </p>

                      {rep.resolutionNotes && (
                        <div className="p-2.5 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-xs text-brand-800 dark:text-brand-300 border border-brand-100 dark:border-brand-900/40">
                          <strong>Resolution:</strong> {rep.resolutionNotes}
                        </div>
                      )}
                    </div>

                    {isPending && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setResolveReportModal(rep)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="shrink-0"
                      >
                        Resolve Report
                      </Button>
                    )}
                  </Card>
                )
              })}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Block/Unblock */}
      <Modal
        isOpen={Boolean(confirmBlockUser)}
        onClose={() => setConfirmBlockUser(null)}
        title={confirmBlockUser?.status === 'blocked' ? 'Reinstate User Account' : 'Suspend User Account'}
        description={`Confirm governance action for ${confirmBlockUser?.name}.`}
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {confirmBlockUser?.status === 'blocked'
              ? 'Unblocking will allow this partner to resume posting or claiming surplus food.'
              : 'Suspension will immediately prevent this user from logging in, creating listings, or requesting pickups.'}
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button variant="ghost" size="sm" onClick={() => setConfirmBlockUser(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmBlockUser?.status === 'blocked' ? 'primary' : 'danger'}
              size="sm"
              onClick={handleToggleBlock}
            >
              Confirm {confirmBlockUser?.status === 'blocked' ? 'Reinstatement' : 'Suspension'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal to Resolve Report */}
      <Modal
        isOpen={Boolean(resolveReportModal)}
        onClose={() => setResolveReportModal(null)}
        title="Resolve Food Safety / Pickup Report"
        description={`Report #${resolveReportModal?.id} concerning "${resolveReportModal?.targetTitle}"`}
      >
        <form onSubmit={handleResolveReport} className="space-y-4">
          <Input
            label="Resolution Action &amp; Audit Notes"
            rows={3}
            placeholder="e.g. Spoke with donor kitchen manager. Cold-chain storage protocol verified. Warning recorded."
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button variant="ghost" size="sm" onClick={() => setResolveReportModal(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Mark as Resolved
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
