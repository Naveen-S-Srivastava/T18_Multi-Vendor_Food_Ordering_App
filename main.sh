#!/bin/bash

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
