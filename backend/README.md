# BytXl E-commerce Backend API

## Test

Base URL: `http://localhost:5000`

Import these into Thunder Client or run with curl. For all protected routes, set header: `Authorization: Bearer YOUR_JWT_TOKEN`.

- **Register (supports role)**
  - Method/URL: POST `http://localhost:5000/api/auth/register`
  - Body (JSON):
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "buyer" // or "retailer"
    }
    ```

- **Login**
  - Method/URL: POST `http://localhost:5000/api/auth/login`
  - Body (JSON):
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - Copy `token` from response and use as `Authorization: Bearer <token>`
  - The response includes `user` with a `role` field (`buyer` or `retailer`).

- **Get Profile**
  - GET `http://localhost:5000/api/users/profile`

- **Update Profile**
  - PUT `http://localhost:5000/api/users/profile`
  - Body (JSON):
    ```json
    {
      "name": "John Updated",
      "email": "john.updated@example.com",
      "phone": "+91-9876543210",
      "address": "Bangalore, India"
    }
    ```

- **List Products (search/filter/paginate, PUBLIC)**
  - GET `http://localhost:5000/api/products?search=rice&category=Grocery&minPrice=50&maxPrice=600&page=1&limit=10&sortBy=price&sortOrder=asc`

- **Create Product (retailer-only)**
  - POST `http://localhost:5000/api/products`
  - Body (JSON):
    ```json
    {
      "name": "Basmati Rice 10kg",
      "description": "Premium long-grain basmati",
      "category": "Grocery",
      "price": 520,
      "stock": 25,
      "tags": ["rice", "basmati", "grocery"]
    }
    ```

- **Create Order (authenticated buyer/retailer)**
  - POST `http://localhost:5000/api/orders`
  - Body (JSON):
    ```json
    {
      "products": [
        { "product": "PUT_PRODUCT_ID", "quantity": 2 },
        { "product": "PUT_ANOTHER_PRODUCT_ID", "quantity": 1 }
      ]
    }
    ```

- **Generate Recommendations**
  - POST `http://localhost:5000/api/recommendations/generate`

- **Get Recommendations**
  - GET `http://localhost:5000/api/recommendations`

A comprehensive Node.js/Express backend API for an e-commerce platform with user authentication, product management, order processing, and intelligent recommendations.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **Product Management**: CRUD operations with search, filtering, and pagination
- **Order Management**: Complete order processing system
- **Recommendation System**: AI-powered product recommendations based on user behavior
- **User Profile Management**: Complete user profile CRUD operations
- **Security**: Password hashing, JWT tokens, and middleware protection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BytXl/project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/qwipo
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
   ```bash
   node seed.js
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
  - Response includes `{ token, user }` where `user.role` is `buyer` or `retailer` and the JWT embeds the role.

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `DELETE /account` - Delete user account
- `GET /all` - Get all users (admin)
- `POST /upgrade-retailer` - Upgrade current user to `retailer`

### Product Routes (`/api/products`)
- `GET /` - Get all products (with search, filter, pagination) [PUBLIC]
- `GET /:id` - Get single product [PUBLIC]
- `GET /mine/list` - Get products created by the logged-in retailer [retailer-only]
- `POST /` - Create new product [retailer-only]
- `PUT /:id` - Update product (ownership enforced) [retailer-only]
- `DELETE /:id` - Delete product (ownership enforced) [retailer-only]

#### Product Query Parameters
- `search` - Search in name, description, tags
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `tags` - Filter by tags (comma-separated)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

### Order Routes (`/api/orders`)
- `GET /` - Get orders for the logged-in user
- `GET /:id` - Get single order (must belong to the user)
- `POST /` - Create new order (stock checked, optional coupon)
- `PUT /:id` - Update order status
- `GET /retailer/sales` - Get orders containing products listed by the logged-in retailer [retailer-only]

### Recommendation Routes (`/api/recommendations`)
- `GET /` - Get user recommendations
- `POST /generate` - Generate new recommendations
- `POST /` - Create manual recommendation (admin)
- `DELETE /:id` - Delete recommendation

## 🔧 Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Search products (PUBLIC)
```bash
curl "http://localhost:5000/api/products?search=rice&category=Seeds&minPrice=100&maxPrice=300"
```

### Generate recommendations
```bash
curl -X POST http://localhost:5000/api/recommendations/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   └── recommendation.controller.js
│   ├── models/             # Database schemas
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   └── recommendation.model.js
│   ├── routes/             # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   └── recommendation.routes.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.middleware.js
│   ├── config/            # Configuration files
│   │   └── db.config.js
│   └── app.js             # Express app setup
├── data/                  # Seed data
│   └── products.json
├── seed.js               # Database seeding script
├── server.js             # Server entry point
├── package.json
└── .env                  # Environment variables
```

## 🤖 Recommendation System

The recommendation system uses multiple algorithms:

1. **Trending Products**: For new users without purchase history
2. **Category-based**: Recommends products from frequently purchased categories
3. **Price-based**: Suggests products within user's typical price range
4. **Complementary**: Recommends products from different categories
5. **Collaborative Filtering**: Based on similar user behaviors

### Recommendation Reasons
- `frequently_bought` - Based on purchase frequency
- `similar_category` - Same category as previous purchases
- `price_range` - Within user's price preferences
- `user_preference` - Based on user ratings/behavior
- `trending` - Popular products
- `seasonal` - Seasonal recommendations
- `complementary` - Complementary products

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication (JWT includes `userId`, `email`, `role`)
- Protected routes with middleware
- Input validation
- CORS enabled
- Request logging with Morgan

## 🚀 Deployment

1. **Environment Variables**: Set up production environment variables
2. **Database**: Use MongoDB Atlas for production
3. **Security**: Use strong JWT secrets and enable HTTPS
4. **Monitoring**: Add logging and monitoring solutions

## 📝 Notes & TODO

- Role-based access: product mutations and retailer sales endpoints require `role=retailer`.
- Public product browsing is open (no auth).
- [ ] Add input validation middleware
- [ ] Implement rate limiting
- [ ] Add API documentation with Swagger
- [ ] Add unit tests
- [ ] Implement caching with Redis
- [ ] Add email notifications
- [ ] Implement admin middleware
- [ ] Add file upload for product images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email support@bytxl.com or create an issue in the repository.
