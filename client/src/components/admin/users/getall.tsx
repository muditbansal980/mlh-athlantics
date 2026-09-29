"use client";

import { useEffect, useState } from "react";
import { fetchallusers } from "../../../../api/admin/users/getallusers";
import { updateUserRole } from "../../../../api/admin/users/roleupdate";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
  User,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Save,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface UserRecord {
  Id: string;
  Username: string;
  Role: string;
  Email: string;
}

type SortKey = keyof UserRecord;
type SortDir = "asc" | "desc";

// Permitted uppercase roles
const AVAILABLE_ROLES = ["PLAYER", "ORGANIZATION", "COACH", "ADMIN"];

// ── Role badge config ──────────────────────────────────────────────────────

const roleMeta: Record<string, { label: string; classes: string }> = {
  admin: {
    label: "ADMIN",
    classes: "bg-violet-50 text-violet-700 border-violet-200",
  },
  moderator: {
    label: "MODERATOR",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  user: {
    label: "USER",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  player: {
    label: "PLAYER",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  organization: {
    label: "ORGANIZATION",
    classes: "bg-teal-50 text-teal-700 border-teal-200",
  },
  coach: {
    label: "COACH",
    classes: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

function getRoleMeta(role: string) {
  const key = role?.toLowerCase();
  return (
    roleMeta[key] ?? {
      label: role?.toUpperCase() ?? "—",
      classes: "bg-stone-50 text-stone-600 border-stone-200",
    }
  );
}

// ── Avatar initials ────────────────────────────────────────────────────────

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return avatarColors[hash % avatarColors.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Sort icon ──────────────────────────────────────────────────────────────

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
}) {
  if (sortKey !== col)
    return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />;
  return sortDir === "asc" ? (
    <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const router = useRouter();
  // Track modified row selections and active saving IDs
  const [localRoles, setLocalRoles] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});

  const loadUsers = () => {
    setLoading(true);
    fetchallusers()
      .then((data) => {
        setUsers(data);
        // Clear old temporary edits on fresh data load
        setLocalRoles({});
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to fetch users.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Track select box changes locally per row
  const handleLocalRoleChange = (userId: string, newRole: string) => {
    setLocalRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  // Triggers API mutation and interface update
  const handleSaveRole = async (userId: string) => {
    const targetRole = localRoles[userId];
    if (!targetRole) return;

    setSavingIds((prev) => ({ ...prev, [userId]: true }));
    try {
      await updateUserRole(userId, targetRole).then((res) => {
        if (!res || res.message !== "User role updated successfully") {
          throw new Error(res?.message || "Unknown error");
        }
      });
      // alert(`Role updated to ${targetRole} for user ID: ${userId}`);
      // Clear the local change for this user after successful save
      // Re-trigger global view synchronization
      loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user role.");
    } finally {
      setSavingIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Filter

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const activeRole = (localRoles[u.Id] || u.Role || "").toLowerCase();
    return (
      u.Username?.toLowerCase().includes(q) ||
      u.Email?.toLowerCase().includes(q) ||
      activeRole.includes(q) ||
      u.Id?.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = (a[sortKey] ?? "").toString().toLowerCase();
        const bVal = (b[sortKey] ?? "").toString().toLowerCase();
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const thClass =
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-stone-400 select-none cursor-pointer hover:text-stone-600 transition-colors";
  const tdClass = "px-4 py-3.5 text-sm text-stone-700";

  return (
    <div className="min-h-dvh bg-[#F5F4F0] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-[22px] font-semibold text-stone-900 tracking-tight">
                Registered Users
              </h1>
            </div>
            <p className="text-sm text-stone-400 ml-10.5">
              {loading
                ? "Loading…"
                : `${sorted.length} of ${users.length} user${users.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm font-medium text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, role, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
          />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-stone-400">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
              <p className="text-sm">Fetching users…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-500">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-stone-700">
                Could not load users
              </p>
              <p className="text-xs text-stone-400 max-w-xs text-center">
                {error}
              </p>
              <button
                onClick={loadUsers}
                className="mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-400">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                <User className="w-6 h-6 text-stone-400" />
              </div>
              <p className="text-sm font-medium text-stone-600">
                No users found
              </p>
              {search && (
                <p className="text-xs text-stone-400">
                  Try a different search term
                </p>
              )}
            </div>
          )}

          {/* Table */}
          {!loading && !error && sorted.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-stone-100 bg-stone-50/60">
                  <tr>
                    <th
                      className={`${thClass} w-14 cursor-default hover:text-stone-400`}
                    >
                      S.No
                    </th>
                    <th className={thClass} onClick={() => handleSort("Id")}>
                      <span className="flex items-center gap-1.5">
                        ID
                        <SortIcon
                          col="Id"
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </span>
                    </th>
                    <th
                      className={thClass}
                      onClick={() => handleSort("Username")}
                    >
                      <span className="flex items-center gap-1.5">
                        Username
                        <SortIcon
                          col="Username"
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </span>
                    </th>
                    <th className={thClass} onClick={() => handleSort("Email")}>
                      <span className="flex items-center gap-1.5">
                        Email
                        <SortIcon
                          col="Email"
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </span>
                    </th>
                    <th className={thClass} onClick={() => handleSort("Role")}>
                      <span className="flex items-center gap-1.5">
                        Role
                        <SortIcon
                          col="Role"
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      </span>
                    </th>
                    <th className={`${thClass} cursor-default hover:text-stone-400 w-32`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {sorted.map((user, index) => {
                    const isOriginalAdmin = user.Role?.toLowerCase() === "admin";
                    const currentSelection = localRoles[user.Id] || user.Role || "";
                    const role = getRoleMeta(currentSelection);
                    const av = avatarColor(user.Username ?? "U");
                    const isSaving = !!savingIds[user.Id];
                    const choiceHasChanged = localRoles[user.Id] && localRoles[user.Id] !== user.Role;

                    return (
                      <tr
                      // onClick={() => router.push(`/admin/user/${user.Id}`)}
                        key={user.Id}
                        className="hover:bg-indigo-50/30 transition-colors"
                      >
                        {/* S.No */}
                        <td
                          className={`${tdClass} text-center text-stone-400 text-xs font-mono`}
                        >
                          {index + 1}
                        </td>

                        {/* ID */}
                        <td className={tdClass}>
                          <span className="font-mono text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                            {user.Id}
                          </span>
                        </td>

                        {/* Username */}
                        <td className={tdClass}>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${av}`}
                            >
                              {initials(user.Username ?? "U")}
                            </div>
                            <span className="font-medium text-stone-800">
                              {user.Username}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className={tdClass}>
                          <span className="text-stone-500">{user.Email}</span>
                        </td>

                        {/* Role Select Dropdown */}
                        <td className={tdClass}>
                          <div className="flex items-center gap-2">
                            {isOriginalAdmin ? (
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${role.classes}`}
                              >
                                <ShieldCheck className="w-3 h-3" />
                                {role.label}
                              </span>
                            ) : (
                              <div className="relative flex items-center">
                                <select
                                  value={currentSelection.toUpperCase()}
                                  disabled={isSaving}
                                  onChange={(e) =>
                                    handleLocalRoleChange(user.Id, e.target.value)
                                  }
                                  className={`text-xs font-medium rounded-full border px-3 py-1 pr-7 bg-white text-stone-700 border-stone-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition appearance-none cursor-pointer disabled:opacity-60`}
                                >
                                  {AVAILABLE_ROLES.map((r) => (
                                    <option key={r} value={r}>
                                      {r}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2.5 pointer-events-none" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Save Action Button */}
                        <td className={tdClass}>
                          {!isOriginalAdmin && choiceHasChanged && (
                            <button
                              onClick={() => handleSaveRole(user.Id)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
                            >
                              {isSaving ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                              Save
                            </button>
                          )}
                          {!isOriginalAdmin && !choiceHasChanged && (
                            <span className="text-xs text-stone-300 italic">Up to date</span>
                          )}
                          {isOriginalAdmin && (
                            <span className="text-xs text-stone-400 font-medium">Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Footer count */}
              <div className="px-4 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-between items-center">
                <p className="text-xs text-stone-400">
                  Showing{" "}
                  <span className="font-medium text-stone-600">
                    {sorted.length}
                  </span>{" "}
                  result{sorted.length !== 1 ? "s" : ""}
                  {search && ` for "${search}"`}
                </p>
                <p className="text-xs text-stone-400">
                  Total registered:{" "}
                  <span className="font-medium text-stone-600">
                    {users.length}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}