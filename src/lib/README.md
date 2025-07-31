# API Layer Documentation

This directory contains the API layer for the Balde de Carnada frontend application, providing a clean abstraction for all backend interactions.

## Structure

```
src/lib/
├── api/
│   ├── client.ts          # HTTP client configuration with interceptors
│   └── auth.ts            # Authentication API methods
├── hooks/
│   └── useAuth.ts         # React Query hooks for authentication
├── providers/
│   └── QueryProvider.tsx  # React Query provider component
├── types/
│   ├── api.ts             # Generic API response types
│   └── auth.ts            # Authentication-related types
└── index.ts               # Main exports
```

## Features

### 🔧 HTTP Client (`client.ts`)
- Axios-based HTTP client with automatic request/response interceptors
- Automatic token attachment to requests
- Global error handling (401 redirects, etc.)
- Cookie-based token management

### 🔐 Authentication API (`auth.ts`)
- Login and registration methods
- User session management
- Token storage and retrieval
- Logout functionality

### 🪝 React Query Hooks (`useAuth.ts`)
- `useLogin()` - Login mutation
- `useRegister()` - Registration mutation
- `useLogout()` - Logout mutation
- `useCurrentUser()` - Get current user data
- `useAuth()` - Combined authentication state

### 📝 TypeScript Types
- Fully typed API responses and requests
- Auth-related interfaces matching backend DTOs
- Generic API response wrappers

## Usage Examples

### Login Component
```tsx
import { useLogin } from '@/lib/hooks/useAuth';

function LoginForm() {
  const loginMutation = useLogin();

  const handleSubmit = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // User is automatically redirected
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

### Authentication Check
```tsx
import { useAuth } from '@/lib/hooks/useAuth';

function ProtectedComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Direct API Call
```tsx
import { AuthAPI } from '@/lib/api/auth';

// Direct API usage (outside of React components)
const user = await AuthAPI.login({ email, password });
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### React Query Setup
The app is wrapped with `QueryProvider` in the root layout for React Query functionality.

## Backend Integration

The API layer is designed to work with the NestJS backend endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

Response format expected:
```json
{
  "success": true,
  "data": { "id": 1, "email": "user@example.com", "name": "User", "role": "user" },
  "message": "Login successful"
}
```

## Future Enhancements

This API layer can be easily extended to support other backend endpoints:

1. **Products API**: Add `src/lib/api/products.ts` and corresponding hooks
2. **Orders API**: Add `src/lib/api/orders.ts` and corresponding hooks
3. **Stock API**: Add `src/lib/api/stock.ts` and corresponding hooks
4. **Reports API**: Add `src/lib/api/reports.ts` and corresponding hooks

Each new API module should follow the same pattern:
- API class with static methods
- Corresponding React Query hooks
- TypeScript interfaces for requests/responses
- Export from main index file
