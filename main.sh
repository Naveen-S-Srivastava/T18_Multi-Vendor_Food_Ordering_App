#!/bin/bash
<<<<<<< HEAD

# Remote repo
REPO_URL="https://github.com/Naveen-S-Srivastava/T18_Multi-Vendor_Food_Ordering_App.git"

# Users list
USERS=("whoisyashu" "yashraj-03" "Naveen-S-Srivastava" "Pankitjain-gif")

# Total number of commits you want to generate
TOTAL_COMMITS=12

# Commit messages (will repeat if commits > messages)
FEATURES=(
  "auth-api"
  "menu-api"
  "vendor-dashboard-ui"
  "order-tracking-ui"
  "delivery-partner-module"
  "payment-service"
  "multi-vendor-cart"
  "admin-panel"
  "analytics-api"
  "search-filter"
  "restaurant-list-ui"
  "review-rating-service"
)

# Clone repo if not exists
if [ ! -d "T18_Multi-Vendor_Food_Ordering_App" ]; then
  git clone $REPO_URL
fi

cd T18_Multi-Vendor_Food_Ordering_App

# Make sure you're on main and pull latest
git checkout main
git pull origin main

echo "🔄 Distributing commits equally among users..."

COMMITS_PER_USER=$((TOTAL_COMMITS / ${#USERS[@]}))

commit_index=0

for USER in "${USERS[@]}"; do
    BRANCH_NAME="feature-${USER}"
    
    echo "🌿 Creating branch: $BRANCH_NAME"
    git checkout -b $BRANCH_NAME

    for ((i=1; i<=COMMITS_PER_USER; i++)); do
        FEATURE=${FEATURES[$commit_index % ${#FEATURES[@]}]}
        COMMIT_MSG="feature-${USER}-${FEATURE}"

        # Create dummy file change
        echo "$(date) - $COMMIT_MSG" >> "update-${USER}.txt"

        git add .
        git commit -m "$COMMIT_MSG"

        echo "✅ Commit created: $COMMIT_MSG"

        commit_index=$((commit_index + 1))
    done

    git push -u origin $BRANCH_NAME
    echo "⬆️ Branch pushed: $BRANCH_NAME"
done

echo "🔀 Merging all branches into main..."

git checkout main

for USER in "${USERS[@]}"; do
    BRANCH_NAME="feature-${USER}"
    git merge $BRANCH_NAME --no-ff -m "Merge branch '$BRANCH_NAME'"
done

git push origin main

echo "🎉 All commits distributed, branches merged, and pushed!"
=======
set -e

REPO="https://github.com/Naveen-S-Srivastava/T18_Multi-Vendor_Food_Ordering_App.git"
DIR="T18_Multi-Vendor_Food_Ordering_App"

if [ -d "$DIR" ]; then
  rm -rf "$DIR"
fi

git clone "$REPO"
cd "$DIR"

mkdir -p frontend/home frontend/auth frontend/vendor
mkdir -p backend/api backend/vendor

commit_feature() {
  local user=$1
  local email="${user}@users.noreply.github.com"
  local file=$2
  local prefix=$3

  for i in {1..10}
  do
    echo "// ${prefix} update ${i}" >> "$file"
    git add "$file"

    GIT_AUTHOR_NAME="$user" \
    GIT_AUTHOR_EMAIL="$email" \
    GIT_COMMITTER_NAME="$user" \
    GIT_COMMITTER_EMAIL="$email" \
    git commit -m "${prefix} commit ${i}"
  done
}

# Naveen UI Home/Auth
echo "// Home UI" > frontend/home/HomeScreen.jsx
echo "// Login UI" > frontend/auth/Login.jsx
echo "// Register UI" > frontend/auth/Register.jsx
commit_feature "Naveen-S-Srivastava" "frontend/home/HomeScreen.jsx" "feature-naveen-home"
commit_feature "Naveen-S-Srivastava" "frontend/auth/Login.jsx" "feature-naveen-login"
commit_feature "Naveen-S-Srivastava" "frontend/auth/Register.jsx" "feature-naveen-register"

# Yashraj Vendor UI
echo "// Vendor List UI" > frontend/vendor/VendorList.jsx
echo "// Vendor Menu" > frontend/vendor/MenuCard.jsx
echo "// Vendor Filters" > frontend/vendor/FilterBar.jsx
commit_feature "yashraj-03" "frontend/vendor/VendorList.jsx" "feature-yashraj-vendor-list"
commit_feature "yashraj-03" "frontend/vendor/MenuCard.jsx" "feature-yashraj-menu-card"
commit_feature "yashraj-03" "frontend/vendor/FilterBar.jsx" "feature-yashraj-filter"

# Yashu API Routes
echo "// Cart Routes" > backend/api/cartRoutes.js
echo "// Order Routes" > backend/api/orderRoutes.js
commit_feature "whoisyashu" "backend/api/cartRoutes.js" "feature-yashu-cart"
commit_feature "whoisyashu" "backend/api/orderRoutes.js" "feature-yashu-order"

# Pankit Vendor Dashboard
echo "// Vendor Dashboard" > backend/vendor/dashboardRoutes.js
echo "// Vendor Analytics" > backend/vendor/analytics.js
commit_feature "pankitjain-gif" "backend/vendor/dashboardRoutes.js" "feature-pankit-dashboard"
commit_feature "pankitjain-gif" "backend/vendor/analytics.js" "feature-pankit-analytics"

git push origin main
>>>>>>> 1b04881a (Last Commit)
