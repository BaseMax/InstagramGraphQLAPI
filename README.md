# GraphQL API with Next.js and TypeScript

This GraphQL API is built using Next.js and TypeScript, providing access to various features and functionalities. The API follows the GraphQL schema-first approach, where the schema is defined using the GraphQL schema language. The server implementation utilizes Next.js for routing and handling GraphQL requests.

## Prerequisites

- Node.js (version X.X.X)
- Yarn (optional, but recommended)

## Getting Started

1. Clone the repository:

```shell
git clone https://github.com/your-repo-url.git
```

Install the dependencies:
```shell
cd your-repo-folder
yarn install
```

Start the development server:
```shell
yarn dev
```

Access the API at http://localhost:3000/api/graphql

## Authentication

This API uses token-based authentication. To access protected endpoints, include an Authorization header in your requests with the value Bearer YOUR_TOKEN.

## Features

**User Authentication:**

- User registration
- User login
- User logout
- Password reset/forgot password

**User Profile:**

- Retrieve user profile
- Update user profile (name, bio, profile picture)
- Follow/unfollow users
- List followers and following

**Posts:**

- Create a new post
- Retrieve a single post
- Retrieve posts by user
- Retrieve posts in the user's feed (from followed users)
- Like/unlike a post
- Comment on a post
- Delete a post (by the owner)

**Explore:**

- Retrieve popular posts
- Retrieve posts based on hashtags or tags
- Search for users by username or name

**Notifications:**

- Retrieve notifications for the user (likes, comments, follows)
- Mark notifications as read

**Direct Messaging:**

- Send a direct message to a user
- Retrieve direct message conversations
- Mark messages as read

### Queries

- RetrieveUser: Retrieve a user's profile information
- RetrievePost: Retrieve a single post by its ID
- RetrieveUserPosts: Retrieve posts created by a specific user
- RetrieveFeed: Retrieve posts from the users the current user follows
- RetrievePopularPosts: Retrieve popular posts based on likes or comments
- SearchUsers: Search for users based on username or name
- RetrieveNotifications: Retrieve notifications for the current user
- RetrieveDirectMessages: Retrieve direct message conversations for the current user

### Mutations
- CreateUser: Create a new user
- LoginUser: Authenticate and log in a user
- LogoutUser: Log out the current user
- UpdateUserProfile: Update the current user's profile information
- FollowUser: Follow another user
- UnfollowUser: Unfollow a previously followed user
- CreatePost: Create a new post
- LikePost: Like a post
- UnlikePost: Remove a like from a post
- CommentOnPost: Add a comment to a post
- DeletePost: Delete a post
- SendMessage: Send a direct message to another user
- MarkNotificationAsRead: Mark a notification as read
- MarkMessageAsRead: Mark a direct message as read

## Examples

**User Registration Mutation:**

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    name
  }
}
```

**User Login Mutation:**

```graphql
mutation LoginUser($input: LoginUserInput!) {
  loginUser(input: $input) {
    token
  }
}
```

**Get User Profile Query:**

```graphql
query GetUserProfile($userId: ID!) {
  userProfile(userId: $userId) {
    id
    username
    name
    bio
    profilePicture
    followersCount
    followingCount
    postsCount
    followers {
      id
      username
    }
    following {
      id
      username
    }
  }
}
```

**Follow User Mutation:**

```graphql
mutation FollowUser($userId: ID!) {
  followUser(userId: $userId) {
    id
    username
  }
}
```

**Unfollow User Mutation:**

```graphql
mutation UnfollowUser($userId: ID!) {
  unfollowUser(userId: $userId) {
    id
    username
  }
}
```

**Get User's Followers Query:**

```graphql
query GetUserFollowers($userId: ID!) {
  userFollowers(userId: $userId) {
    id
    username
    name
    profilePicture
  }
}
```

**Get User's Following Query:**

```graphql
query GetUserFollowing($userId: ID!) {
  userFollowing(userId: $userId) {
    id
    username
    name
    profilePicture
  }
}
```

**Get User's Feed Query:**

```graphql
query GetUserFeed {
  userFeed {
    id
    caption
    imageUrl
    likesCount
    commentsCount
    createdAt
    user {
      id
      username
      name
      profilePicture
    }
  }
}
```

**Get Post Query:**

```graphql
query GetPost($postId: ID!) {
  post(postId: $postId) {
    id
    caption
    imageUrl
    likesCount
    commentsCount
    createdAt
    user {
      id
      username
      name
      profilePicture
    }
  }
}
```

**Search Users Query:**

```graphql
query SearchUsers($query: String!) {
  searchUsers(query: $query) {
    id
    username
    name
    profilePicture
  }
}
```

These examples cover various features such as user registration, login, profile retrieval, follow/unfollow functionality, fetching followers and following users, getting the user's feed, retrieving a post, and searching for users. Remember to customize the variables and adjust the schema and resolvers accordingly to match your specific implementation.

## Contributing

Contributions are welcome! If you find any issues or would like to add new features, feel free to open a pull request.

## License

This project is licensed under the GPL-3.0 License.

Copyright 2023, Max Base
