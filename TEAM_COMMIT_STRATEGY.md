# 🎓 Team Project - Git Commit Strategy

## Team Members & Responsibilities

### Backend Team (50%)

#### 1. **whoisyashu** (Backend - 25%)
**Modules:** Authentication, User Management, Cart System

**Feature Branches:**
```bash
feature-whoisyashu-auth-setup
feature-whoisyashu-user-model
feature-whoisyashu-auth-controller
feature-whoisyashu-auth-routes
feature-whoisyashu-cart-model
feature-whoisyashu-cart-controller
feature-whoisyashu-cart-routes
feature-whoisyashu-payment-service
```

**Files to Commit:**
- `backend/models/User.js`
- `backend/controllers/authController.js`
- `backend/routes/authRoutes.js`
- `backend/middleware/auth.js`
- `backend/models/Cart.js`
- `backend/controllers/cartController.js`
- `backend/routes/cartRoutes.js`
- `backend/services/paymentService.js`
- `backend/utils/socketHelper.js`

---

#### 2. **Naveen-S-Srivastava** (Backend - 25%)
**Modules:** Restaurant, Menu, Order Management

**Feature Branches:**
```bash
feature-naveen-restaurant-model
feature-naveen-restaurant-controller
feature-naveen-restaurant-routes
feature-naveen-menu-model
feature-naveen-menu-controller
feature-naveen-order-model
feature-naveen-order-controller
feature-naveen-delivery-system
```

**Files to Commit:**
- `backend/models/Restaurant.js`
- `backend/controllers/restaurantController.js`
- `backend/routes/restaurantRoutes.js`
- `backend/models/MenuItem.js`
- `backend/controllers/menuController.js`
- `backend/routes/menuRoutes.js`
- `backend/models/Order.js`
- `backend/controllers/orderController.js`
- `backend/routes/orderRoutes.js`
- `backend/controllers/deliveryController.js`
- `backend/routes/deliveryRoutes.js`
- `backend/utils/mapHelper.js`

---

### Frontend Team (50%)

#### 3. **yashraj-03** (Frontend - 25%)
**Modules:** Auth Pages, Home, Customer Pages, Cart

**Feature Branches:**
```bash
feature-yashraj-auth-context
feature-yashraj-login-page
feature-yashraj-register-page
feature-yashraj-home-page
feature-yashraj-restaurant-list
feature-yashraj-cart-page
feature-yashraj-orders-page
feature-yashraj-api-service
```

**Files to Commit:**
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/context/CartContext.jsx`
- `frontend/src/pages/auth/Login.jsx`
- `frontend/src/pages/auth/Register.jsx`
- `frontend/src/pages/auth/Auth.css`
- `frontend/src/pages/Home.jsx`
- `frontend/src/pages/Home.css`
- `frontend/src/pages/customer/RestaurantList.jsx`
- `frontend/src/pages/customer/Cart.jsx`
- `frontend/src/pages/customer/Orders.jsx`
- `frontend/src/pages/customer/CustomerPages.css`
- `frontend/src/services/api.js`
- `frontend/src/services/socket.js`

---

#### 4. **pankitjain-gif** (Frontend - 25%)
**Modules:** Dashboards, Components, Layout

**Feature Branches:**
```bash
feature-pankitjain-button-component
feature-pankitjain-input-component
feature-pankitjain-header-footer
feature-pankitjain-vendor-dashboard
feature-pankitjain-delivery-dashboard
feature-pankitjain-admin-dashboard
feature-pankitjain-global-styles
feature-pankitjain-app-routing
```

**Files to Commit:**
- `frontend/src/components/common/Button.jsx`
- `frontend/src/components/common/Button.css`
- `frontend/src/components/common/Input.jsx`
- `frontend/src/components/common/Input.css`
- `frontend/src/components/common/Card.jsx`
- `frontend/src/components/common/Loading.jsx`
- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/layout/Header.css`
- `frontend/src/components/layout/Footer.jsx`
- `frontend/src/components/layout/Footer.css`
- `frontend/src/pages/vendor/VendorDashboard.jsx`
- `frontend/src/pages/vendor/VendorPages.css`
- `frontend/src/pages/delivery/DeliveryDashboard.jsx`
- `frontend/src/pages/admin/AdminDashboard.jsx`
- `frontend/src/styles/global.css`
- `frontend/src/App.jsx`

---

## 📋 Git Workflow for Each Member

