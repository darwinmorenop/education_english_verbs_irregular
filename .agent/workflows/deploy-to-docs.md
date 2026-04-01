---
description: Build project and deploy to docs folder
---

// turbo-all
1. Run the build script
   ```powershell
   npm run build
   ```

2. Clear the docs directory
   ```powershell
   Remove-Item -Path docs\* -Recurse -Force -ErrorAction SilentlyContinue
   ```

3. Copy build artifacts from dist\browser\ to docs\
   ```powershell
   Copy-Item -Path dist\browser\* -Destination docs\ -Recurse -Force
   ```

4. Commit and push changes
   ```powershell
   git add .
   git commit -m "Deployment update: latest build to docs"
   git push
   ```