const users = [
  { name: "Owner", email: "owner@coffeeniche.id", role: "Owner" },
  { name: "Rina", email: "rina@coffeeniche.id", role: "Admin" },
  { name: "Dimas", email: "dimas@coffeeniche.id", role: "Kasir" },
];

export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#2c1f1a]">User</h1>
      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <div key={user.email} className="flex items-center justify-between rounded-2xl border border-[#efe1d1] bg-[#fffaf5] p-4 shadow-sm">
            <div>
              <p className="font-semibold text-[#2f231d]">{user.name}</p>
              <p className="text-sm text-[#7d695d]">{user.email}</p>
            </div>
            <span className="rounded-full bg-[#f2e5d9] px-3 py-1 text-xs font-medium text-[#7a4a2a]">{user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