### Step 1: Clone Repository
```bash
git clone https://github.com/Naveen-S-Srivastava/T18_Multi-Vendor_Food_Ordering_App.git
cd T18_Multi-Vendor_Food_Ordering_App
```

### Step 2: Create Feature Branch
```bash
# Example for whoisyashu
git checkout -b feature-whoisyashu-auth-setup
```

### Step 3: Add Your Files
```bash
# Add specific files only
git add backend/models/User.js
git add backend/controllers/authController.js
```

### Step 4: Commit with Proper Message
```bash
git commit -m "feat: implement user authentication model with JWT"
```

### Step 5: Push Branch
```bash
git push origin feature-whoisyashu-auth-setup
```

### Step 6: Create Pull Request
1. Go to GitHub repository
2. Click "Pull Requests" → "New Pull Request"
3. Select your feature branch
4. Add description of changes
5. Assign 2 reviewers from team
6. Submit PR

### Step 7: Review Process
- Reviewers check code
- Suggest improvements
- Approve PR
- Team Lead merges to main

---

## 🎯 Commit Message Guidelines

### Format:
```
<type>: <short description>

[optional body]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: UI/CSS changes
- `docs`: Documentation
- `test`: Tests
- `chore`: Build/config changes

### Examples:
```bash
feat: implement login API with JWT authentication
fix: resolve cart quantity update bug
refactor: optimize restaurant search query
style: add responsive design to header component
docs: update API documentation for order endpoints
test: add unit tests for auth controller
chore: configure MongoDB connection
```

---

## 📝 Detailed Commit Plan

### whoisyashu (10 commits)
```bash
1. git commit -m "feat: setup backend project structure and dependencies"
2. git commit -m "feat: implement User model with role-based authentication"
3. git commit -m "feat: add password hashing with bcrypt"
4. git commit -m "feat: create JWT token generation utility"
5. git commit -m "feat: implement registration controller and routes"
6. git commit -m "feat: implement login controller with validation"
7. git commit -m "feat: add authentication middleware for protected routes"
8. git commit -m "feat: create Cart model with multi-vendor support"
9. git commit -m "feat: implement cart CRUD operations controller"
10. git commit -m "feat: integrate Razorpay payment service"
```

### Naveen-S-Srivastava (10 commits)
```bash
1. git commit -m "feat: create Restaurant model with geolocation"
2. git commit -m "feat: implement restaurant CRUD controller"
3. git commit -m "feat: add restaurant search and filter functionality"
4. git commit -m "feat: create MenuItem model with categories"
5. git commit -m "feat: implement menu management controller"
6. git commit -m "feat: add menu availability toggle feature"
7. git commit -m "feat: create Order model with status tracking"
8. git commit -m "feat: implement order lifecycle management"
9. git commit -m "feat: add delivery partner assignment logic"
10. git commit -m "feat: implement distance calculation utilities"
```

### yashraj-03 (10 commits)
```bash
1. git commit -m "feat: setup React project with Vite"
2. git commit -m "feat: create AuthContext with JWT integration"
3. git commit -m "feat: implement CartContext with state management"
4. git commit -m "feat: create login page with form validation"
5. git commit -m "feat: create registration page with role selection"
6. git commit -m "style: design home page with hero section"
7. git commit -m "feat: implement restaurant listing with filters"
8. git commit -m "feat: create shopping cart page with quantity controls"
9. git commit -m "feat: implement order history page with status badges"
10. git commit -m "feat: setup Axios API service with interceptors"
```

### pankitjain-gif (10 commits)
```bash
1. git commit -m "feat: create reusable Button component with variants"
2. git commit -m "feat: create Input component with validation states"
3. git commit -m "feat: implement Card component with shadow levels"
4. git commit -m "feat: create responsive Header with navigation"
5. git commit -m "feat: implement Footer with social links"
6. git commit -m "feat: create Vendor Dashboard with stats"
7. git commit -m "feat: implement Delivery Partner Dashboard"
8. git commit -m "feat: create Admin Dashboard with analytics"
9. git commit -m "style: implement global design system with color palette"
10. git commit -m "feat: setup React Router with protected routes"
```

---

## 🔄 Branch Workflow Example

### whoisyashu Example Workflow:

```bash
# 1. Start with main
git checkout main
git pull origin main

# 2. Create feature branch for auth
git checkout -b feature-whoisyashu-auth-setup

