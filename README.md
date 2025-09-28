# BytXl E-commerce Backend API

## Test

Base URL: `http://localhost:5000`

Import these into Thunder Client or run with curl. For all protected routes, set header: `Authorization: Bearer YOUR_JWT_TOKEN`.

- **Register**
  - Method/URL: POST `http://localhost:5000/api/auth/register`
  - Body (JSON):
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
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

- **Get Profile**
  - GET `http://localhost:5000/api/user/profile`

- **Update Profile**
  - PUT `http://localhost:5000/api/user/profile`
  - Body (JSON):
    ```json
    {
      "name": "John Updated",
      "email": "john.updated@example.com",
      "phone": "+91-9876543210",
      "address": "Bangalore, India"
    }
    ```

- **List Products (search/filter/paginate)**
  - GET `http://localhost:5000/api/products?search=rice&category=Grocery&minPrice=50&maxPrice=600&page=1&limit=10&sortBy=price&sortOrder=asc`

- **Create Product**
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

- **Create Order**
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

### User Routes (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `DELETE /account` - Delete user account
- `GET /all` - Get all users (admin)

### Product Routes (`/api/products`)
- `GET /` - Get all products (with search, filter, pagination)
- `GET /:id` - Get single product
- `POST /` - Create new product (authenticated)
- `PUT /:id` - Update product (authenticated)
- `DELETE /:id` - Delete product (authenticated)

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
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `POST /` - Create new order
- `PUT /:id` - Update order status

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

### Search products
```bash
curl "http://localhost:5000/api/products?search=rice&category=Grocery&minPrice=100&maxPrice=300" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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
- JWT token authentication
- Protected routes with middleware
- Input validation
- CORS enabled
- Request logging with Morgan

## 🚀 Deployment

1. **Environment Variables**: Set up production environment variables
2. **Database**: Use MongoDB Atlas for production
3. **Security**: Use strong JWT secrets and enable HTTPS
4. **Monitoring**: Add logging and monitoring solutions

## 📝 TODO

- [ ] Add input validation middleware
- [ ] Implement rate limiting
- [ ] Add API documentation with Swagger
- [ ] Add unit tests
- [ ] Implement caching with Redis
- [ ] Add email notifications
- [ ] Implement admin middleware
- [ ] Add file upload for product images

🛒 Qwipo ML Engine – Intelligent Product Recommendation Platform

Qwipo ML Engine is a next-generation AI-powered product recommendation system built to empower retailers with actionable product insights, personalized suggestions, and real-time market trend intelligence.
The platform integrates machine learning, Google Gemini LLM, and e-commerce market APIs to help retailers optimize their inventory and stay ahead of consumer demand.

📌 Table of Contents

Overview

Key Features

Tech Stack

Project Structure

Installation & Setup

Environment Variables

Usage

API Endpoints

Future Enhancements

Contributing

License

🌟 Overview

Retailers often struggle with product discovery, missing out on trending items and profitable inventory opportunities.
The Qwipo ML Engine solves this by:

Analyzing transaction history and purchase behavior.

Recommending products using a hybrid recommendation engine.

Fetching trending e-commerce products (Amazon/Flipkart).

Providing AI-generated explanations for every recommendation.

This helps retailers stay ahead of competitors and grow their business with data-driven decision making.

🚀 Key Features

✅ Personalized Recommendations

Generates product suggestions based on retailer transaction data and product attributes.

✅ Hybrid Recommender System

Combines Collaborative Filtering (CF) and Content-Based Filtering (CB) for maximum accuracy.

✅ Market Trend Insights

Integrates with Amazon/Flipkart APIs to fetch real-time trending products and growth opportunities.

✅ AI-Powered Explanations

Uses Google Gemini to explain why each product is recommended in human-readable business language.

✅ Retailer Dashboard (Planned)

Web-based dashboard to view recommendations, trending products, and actionable tips.

💻 Tech Stack
Layer	Technology	Purpose
Backend	FastAPI	REST API for recommendation engine, Gemini integration, and trend scraping.
Machine Learning	Hybrid Recommender (CF + CB)	Personalized product suggestions.
LLM	Google Gemini API (google-generativeai)	Natural language explanations for recommendations.
Database	CSV / Pandas DataFrames	Stores transactions and product catalog (for MVP).
Frontend	React.js	Retailer-facing web interface to display recommendations and insights.
Environment Management	Python-dotenv	Secure storage of API keys and configuration.
Deployment	Uvicorn / ASGI	High-performance backend server.
📂 Project Structure
qwipo-ml-engine/
│
├─ backend/
│  ├─ main.py                 # FastAPI entry point
│  ├─ features.py             # Data loading & preprocessing
│  ├─ cf_model.py             # Collaborative Filtering logic
│  ├─ cb_model.py             # Content-Based logic
│  ├─ hybrid.py               # Hybrid Recommender
│  ├─ llm_utils.py            # Gemini integration
│  └─ data/
│     ├─ products.csv         # Product catalog
│     └─ transactions.csv     # Sample transaction history
│
├─ frontend/
│  ├─ src/
│  │   ├─ App.js              # React main app
│  │   ├─ components/         # UI components
│  │   └─ services/api.js     # Axios API calls
│
├─ .env.example               # Sample environment variables
├─ requirements.txt           # Python dependencies
└─ README.md                  # Project documentation

⚙ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/qwipo-ml-engine.git
cd qwipo-ml-engine

2️⃣ Backend Setup
cd backend
python -m venv .venv
source .venv/bin/activate      # (Linux/Mac)
.venv\Scripts\activate         # (Windows)
pip install -r requirements.txt

3️⃣ Frontend Setup
cd frontend
npm install
npm start

🔑 Environment Variables

Create a .env file inside backend/:

GEMINI_API_KEY=your_google_gemini_api_key
TREND_API_KEY=your_amazon_or_flipkart_api_key

▶ Usage

Run Backend

cd backend
uvicorn main:app --reload


Backend will run at: http://localhost:8000

Run Frontend

cd frontend
npm start


Frontend will run at: http://localhost:3000

🔌 API Endpoints
Method	Endpoint	Description
POST	/recommend	Get personalized product recommendations.
GET	/trending (Planned)	Fetch trending e-commerce products from Amazon/Flipkart.
GET	/health	Health check endpoint.
🔮 Future Enhancements
Feature	Technology
Trending Product Integration	Amazon Product Advertising API / Flipkart Affiliate API
Database Upgrade	PostgreSQL/MySQL for scalable data storage
Real-time Recommendations	Kafka + TensorFlow Serving
Advanced ML Models	Neural Collaborative Filtering (NCF), DeepFM
Analytics Dashboard	React + Tailwind + Chart.js
Smart Inventory Forecasting	Prophet / ARIMA
🤝 Contributing

Contributions are welcome!
Please fork the repository and submit a pull request with detailed changes.

📜 License

This project is licensed under the MIT License – free to use and modify.

🌟 Acknowledgements

FastAPI
 for a blazing-fast backend.

Google Gemini API
 for powerful natural language generation.

Amazon Product Advertising API
 & Flipkart Affiliate API
 for trending product insights.



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email 231fa04464@gmail.com or create an issue in the repository.
