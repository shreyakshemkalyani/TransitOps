import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [CredentialsProvider({
    name: "Credentials",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize() { return null; },
  })],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};
