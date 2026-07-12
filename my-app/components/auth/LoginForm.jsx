"use client";

export default function LoginForm() {
  return (
    <form className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-sm">
      <div><h1 className="text-2xl font-semibold">Welcome back</h1><p className="mt-1 text-sm text-slate-500">Sign in to manage your fleet.</p></div>
      <input className="w-full rounded-md border border-slate-300 p-3" type="email" name="email" placeholder="Email address" required />
      <input className="w-full rounded-md border border-slate-300 p-3" type="password" name="password" placeholder="Password" required />
      <button className="w-full rounded-md bg-slate-900 p-3 font-medium text-white" type="submit">Sign in</button>
    </form>
  );
}