# 3. Add backend structure files
git add backend/package.json backend/server.js backend/config/
git commit -m "feat: setup backend project structure and dependencies"

# 4. Push branch
git push origin feature-whoisyashu-auth-setup

# 5. Create PR on GitHub (assign reviewers)

# 6. After PR merged, start next feature
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-user-model

# 7. Add User model
git add backend/models/User.js
git commit -m "feat: implement User model with role-based authentication"

# 8. Continue process...
```

---

## 📊 Equal Distribution Verification

| Member | Backend Files | Frontend Files | Total | Percentage |
|--------|--------------|----------------|-------|------------|
| whoisyashu | 9 files | 0 files | 9 | 25% |
| Naveen-S-Srivastava | 12 files | 0 files | 12 | 25% |
| yashraj-03 | 0 files | 13 files | 13 | 25% |
| pankitjain-gif | 0 files | 16 files | 16 | 25% |

---

## ⚠️ Important Rules

1. **Never commit directly to main** - Always use feature branches
2. **Each PR needs 2 reviewers** - Get approvals before merging
3. **Write meaningful commit messages** - Follow the format
4. **Commit small changes** - Don't commit everything at once
5. **Pull before push** - Always sync with main first
6. **Review others' code** - Actively participate in reviews
7. **Test before PR** - Ensure your code works
8. **Document changes** - Update README if needed

---

## 🚀 Quick Start Commands

### For whoisyashu:
```bash
git checkout -b feature-whoisyashu-auth-setup
# Work on backend/models/User.js
git add backend/models/User.js
git commit -m "feat: implement User model with role-based authentication"
git push origin feature-whoisyashu-auth-setup
# Create PR on GitHub
```

### For Naveen-S-Srivastava:
```bash
git checkout -b feature-naveen-restaurant-model
# Work on backend/models/Restaurant.js
git add backend/models/Restaurant.js
git commit -m "feat: create Restaurant model with geolocation"
git push origin feature-naveen-restaurant-model
# Create PR on GitHub
```

### For yashraj-03:
```bash
git checkout -b feature-yashraj-auth-context
# Work on frontend/src/context/AuthContext.jsx
git add frontend/src/context/AuthContext.jsx
git commit -m "feat: create AuthContext with JWT integration"
git push origin feature-yashraj-auth-context
# Create PR on GitHub
```

### For pankitjain-gif:
```bash
git checkout -b feature-pankitjain-button-component
# Work on frontend/src/components/common/Button.jsx
git add frontend/src/components/common/Button.jsx Button.css
git commit -m "feat: create reusable Button component with variants"
git push origin feature-pankitjain-button-component
# Create PR on GitHub
```

---

## 📱 PR Review Checklist

When reviewing a teammate's PR:

- [ ] Code follows project structure
- [ ] No console.log or debug code
- [ ] Proper error handling
- [ ] Code is well-commented
- [ ] No merge conflicts
- [ ] Tests pass (if applicable)
- [ ] Follows naming conventions
- [ ] UI is responsive (for frontend)
- [ ] API returns correct responses (for backend)

---

## 🎓 Evaluation Points

Each member will be evaluated on:

1. **Number of commits** (15 marks) - Aim for 10+ meaningful commits
2. **Code quality** (10 marks) - Clean, organized, documented code
3. **PR creation** (10 marks) - Well-described PRs with proper titles
4. **PR reviews** (5 marks) - Active participation in reviewing
5. **Collaboration** (10 marks) - Team communication and support

**Total Individual Score: 50 marks**

---

## 📞 Support Commands

```bash
# Check current branch
git branch

# See commit history
git log --oneline

# See changes
git status

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Update from main
git checkout main
git pull origin main
git checkout your-branch
git merge main

# Resolve conflicts
# Edit conflicted files
git add .
git commit -m "fix: resolve merge conflicts"
```

---

## ✅ Final Checklist

Before submission, ensure:

- [ ] All 4 members have 10+ commits each
- [ ] All commits follow naming convention
- [ ] All PRs have been reviewed and merged
- [ ] README.md is complete
- [ ] .env.example is present
- [ ] Code runs without errors
- [ ] Documentation is clear
- [ ] No debug/dummy code
- [ ] All features working
- [ ] GitHub activity shows equal contribution

---

**Good luck! 🎉**

**Remember:** Quality over quantity. Write clean, meaningful code and communicate well with your team!
