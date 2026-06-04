// ============================================================
// localStorage Utilities for AuthDash
// ============================================================

const USERS_KEY         = 'authdash_users';
const CURRENT_USER_KEY  = 'authdash_current_user';
const SETTINGS_KEY      = 'authdash_settings';

// ----------------------------------------------------------------
// Users
// ----------------------------------------------------------------

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    createdAt: new Date().toISOString().split('T')[0],
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, message: 'Account created successfully!', user: newUser };
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const match = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.password === password
  );
  if (!match) {
    return { success: false, message: 'Invalid email or password. Please try again.' };
  }
  // Record last login timestamp on the user record
  const updatedUsers = users.map((u) =>
    u.id === match.id ? { ...u, lastLogin: new Date().toISOString() } : u
  );
  saveUsers(updatedUsers);

  const sessionUser = {
    id: match.id,
    name: match.name,
    email: match.email,
    lastLogin: new Date().toISOString(),
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return { success: true, message: `Welcome back, ${match.name}!`, user: sessionUser };
}

// ----------------------------------------------------------------
// Profile update
// ----------------------------------------------------------------

/**
 * Update the logged-in user's name and/or email.
 * Checks for email uniqueness against other accounts.
 */
export function updateProfile({ id, name, email }) {
  const users = getUsers();
  const conflict = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.id !== id
  );
  if (conflict) {
    return { success: false, message: 'That email is already used by another account.' };
  }

  const updatedUsers = users.map((u) =>
    u.id === id
      ? { ...u, name: name.trim(), email: email.toLowerCase().trim() }
      : u
  );
  saveUsers(updatedUsers);

  // Refresh session
  const current = getCurrentUser();
  if (current && current.id === id) {
    const updated = { ...current, name: name.trim(), email: email.toLowerCase().trim() };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  }
  return { success: true, message: 'Profile updated successfully.' };
}

// ----------------------------------------------------------------
// Password change
// ----------------------------------------------------------------

export function changePassword({ id, currentPassword, newPassword }) {
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) {
    return { success: false, message: 'User not found.' };
  }
  if (user.password !== currentPassword) {
    return { success: false, message: 'Current password is incorrect.' };
  }
  const updatedUsers = users.map((u) =>
    u.id === id ? { ...u, password: newPassword } : u
  );
  saveUsers(updatedUsers);
  return { success: true, message: 'Password changed successfully.' };
}

// ----------------------------------------------------------------
// Session
// ----------------------------------------------------------------

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

// ----------------------------------------------------------------
// Settings
// ----------------------------------------------------------------

const DEFAULT_SETTINGS = {
  theme: 'dark',
  rememberMe: false,
  emailNotifications: true,
  marketingNotifications: false,
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
