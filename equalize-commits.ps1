# clean-author-fix.ps1

$users = @(
    @{ username="whoisyashu";          email="whoisyashu@users.noreply.github.com" },
    @{ username="yashraj-03";          email="yashraj-03@users.noreply.github.com" },
    @{ username="Naveen-S-Srivastava"; email="Naveen-S-Srivastava@users.noreply.github.com" },
    @{ username="pankitjain-gif";      email="pankitjain-gif@users.noreply.github.com" }
)

$features = @(
    "auth-api",
    "menu-api",
    "vendor-dashboard-ui",
    "order-tracking-ui",
    "restaurant-list-ui",
    "payment-integration",
    "delivery-assignment",
    "rating-review-api",
    "cart-management",
    "menu-crud",
    "admin-dashboard",
    "search-filter"
)

git checkout main

foreach ($u in $users) {
    Write-Host ("`nCreating commits for " + $u.username)

    for ($i = 0; $i -lt 3; $i++) {

        $feature = $features[(Get-Random -Minimum 0 -Maximum $features.Count)]
        $message = "feature-" + $u.username + "-" + $feature

        # File change required for commit
        $file = "log-" + $u.username + ".txt"
        Add-Content $file $message

        git add $file

        $author = """$($u.username) <$($u.email)>"""
        git commit -m $message --author=$author

        Write-Host ("Commit created: " + $message)
    }
}

Write-Host "`nAll commits created with correct authors."
