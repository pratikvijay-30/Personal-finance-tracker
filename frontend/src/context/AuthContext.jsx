import { useMemo, useState } from "react";
import { createSeedData } from "../data/finance";
import { AuthContext } from "./contexts";

const USERS_KEY = "pocketwise:users";
const SESSION_KEY = "pocketwise:session";
const demoUser = { id: "demo-user", name: "Aarav Mehta", email: "demo@pocketwise.app", passwordHash: "demo1234", createdAt: new Date().toISOString() };

function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!users.some((user) => user.email === demoUser.email)) users.push(demoUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    if (!localStorage.getItem(`pocketwise:finance:${demoUser.id}`)) {
      localStorage.setItem(`pocketwise:finance:${demoUser.id}`, JSON.stringify(createSeedData(demoUser.id)));
    }
    return users;
  } catch (error) {
    console.error("Could not load local accounts.", error);
    return [demoUser];
  }
}

function readSession() {
  try {
    const id = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return getUsers().find((user) => user.id === id) || null;
  } catch (error) {
    console.error("Could not restore the saved session.", error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const login = (email, password, remember = true) => {
    const account = getUsers().find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase());
    if (!account || account.passwordHash !== password) throw new Error("Email or password isn’t correct.");
    setUser(account);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if (remember) localStorage.setItem(SESSION_KEY, account.id);
    else sessionStorage.setItem(SESSION_KEY, account.id);
    return account;
  };

  const signup = ({ name, email, password }) => {
    const users = getUsers();
    if (users.some((entry) => entry.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const account = {
      id: `user-${crypto.randomUUID()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, account]));
    localStorage.setItem(`pocketwise:finance:${account.id}`, JSON.stringify(createSeedData(account.id)));
    localStorage.setItem(SESSION_KEY, account.id);
    setUser(account);
    return account;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
