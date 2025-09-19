# Tailwind CSS IntelliSense Setup Guide

This guide helps you configure Tailwind CSS IntelliSense for the KAIRO project.

## ✅ Configuration Complete

The following configurations have been applied to your project:

### 1. Updated `tailwind.config.js`
- Added support for all file extensions: `.js`, `.ts`, `.jsx`, `.tsx`, `.mdx`
- Configured content paths for proper file scanning

### 2. VS Code Settings (`.vscode/settings.json`)
- Set `css.lint.unknownAtRules` to "ignore" to prevent Tailwind directive warnings
- Configured Tailwind CSS language support
- Added experimental class regex for better detection
- Enabled string suggestions for className attributes

### 3. Recommended Extensions (`.vscode/extensions.json`)
- Tailwind CSS IntelliSense
- TypeScript support
- Prettier and ESLint

## 🔧 Manual Steps Required

### Step 1: Install/Enable Tailwind CSS IntelliSense Extension
1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "Tailwind CSS IntelliSense" by Brad Cornes
3. Install or enable the extension

### Step 2: Restart VS Code
1. **Complete restart**: Close VS Code entirely and reopen
2. **Or reload window**: Press `Ctrl+Shift+P` → Type "Developer: Reload Window"

### Step 3: Verify Language Mode
1. Open any `.tsx` or `.jsx` file
2. Check bottom-right corner shows "TypeScript React" or "JavaScript React"
3. If it shows "Plain Text", click and select the correct language

## 🚨 Troubleshooting

### IntelliSense Not Working?

1. **Check file is included in content paths**:
   - Your file must be in `src/`, `app/`, `components/`, or `pages/` directory
   - File extension must be `.js`, `.ts`, `.jsx`, `.tsx`, or `.mdx`

2. **Restart VS Code completely**:
   ```bash
   # Close VS Code entirely, then reopen
   ```

3. **Check for extension conflicts**:
   - Temporarily disable other CSS extensions
   - Try default VS Code theme

4. **Verify Tailwind is working**:
   ```bash
   npm run dev
   # Check if Tailwind styles are applied in browser
   ```

5. **Clear VS Code cache**:
   - Close VS Code
   - Delete `.vscode` folder (will be recreated)
   - Reopen and reconfigure

### Still Having Issues?

1. **Check VS Code Output Panel**:
   - View → Output → Select "Tailwind CSS IntelliSense"
   - Look for error messages

2. **Verify Tailwind installation**:
   ```bash
   npm list tailwindcss
   # Should show version 3.3.6 or higher
   ```

3. **Test with simple class**:
   ```jsx
   <div className="bg-blue-500 text-white p-4">
     Test Tailwind
   </div>
   ```

## 📁 Project Structure

Your Tailwind config scans these directories:
```
src/
├── app/           ✅ Included
├── components/    ✅ Included
└── **/*.{js,ts,jsx,tsx,mdx}  ✅ All supported

components/        ✅ Included (root level)
app/              ✅ Included (root level)
pages/            ✅ Included (if using Pages Router)
```

## 🎯 Expected Behavior

When working correctly, you should see:
- Autocomplete suggestions when typing class names
- Color previews for Tailwind color classes
- Hover information showing CSS properties
- No red underlines on valid Tailwind classes

---

**Next Steps**: Restart VS Code and test IntelliSense in any `.tsx` file!